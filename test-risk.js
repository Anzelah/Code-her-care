const { calculateProbabilisticRisk } = require('./predict');

const testInputs = [
  { sexuallyActive: 'No', hpvVaccine: 'Yes', age: 'A', bleeding: 'No', pain: 'No', discharge: 'No' }, // low CORRECT
  { sexuallyActive: 'Yes', hpvVaccine: 'Yes', age: 'B', bleeding: 'Yes', pain: 'No', discharge: 'No' }, // medium CORRECT 
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'C', bleeding: 'Yes', pain: 'No', discharge: 'No'}, // high CORRECT
  { sexuallyActive: 'No', hpvVaccine: 'Yes', age: 'A', bleeding: 'No', pain: 'No', discharge: 'No' }, // low CORRECT

  // MEDIUM RISK: Mid-age, sexually active, vaccinated, bleeding
  { sexuallyActive: 'Yes', hpvVaccine: 'Yes', age: 'B', bleeding: 'Yes', pain: 'No', discharge: 'No' }, // medium CORRECT

  // HIGH RISK: Mid-age, unvaccinated, bleeding
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'C', bleeding: 'Yes', pain: 'No', discharge: 'No' }, // high CORRECT

  // MEDIUM-HIGH RISK: Older, unvaccinated, with pain and discharge
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'D', bleeding: 'No', pain: 'Yes', discharge: 'Yes' }, // medium-high HIGH. TBD

  // LOW RISK: Older woman, vaccinated, no symptoms
  { sexuallyActive: 'No', hpvVaccine: 'Yes', age: 'E', bleeding: 'No', pain: 'No', discharge: 'No' }, // low CORRECT

  // HIGH RISK: Vaccinated, but all symptoms present (red flags)
  { sexuallyActive: 'Yes', hpvVaccine: 'Yes', age: 'C', bleeding: 'Yes', pain: 'Yes', discharge: 'Yes' }, // high CORRECT

  // LOW-MEDIUM RISK: Young and sexually active, vaccinated, no symptoms
  { sexuallyActive: 'Yes', hpvVaccine: 'Yes', age: 'A', bleeding: 'No', pain: 'No', discharge: 'No' }, // low-medium LOW.TBD

  // MEDIUM RISK: Mid-age, sexually active, unvaccinated, no symptoms
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'B', bleeding: 'No', pain: 'No', discharge: 'No' }, // medium CORRECT

  // HIGH RISK: Older age group, unvaccinated, bleeding + discharge
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'C', bleeding: 'Yes', pain: 'No', discharge: 'Yes' }, // high CORRECT

  // MEDIUM RISK: Unvaccinated but no symptoms, 40s
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'D', bleeding: 'No', pain: 'No', discharge: 'No' }, // medium WRONG

  // LOW RISK: Not sexually active, vaccinated, mid-30s
  { sexuallyActive: 'No', hpvVaccine: 'Yes', age: 'C', bleeding: 'No', pain: 'No', discharge: 'No' }, // low CORRECT
];

testInputs.forEach((input, i) => {
  const resp = calculateProbabilisticRisk(input);
  const risk = resp.riskLevel
  console.log(`Test Case ${i + 1}:`);
  console.log(`→ Risk level: ${risk.toUpperCase()}\n`);
});
