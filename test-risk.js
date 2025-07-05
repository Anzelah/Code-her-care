const { calculateProbabilisticRisk } = require('./predict');

const testInputs = [
  { sexuallyActive: 'No', hpvVaccine: 'Yes', age: 'A', bleeding: 'No', pain: 'No', discharge: 'No' }, // low
  { sexuallyActive: 'Yes', hpvVaccine: 'Yes', age: 'B', bleeding: 'Yes', pain: 'No', discharge: 'No' }, // medium
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'C', bleeding: 'Yes', pain: 'No', discharge: 'No'}, // high
];

testInputs.forEach((input, i) => {
  const resp = calculateProbabilisticRisk(input);
  console.log(resp)
  const risk = resp.riskLevel
  console.log(`Test Case ${i + 1}:`, input);
  console.log(`→ Risk level: ${risk.toUpperCase()}\n`);
});
