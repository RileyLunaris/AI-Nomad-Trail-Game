// api/generate-scenario.js

module.exports = async (req, res) => {
    // 1. Setup CORS (Allows your game to talk to this endpoint)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed.' });
    }

    // --- 2. SIMULATE AI GENERATION (This needs to be replaced with real AI later) ---
    
    const currentTime = new Date().toLocaleTimeString();
    
    const SIMULATED_RESPONSE = {
        text: `The AI is successfully generating scenarios! The current server time is ${currentTime}. Your latest challenge is about dealing with a sudden local gas shortage due to US economic policy.`,
        options: [
            { text: "Pay a high price for fuel (High cost, stable travel)", cash: -400, laptop: 0, mental: 5, outcome: "Your wallet hurts, but you made it safely to the next city." },
            { text: "Detour to a distant, cheaper pump (Save money, high risk)", cash: -50, laptop: -10, mental: -10, outcome: "The detour caused laptop overheating, and the pump was empty when you arrived." }
        ]
    };

    // --- 3. Return the Scenario JSON ---
    return res.status(200).json(SIMULATED_RESPONSE);
};