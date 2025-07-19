// hold your questions in an array of objects
const questions = [
  {
    key: 'sexuallyActive',
    question: 'Have you  ever been sexually active?\n\nYes/No', // cervical cancer spreads if you've ever had sex; whether one or 10 men -- it doesn't matter
    options: ['Yes', 'No']
  },
    
  {
    key: 'hpvVaccine',
    question: 'Have you ever been vaccinated against HPV?\n\nYes/No',
    options: ['Yes', 'No']
  },
    
  {
    key: 'age',
    question: 'What is your age group?\n\nA. 24 or under\n\nB. 25-34\n\nC. 35-44\n\nD. 45-64\n\nE. 65 or above', // women age 30s(35 - 50) to early 40s are the highest at risk of cervical cancer
    options: ['A', 'B', 'C', 'D', 'E'],
  },

  {
    key: 'bleeding',
    question: 'Have you experienced unusual vaginal bleeding either after sex or between periods?\n\nYes/No',
    options: ['Yes', 'No'],
  },

  {
    key: 'pain',
    question: 'Do you feel pain during sex in the deep pelvic region?\n\nYes/No',
    options: ['Yes', 'No'],
  },

  {
    key: 'discharge',
    question: 'Have you noticed any unusual vaginal discharge?\n\nYes/No',
    options: ['Yes', 'No'],
  },
];

  
function getNextQuestion(step) {
  return questions[step] ? questions[step].question : '';
}


// session is sessions[from] azn the users phone number
// the input is the message they sent us i.e. the one with from, body etc from twilio.
function saveAnswer(session, input) {
  const currentQ = questions[session.step]; // access the questions array at index of session.step i.e. 0, 1, etc
  if (currentQ) {
    session.answers[currentQ.key] = input; // store the appropriate answer under the correct key
    session.step++;
  }
}

// validate each answer to avoid the app crashing or storing junk data
function validateAnswer(input, step) {
  const normalized = input.trim().toLowerCase();

  switch (step) {
    case 0: // Sexually active
      if (!['yes', 'no'].includes(normalized)) return "❌ Please reply with *Yes* or *No*.";
      break;

    case 1: // HPV vaccine
      if (!['yes', 'no'].includes(normalized)) return "💉 Please reply with *Yes* if you’ve had the HPV vaccine, otherwise reply with *No*.";
      break;

    case 2: // Age
      if (!['a', 'b', 'c', 'd', 'e'].includes(normalized)) return "🔢 Please reply with A, B, C, D, or E to select your age range.";
      break;

    case 3: // Bleeding
      if (!['yes', 'no'].includes(normalized)) return "🩺 Please reply with *Yes* if you're experiencing bleeding after sex or between periods, otherwise *No*.";
      break;

    case 4: // Pain
      if (!['yes', 'no'].includes(normalized)) return "🩺 Please reply with *Yes* if you're experiencing pain during sex, otherwise *No*.";
      break;

    case 5: // Discharge
      if (!['yes', 'no'].includes(normalized)) return "🩺 Please reply with *Yes* if you've noticed abnormal discharge, otherwise *No*.";
      break;
  }

  return null; // valid
}

function isComplete(session) {
  return session.step >= questions.length; //returns true if session if end of questions have been reached
}
  
module.exports = { getNextQuestion, saveAnswer, validateAnswer, isComplete };
  