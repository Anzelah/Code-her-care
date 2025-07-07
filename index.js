require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const { getNextQuestion, saveAnswer, isComplete } = require('./questionnaire');
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
  res.send('Hello, World!')
})


// Webhook is where my app receive messages from WhatsApp and send replies through it
app.post('/webhook', (req, res) => {
  const from = req.body.From; // retreives the phone number
  const incomingMsg = req.body.Body.trim();

  // if new user, initialize a session with them
  if (!sessions[from]) {
    sessions[from] = { step: -1, hasStarted: false, answers: {} };
    sendMessage(from, "👋 Hi there! Welcome to the Cervical Cancer Risk Checker.\n\nWe'll ask you a few quick questions to estimate your risk level. Kindly answer as accurate as you can. \n\n To begin, please reply with *Hi*");
    return res.sendStatus(200);
  }
  
  // else fetch sessions of the associated number
  const session = sessions[from];
  
  // If user hasn't started, wait for hi 
  if (!session.hasStarted) {
    const triggers = [ 'hi', 'h', 'i', 'hii' ]

    if (triggers.includes(incomingMsg.toLowerCase())) {
      session.hasStarted = true;
      session.step = 0;
      sendMessage(from, getNextQuestion(0));
    } else {
      sendMessage(from, "👋 Please reply with *Hi* to begin the screening.");
    }
    return res.sendStatus(200);
  }

  // User has started. Save answers
  saveAnswer(session, incomingMsg);

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
 
    const response = `${endMsg}\n\n${riskMessages[risk]}\n\n${psMsg}`
    sendMessage(from, response)

    delete sessions[from];
    return res.sendStatus(200)
  } else {
    const nextQ = getNextQuestion(session.step);
    sendMessage(from, nextQ);
  }

  res.sendStatus(200);
});
/*
// test webhook and twilio by simply echoing back a message. its working perfectly.
app.post('/webhook', (req, res) => {
  const from = req.body.From
  const msg = req.body.Body

  console.log(`Message received from ${from}. The message is ${msg}`)

  client.messages.create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: from,
    body: `You said: ${msg}`,
  });
  res.sendStatus(200)
}) */

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
