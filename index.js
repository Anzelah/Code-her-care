require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const { getNextQuestion, saveAnswer, validateAnswer, isComplete } = require('./questionnaire');
const { calculateProbabilisticRisk } = require('./predict');
const sessions = require('./session');

// Set twilios environmental variables.
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const port = process.env.PORT;
const client = twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// for testing purposes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>WhatsApp Cervical Cancer Chatbot</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f9fb;
          color: #333;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
        .container {
          max-width: 500px;
          background-color: #fff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        h1 {
          color: #006644;
          font-size: 24px;
          margin-bottom: 16px;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
        }
        .highlight {
          font-weight: bold;
          color: #e91e63;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to our WhatsApp Cervical Cancer Screening Chatbot</h1>
        <p>To get started, send <span class="highlight">'join period-window'</span> to <span class="highlight">+1 (415) 523-8886</span> on WhatsApp.</p>
        <p>Once you send the message, our chatbot will guide you through a quick cervical cancer risk screening. 💬</p>
      </div>
    </body>
    </html>
  `)
})


// Webhook is where my app receive messages from WhatsApp and send replies through it
app.post('/webhook', (req, res) => {
  const from = req.body.From; // retrieves the phone number
  const incomingMsg = req.body.Body.trim();



  // if new user, initialize a session with them
  if (!sessions[from]) {
    sessions[from] = { step: -1, hasStarted: false, isFinished: false, answers: {} };
    sendMessage(from, "👋 Hi there! Welcome to the Cervical Cancer Risk Checker.\n\nWe'll ask you a few quick questions to estimate your risk level. Kindly answer as accurate as you can. \n\n To begin, please reply with *Hi*");
    return;
  }
  
  // else fetch sessions of the associated number
  const session = sessions[from];

  // Restart support for when the same user wants to restart the questionnaire after completing it
  if (incomingMsg.toLowerCase().includes("restart")) {
    sessions[from] = { step: 0, hasStarted: false, isFinished: false, answers: {},};
    sendMessage(from, questions[0]);
    return;
  }

  // If user had answered all questions, don't restart the questionnaire, unless they explicitly respond with a hi
  if (session.isFinished) {
    sendMessage(from, "✅ You've already completed the assessment. Reply with *Restart* to take it again.")
    return;
  }
  
  // If user hasn't started, wait for hi. This includes cases where it's an empty message
  if (!session.hasStarted) {
    const triggers = [ 'hi', 'h', 'i', 'hii' ]

    if (triggers.includes(incomingMsg.toLowerCase())) {
      session.hasStarted = true;
      session.step = 0;
      sendMessage(from, getNextQuestion(0));
    } else {
      sendMessage(from, "👋 Please reply with *Hi* to begin the screening.");
    }
    return;
  }

  // Validate answer for each step
  const error = validateAnswer(incomingMsg, session.step);
  if (error) {
    sendMessage(from, error + "\n\n" + getNextQuestion(session.step)); // Repeat same question
    return;
  }

  // Valid inputs. Save answers
  saveAnswer(session, incomingMsg);

  // If a user has answered all questions
  if (isComplete(session)) {
    const resp = calculateProbabilisticRisk(session.answers); // returns an object
    const risk = resp.riskLevel // either low, medium or high

    const psMsg = `📌 *Did you know?* Cervical cancer can take up to 10–20 years to develop. It often has no symptoms in early stages — so regular screening is the only way to catch it early.`;
    const endMsg = `You're all done!\n\n Based on your answers, your risk level is: ${risk.toUpperCase()}.`
    const riskMessages = {
      low: `✅ You appear to be at a lower risk. Keep protecting yourself by practicing safe sex and staying informed about your health. Prevention is your best defense`,
      medium: `⚠️ You may be at a *moderate risk*. Since cervical cancer can remain silent for 10-20 years before becoming invasive, we strongly recommend getting screened. Screening is the only way to catch it early!`,
      high: `🚨 You may be at *high risk*. Please go get screened immediately. Early detection will save your life, and starting treatment early often means simpler, less painful care.`,
    }

    // send final message if user has completed the questionnaire
    const response = `${endMsg}\n\n${riskMessages[risk]}\n\n${psMsg}`
    sendMessage(from, response)

    session.isFinished = true;
    return;
  } else {
    const nextQ = getNextQuestion(session.step);
    sendMessage(from, nextQ);
  }
  //res.sendStatus(200);
});


function sendMessage(to, body) {
  client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to,
    body,
  });
}

app.listen(port, () => {
  console.log(`App running on port ${port}`)
});
