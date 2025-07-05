// use naive bayes algortih/method to predict probability depending on answers given
function calculateProbabilisticRisk(answers) {
  const baseRiskProbs = {
    low: 0.6,
    medium: 0.35,
    high: 0.15
  };

  const sexProbGivenRisk = { 
    low: { Yes: 0.1, No: 0.9 },
    medium: { Yes: 0.7, No: 0.3 },
    high: { Yes: 0.9, No: 0.1 } 
  };

  const vaccinatedProbGivenRisk = { 
    low: { Yes: 0.68, No: 0.42 },
    medium: { Yes: 0.55, No: 0.45 },
    high: { Yes: 0.2, No: 0.8 }
  };

  const ageProbGivenRisk = {
    low:   { A: 0.4, B: 0.25, C: 0.05, D: 0.1, E: 0.2 },
    medium:{ A: 0.2, B: 0.3, C: 0.1, D: 0.1, E: 0.3 },
    high:  { A: 0.05, B: 0.1, C: 0.4, D: 0.25, E: 0.2 }
  };

  const flowProbGivenRisk = {
    low: { Yes: 0.2, No: 0.8 },
    medium: { Yes: 0.5, No: 0.5 },
    high: { Yes: 0.8, No: 0.2 }
  };

  const painProbGivenRisk = {
    low: { Yes: 0.2, No: 0.8 },
    medium: { Yes: 0.5, No: 0.5 },
    high: { Yes: 0.75, No: 0.25 }
  };

  const dischargeProbGivenRisk = {
    low: { Yes: 0.2, No: 0.8 },
    medium: { Yes: 0.6, No: 0.4 },
    high: { Yes: 0.85, No: 0.15 }
  };

  // Helper to throw error if a value is missing
  function getSafeProb(table, risk, key, fieldName) {
    const value = table[risk][key];
    if (value === undefined) {
      throw new Error(`Missing value "${key}" in field "${fieldName}" for risk level "${risk}"`);
    }
    return value;
  }

  // Normalize inputs like "yes" → "Yes"
  function normalize(input) {
    if (!input) return '';
    return input.trim().charAt(0).toUpperCase() + input.trim().slice(1).toLowerCase();
  }

  const age = answers.age;
  const sex = normalize(answers.sexuallyActive);
  const vaccinated = normalize(answers.hpvVaccine);
  const flow = normalize(answers.bleeding);
  const pain = normalize(answers.pain);
  const discharge = normalize(answers.discharge);

  const risks = ['low', 'medium', 'high'];
  const scores = {};

  for (const risk of risks) {
    const prob = baseRiskProbs[risk]
      * getSafeProb(ageProbGivenRisk, risk, age, 'age')
      * getSafeProb(sexProbGivenRisk, risk, sex, 'sexuallyActive')
      * getSafeProb(vaccinatedProbGivenRisk, risk, vaccinated, 'hpvVaccine')
      * getSafeProb(flowProbGivenRisk, risk, flow, 'bleeding')
      * getSafeProb(painProbGivenRisk, risk, pain, 'pain')
      * getSafeProb(dischargeProbGivenRisk, risk, discharge, 'discharge');

    scores[risk] = prob;
  }
  
  // Normalize scores so they sum to 1
  const total = scores.low + scores.medium + scores.high;
  const normalized = {
    low: scores.low / total,
    medium: scores.medium / total,
    high: scores.high / total
  };

  // Determine highest probability
  let maxRisk = 'low';
  if (normalized.medium > normalized[maxRisk]) maxRisk = 'medium';
  if (normalized.high > normalized[maxRisk]) maxRisk = 'high';

  return { riskLevel: maxRisk, probabilities: normalized };
}

module.exports = { calculateProbabilisticRisk }
  