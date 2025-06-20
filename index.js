require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const { getNextQuestion, saveAnswer, isComplete, calculateRisk } = require('./questionnaire');
const sessions = require('./sessions');
const clinics = require('./clinics');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

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
    const risk = calculateRisk(session.answers);
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

app.listen(3000, () => console.log('Bot running on port 3000'));
