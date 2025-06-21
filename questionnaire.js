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

function saveAnswer(session, input) {
  const question = questions[session.step];
  if (question) {
    session.answers[question.key] = input;
    session.step++;
  }
}

function isComplete(session) {
  return session.step >= questions.length; //returns true if session if end of questions have been reached
}
  
module.exports = { getNextQuestion, saveAnswer, isComplete };
  