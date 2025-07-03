require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const { getNextQuestion, saveAnswer, isComplete } = require('./questionnaire');
const { calculateProbabilisticRisk } = require('./predict');
const sessions = require('./session');
const clinics = require('./clinics');

// Set twilios environmental variables.
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const port = process.env.PORT;
const client = twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.post('/webhook', (req, res) => {
  const from = req.body.From;
  const incomingMsg = req.body.Body.trim().toLowerCase();

  if (!sessions[from]) sessions[from] = { step: 0, answers: {} };

  // Restart logic
  if (incomingMsg === 'restart') {
    sessions[from] = { step: 0, answers: {} };
    sendMessage(from, '✅ Conversation restarted.\n\n' + getNextQuestion(0));
    return res.sendStatus(200);
  }

  const session = sessions[from];
  saveAnswer(session, incomingMsg);

  if (isComplete(session)) {
    const risk = calculateProbabilisticRisk(session.answers);
    const clinicList = clinics('nairobi'); // You can refine by user input later

    const response = `🩺 *Your risk level is:* ${risk.toUpperCase()}.\n\n🏥 *Suggested clinics near you:*\n${clinicList.map(c => `• ${c.name}, ${c.location}`).join('\n')}\n\nType 'restart' to begin again.`;
    sendMessage(from, response);
    delete sessions[from];
  } else {
    const nextQ = getNextQuestion(session.step);
    sendMessage(from, nextQ);
  }

  res.sendStatus(200);
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
