// templates.js

const welcomeMessage = () =>
    `👋 Hello! Welcome to the Cervical Cancer Risk Checker.\n\nWe’ll ask you a few quick questions to estimate your risk level then offer helpful advice based on your results.\n\nReady? Let’s begin 👇`;
  
  const questionPrompt = (questionText) =>
    `📝 ${questionText}`;
  
  const invalidInput = () =>
    `⚠️ Hmm, I didn’t quite get that. Please respond with a valid answer to continue.`;
  
  const riskSummary = (risk) =>
    `✅ You're all done!\n\n🔍 Based on your answers, your cervical cancer risk level is: *${risk.toUpperCase()}*.\n`;
  
  const riskAdvice = {
    low: `✅ Great news! You appear to be at *low risk*. Keep protecting yourself by practicing safe sex and staying informed about your health. Prevention is your best defense.`,
    medium: `⚠️ You may be at a *moderate risk*. Since cervical cancer can remain silent for 10-20 years before becoming invasive, we strongly recommend getting screened. Screening is the only way to catch it early!`,
    high: `🚨 You may be at *high risk*. Please go get screened as soon as possible. Early detection will save your life, and starting treatment early often means simpler, less painful care.`
  };
  
  const restartPrompt = () =>
    `🔁 If you'd like to check again for someone else or update your answers, just reply with *restart*.`;
  
  const clinicRecommendation = (clinics) => {
    if (!clinics || clinics.length === 0) return '📍 Sorry, we couldn’t find a nearby clinic right now.';
    return `🏥 Here are some free or low-cost clinics near you:\n\n` +
      clinics.map((c, i) => `${i + 1}. *${c.name}*\n   📍 ${c.address}\n   📞 ${c.phone || 'N/A'}`).join('\n\n');
  };
  
  module.exports = {
    welcomeMessage,
    questionPrompt,
    invalidInput,
    riskSummary,
    riskAdvice,
    restartPrompt,
    clinicRecommendation,
  };
  