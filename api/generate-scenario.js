// Matches your @google/generative-ai dependency
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the API with your key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
    // 1. Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // 2. Use a stable model version
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            // This forces the model to strictly output valid JSON
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `Generate a survival game scenario for an "AI Prompt Engineer" traveling from NYC to SF. 
        Return ONLY a JSON object with these exact fields:
        {
          "scenario_text": "3 sentences about a technical or travel challenge based on recent tech news",
          "options": ["Option 1 text", "Option 2 text", "Option 3 text"]
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // 3. Clean and Parse the JSON
        // This removes markdown code blocks like ```json ... ``` if the AI includes them
        const jsonCleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const finalData = JSON.parse(jsonCleaned);

        return res.status(200).json(finalData);

    } catch (error) {
        console.error('Gemini API Error:', error);
        
        // Return a structured error so your frontend can handle the fallback
        return res.status(500).json({ 
            error: 'Failed to generate scenario', 
            message: error.message 
        });
    }
};