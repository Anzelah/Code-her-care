const express = require('express');
const bodyParser = require('body-parser');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Simple in-memory user session store (for demo only)
const sessions = {};

// Questions flow
// targets people who have never had cervical cancer screening and are at risk. this is 21-65 yo sexually active women or 25 in some instnces. Will stil research. 
// they don't have the money to go to a cervical cancer consultation as it costs an upwards of 500/=
const questions = [
  {
    key: 'sexually active',
    question: 'Have you  ever been sexually active?\nYes/No', // cervical cancer spreads if you've ever had sex; whether one or 10 men -- it doesn't matter
    options: ['Yes', 'No']
  },

  {
    key: 'HPV vaccine',
    question: 'Have you ever been vaccinated against HPV?\nYes/No',
    options: ['Yes', 'No']
  },

  {
    key: 'age',
    question: 'What is your age group?\nA. Under 21\nB. 21 to 29\nC. 35 to 44\nD. 45 to 64/n. E. 65 and above', // women age 30s(35 - 50) to early 40s are the highest at risk of cervical cancer
    options: ['A', 'B', 'C', 'D', 'E'],
  },

  {
    key: 'bleeding',
    question: 'Have you experienced unusual vaginal bleeding either after sex or between periods?\nYes/No',
    options: ['yes', 'no'],
  },

  {
    key: 'pain',
    question: 'Do you feel pain during sex in the deep pelvic region?\nYes/No',
    options: ['yes', 'no'],
  },

  {
    key: 'discharge',
    question: 'Have you noticed any unusual vaginal discharge?\nYes/No',
    options: ['yes', 'no'],
  },
];


function calculateRisk(answers) {
  let score = 0;
  // Assign points based on answers
  if (['B', 'C', 'D'].includes(answers.age)) score += 1; // age risk
  if (answers.bleeding === 'yes') score += 2;
  if (answers.pain === 'yes') score += 1;
  if (answers.discharge === 'yes') score += 1;

  if (score >= 4) return 'HIGH';
  if (score >= 2) return 'MODERATE';
  return 'LOW';
}

app.post('/whatsapp', (req, res) => {
  const twiml = new MessagingResponse();

  const from = req.body.From;
  const msg = req.body.Body.trim().toLowerCase();

  if (!sessions[from]) {
    // Start session
    sessions[from] = { step: 0, answers: {} };
    twiml.message(
      '👋🏾 Hi! I am NuruBot, here to help you check your cervical cancer risk. All answers are private.\nReady to begin? (Yes/No)'
    );
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  }

  const session = sessions[from];

  // Starting conversation, user says yes to begin questions
  if (session.step === 0) {
    if (msg === 'yes') {
      twiml.message(questions[0].question);
      session.step++;
    } else {
      twiml.message('Okay, text "Yes" when you want to start the risk check.');
    }
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    return res.end(twiml.toString());
  }

  // Ask questions step by step
  if (session.step > 0 && session.step <= questions.length) {
    const currentQuestion = questions[session.step - 1];

    // Validate answer
    if (
      (currentQuestion.key === 'age' && !currentQuestion.options.includes(msg.toUpperCase())) ||
      (currentQuestion.key !== 'age' && !currentQuestion.options.includes(msg))
    ) {
      twiml.message(
        `Invalid response. Please answer as instructed:\n${currentQuestion.question}`
      );
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      return res.end(twiml.toString());
    }

    // Store answer
    session.answers[currentQuestion.key] = msg.toUpperCase();

    if (session.step === questions.length) {
      // Calculate risk and respond
      const risk = calculateRisk(session.answers);

      let reply = `✅ Your risk level is: ${risk}\n`;

      if (risk === 'HIGH') {
        reply +=
          'Please visit a clinic for screening as soon as possible.\nNearby free clinics:\n- Mbagathi Hospital (Tue)\n- Amref Clinic (KES 200)\nReply "Reminder" to get a 7-day reminder.';
      } else if (risk === 'MODERATE') {
        reply +=
          'It is advisable to get screened soon.\nNearby free clinics:\n- Mbagathi Hospital (Tue)\n- Amref Clinic (KES 200)\nReply "Reminder" to get a 7-day reminder.';
      } else {
        reply +=
          'No urgent signs detected now. Maintain regular check-ups and practice safe habits.\nType "Learn" to know more about cervical cancer prevention.';
      }

      twiml.message(reply);

      // Reset session for next user interaction
      delete sessions[from];

      res.writeHead(200, { 'Content-Type': 'text/xml' });
      return res.end(twiml.toString());
    } else {
      // Ask next question
      twiml.message(questions[session.step].question);
      session.step++;
      res.writeHead(200, { 'Content-Type': 'text/xml' });
      return res.end(twiml.toString());
    }
  }

  // Handle reminder or learn request after risk assessment
  if (msg === 'reminder') {
    twiml.message(
      'Reminder set! We will message you in 7 days to check in again. (Note: Reminder service not implemented yet.)'
    );
  } else if (msg === 'learn') {
    twiml.message(
      'Cervical cancer can be prevented by regular screening and HPV vaccination. Avoid smoking and practice safe sex.'
    );
  } else {
    twiml.message('Sorry, I did not understand that. Please type "Yes" to start the risk check.');
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WhatsApp bot listening on port ${PORT}`);
});
