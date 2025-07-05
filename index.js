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
  const incomingMsg = req.body.Body.trim().toLowerCase();

  // if new user, initialize their screening(one is a new user if you couldn't find a session associated with the number)
  if (!sessions[from]) {
    sessions[from] = { step: 0, answers: {} };
    sendMessage(from, "Welcome. Let's start your cervical cancer risk screening. Start answering whenever you're comfortable. All answers you provide are anonymous\n\n" + getNextQuestion(0));
    return res.sendStatus(200); // exits this loop early
  }
  const session = sessions[from];
  // save the current answer. This function loops through to ensure all answers are answered and stored in the specific key.
  saveAnswer(session, incomingMsg);
  

  if (isComplete(session)) {
    const resp = calculateProbabilisticRisk(session.answers); // returns an object
    const risk = resp[riskLevel] // either low, medium or high

    const endMsg = `You're all done!\n\n Based on your answers, your cervical cancer risk level is: ${risk.toUpperCase()}.`
    const riskMessages = {
      low: 'Great news. You appear to be at a lower risk. Keep protecting yourself by practicing safe sex and staying informed about your health. Prevention is your best defense',
      medium: 'You may be at a moderate risk. Consider scheduling a cervical cancer screening when possible — just to be sure',
      high: 'You are at a high risk. We recommend getting screened as soon as possible — early detection could save your life',
    }

    const response = `${endMsg}\n\n${riskMessages[risk]}`
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
