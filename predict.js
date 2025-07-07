// use naive bayes algortih/method to predict probability depending on answers given
function calculateProbabilisticRisk(answers) {
  const baseRiskProbs = {
    low: 0.6, // will change this once I get real data
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
    medium: { Yes: 0.5, No: 0.5 },
    high: { Yes: 0.35, No: 0.65 }
  };

  const ageProbGivenRisk = {
    low:   { A: 0.75, B: 0.15, C: 0.06, D: 0.03, E: 0.01 },
    medium:{ A: 0.1, B: 0.4, C: 0.35, D: 0.1, E: 0.05 },
    high:  { A: 0.01, B: 0.12, C: 0.36, D: 0.4, E: 0.11 }
  };

  const flowProbGivenRisk = {
    low: { Yes: 0.1, No: 0.9 },
    medium: { Yes: 0.6, No: 0.4 },
    high: { Yes: 0.9, No: 0.1 }
  };

  const painProbGivenRisk = {
    low: { Yes: 0.2, No: 0.8 },
    medium: { Yes: 0.5, No: 0.5 },
    high: { Yes: 0.65, No: 0.35 }
  };

  const dischargeProbGivenRisk = {
    low: { Yes: 0.2, No: 0.8 },
    medium: { Yes: 0.5, No: 0.5 },
    high: { Yes: 0.7, No: 0.3 }
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
  