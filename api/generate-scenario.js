const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `Generate a travel dilemma for an AI Engineer. 
        Return JSON with these fields: 
        "scenario_text": "description of event", 
        "options": ["choice 1", "choice 2", "choice 3"]`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        const cleanJson = text.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanJson);

        // This mapping ensures the frontend works even if it expects different names
        const finalOutput = {
            scenario_text: data.scenario_text || data.description,
            description: data.scenario_text || data.description,
            options: data.options || data.choices,
            choices: data.options || data.choices
        };

        return res.status(200).json(finalOutput);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};