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
  

  function calculateRisk(answers) {
    let risk = 0;
    const age = answers.age
    const sex = answers.sexually_active
    const flow = answers.bleeding
    const pain = answers.pain
    const vaccinated = answers.hpv_vaccine
    const discharge = answers.discharge
    
    if (age === 'B' || age === 'E') {
        risk++; // risk is 1 in 21 - 29 as well as over 65 yo. Its 0 for under 21
    } else if (age === 'C') {
        risk + 4; // 35–44
    } else if (age === 'D') {
        risk + 3; // 45-64
    }

    if (sex === 'Yes') risk++;
    if (vaccinated === 'No') risk++;
    if (flow === 'Yes') risk++;
    if (pain === 'Yes') risk++;
    if (discharge === 'Yes') risk++;
  
    if (risk >= 3) return 'high';
    if (risk === 2) return 'medium';
    return 'low';
  }
  
  
  module.exports = { getNextQuestion, saveAnswer, isComplete, calculateRisk };
  