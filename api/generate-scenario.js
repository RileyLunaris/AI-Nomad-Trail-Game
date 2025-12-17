// This import matches your package.json dependency exactly
const { GoogleGenAI } = require('@google/genai');

// Use the secret key you set in Vercel environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

module.exports = async (req, res) => {
    // 1. Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // 2. Use gemini-2.5-flash which matches your usage dashboard
        const model = 'gemini-2.5-flash';
        const prompt = 'Generate a survival game scenario in JSON format with fields "scenario_text" (3 sentences) and "options" (array of 3 strings). Base it on a recent global event.';

        const result = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        // 3. Return the AI's JSON output directly to your game
        const finalData = JSON.parse(result.text);
        return res.status(200).json(finalData);

    } catch (error) {
        console.error('Gemini API Error:', error);
        // Error details will help you debug in Vercel Function Logs
        return res.status(500).json({ 
            error: 'Failed to generate scenario', 
            details: error.message 
        });
    }
};