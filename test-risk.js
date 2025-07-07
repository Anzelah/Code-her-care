const { calculateProbabilisticRisk } = require('./predict');

const testInputs = [
  { sexuallyActive: 'No', hpvVaccine: 'Yes', age: 'A', bleeding: 'No', pain: 'No', discharge: 'No' }, // low CORRECT .1
  { sexuallyActive: 'Yes', hpvVaccine: 'Yes', age: 'B', bleeding: 'Yes', pain: 'No', discharge: 'No' }, // medium CORRECT .2
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'C', bleeding: 'Yes', pain: 'No', discharge: 'No'}, // medium CORRECT  .3
  { sexuallyActive: 'No', hpvVaccine: 'Yes', age: 'A', bleeding: 'No', pain: 'No', discharge: 'No' }, // low CORRECT  4

  // MEDIUM RISK: Mid-age, sexually active, vaccinated, bleeding
  { sexuallyActive: 'Yes', hpvVaccine: 'Yes', age: 'B', bleeding: 'Yes', pain: 'No', discharge: 'No' }, // medium CORRECT 5

  // HIGH RISK: Mid-age, unvaccinated, bleeding
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'C', bleeding: 'Yes', pain: 'No', discharge: 'No' }, // high CORRECT said medium  6 (** to refine aftwerwards). must be age probability as flow is refined well

  // MEDIUM-HIGH RISK: Older, unvaccinated, with pain and discharge
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'D', bleeding: 'No', pain: 'Yes', discharge: 'Yes' }, // high CORRECT.  7

  // LOW RISK: Older woman, vaccinated, no symptoms
  { sexuallyActive: 'No', hpvVaccine: 'Yes', age: 'E', bleeding: 'No', pain: 'No', discharge: 'No' }, // low CORRECT  8

  // HIGH RISK: Vaccinated, but all symptoms present (red flags)
  { sexuallyActive: 'Yes', hpvVaccine: 'Yes', age: 'C', bleeding: 'Yes', pain: 'Yes', discharge: 'Yes' }, // high CORRECT 9 

  // LOW-MEDIUM RISK: Young and sexually active, vaccinated, no symptoms
  { sexuallyActive: 'Yes', hpvVaccine: 'Yes', age: 'A', bleeding: 'No', pain: 'No', discharge: 'No' }, // low CORRECT.  10

  // MEDIUM RISK: Mid-age, sexually active, unvaccinated, no symptoms
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'B', bleeding: 'No', pain: 'No', discharge: 'No' }, // medium CORRECT  11

  // HIGH RISK: Older age group, unvaccinated, bleeding + discharge
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'C', bleeding: 'Yes', pain: 'No', discharge: 'Yes' }, // high CORRECT 12 

  // MEDIUM RISK: Unvaccinated but no symptoms, 40s(between 45 and 64)
  { sexuallyActive: 'Yes', hpvVaccine: 'No', age: 'D', bleeding: 'No', pain: 'No', discharge: 'No' }, // medium/low CORRECT  13

  // LOW RISK: Not sexually active, vaccinated, mid-30s
  { sexuallyActive: 'No', hpvVaccine: 'Yes', age: 'C', bleeding: 'No', pain: 'No', discharge: 'No' }, // low CORRECT  14
];

testInputs.forEach((input, i) => {
  const resp = calculateProbabilisticRisk(input);
  const risk = resp.riskLevel
  console.log(`Test Case ${i + 1}:`);
  console.log(`→ Risk level: ${risk.toUpperCase()}\n`);
});
