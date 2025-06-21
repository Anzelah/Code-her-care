function calculateProbabilisticRisk(answers) {
  const baseRiskProbs = {
    low: 0.6,
    medium: 0.25,
    high: 0.15
  };

  const ageProbGivenRisk = {
    low:   { A: 0.4, B: 0.25, C: 0.05, D: 0.1, E: 0.2 },
    medium:{ A: 0.2, B: 0.3, C: 0.1, D: 0.1, E: 0.3 },
    high:  { A: 0.05, B: 0.1, C: 0.4, D: 0.25, E: 0.2 }
  };

  const sexProbGivenRisk = { 
    low: { Yes: 0.1, No: 0.9 },
    medium: { Yes: 0.7, No: 0.3 },
    high: { Yes: 0.9, No: 0.1 } 
  };

  const vaccinatedProbGivenRisk = { 
    low: { Yes: 0.68, No: 0.42 },
    medium: { Yes: 0.4, No: 0.6 },
    high: { Yes: 0.15, No: 0.85 }
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

  const risks = ['low', 'medium', 'high'];
  const scores = {};
  const age = answers.age
  const sex = answers.sexuallyActive
  const flow = answers.bleeding
  const pain = answers.pain
  const vaccinated = answers.hpvVaccine
  const discharge = answers.discharge

  for (const risk of risks) {
    const prob = baseRiskProbs[risk]
      * (ageProbGivenRisk[risk][age] || 0.01)
      * (sexProbGivenRisk[risk][sex] || 0.01)
      * (vaccinatedProbGivenRisk[risk][vaccinated] || 0.01)
      * (flowProbGivenRisk[risk][flow] || 0.01)
      * (painProbGivenRisk[risk][pain] || 0.01)
      * (dischargeProbGivenRisk[risk][discharge] || 0.01);

    scores[risk] = prob;
  }

  // Normalize the scores to add up to 1
  const total = scores.low + scores.medium + scores.high;
  const normalized = {
    low: scores.low / total,
    medium: scores.medium / total,
    high: scores.high / total
  };

  // Get the highest probability
  let maxRisk = 'low';
  if (normalized.medium > normalized[maxRisk]) maxRisk = 'medium';
  if (normalized.high > normalized[maxRisk]) maxRisk = 'high';

  return { riskLevel: maxRisk, probabilities: normalized };
}

module.exports = { calculateProbabilisticRisk }
  