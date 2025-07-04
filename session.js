// Use a basic object to store where each user is in the Q&A flow.

const sessions = {}; // key: phone number, value: { step, answers }. answers is also an object i.e. sessions[from] = { step: 0, answers: {} }

module.exports = sessions;