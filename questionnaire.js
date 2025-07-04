// hold your questions in an array of objects
const questions = [
  {
    key: 'sexuallyActive',
    question: 'Have you  ever been sexually active?\nYes/No', // cervical cancer spreads if you've ever had sex; whether one or 10 men -- it doesn't matter
    options: ['Yes', 'No']
  },
    
  {
    key: 'hpvVaccine',
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
    options: ['Yes', 'No'],
  },

  {
    key: 'pain',
    question: 'Do you feel pain during sex in the deep pelvic region?\nYes/No',
    options: ['Yes', 'No'],
  },

  {
    key: 'discharge',
    question: 'Have you noticed any unusual vaginal discharge?\nYes/No',
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

function isComplete(session) {
  return session.step >= questions.length; //returns true if session if end of questions have been reached
}
  
module.exports = { getNextQuestion, saveAnswer, isComplete };
  