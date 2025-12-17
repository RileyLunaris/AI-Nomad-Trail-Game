import { GoogleGenAI } from '@google/genai';

// Initialize the GoogleGenAI client.
// It will automatically use the GEMINI_API_KEY from your Vercel environment variables.
const ai = new GoogleGenAI({});

// Define the system instruction to guide the model's behavior
const systemInstruction = `You are a creative game master for a dynamic, text-based survival game.
Your task is to generate a new, unique scenario based on the latest global news, specifically around natural events, technological breakthroughs, or socio-political events.
The output MUST be a single, raw JSON object with no markdown formatting (no \`\`\`json).
The JSON object must contain these two fields:
1. "scenario_text": (string) A compelling, short narrative (3-5 sentences) that describes the player's current situation, linking it directly to the information retrieved from the search tool.
2. "options": (array of strings) A list of three distinct, plausible player choices for how to proceed in this new situation.

Example JSON:
{"scenario_text": "The latest reports of a massive solar flare disrupting GPS systems globally have reached your remote cabin. All navigation and satellite communication is down. You hear a distant emergency broadcast on a short-wave radio.", "options": ["Try to repair the old compass you have stored away.", "Venture out to a nearby town to find the source of the broadcast.", "Stay put and wait for official instructions to be transmitted."]}
`;

/**
 * Vercel Edge Function handler
 * @param {Request} request
 * @returns {Response}
 */
export default async function handler(request) {
  // Setup CORS (You had this, so we include it again for safety)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed.' }), { status: 405 });
  }

  try {
    // This prompt explicitly forces the use of the search tool
    const prompt = 'Using the latest information available from your search tool, generate a brand new, unique scenario for a text-based survival game. The scenario must be based on a recent global event, such as a natural disaster, political crisis, or major technology failure.';
    
    // 1. Call the Gemini API with the required configuration
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // Enforce the model to output a valid JSON object
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            scenario_text: {
              type: 'string',
              description: 'A short narrative describing the player\'s new situation.'
            },
            options: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Three distinct player choices.'
            }
          },
          required: ['scenario_text', 'options']
        },
        // Provide the system instruction to define the model's role
        systemInstruction: systemInstruction,
        // *** This is the key part: enabling the Google Search tool for grounding ***
        tools: [{ googleSearch: {} }],
        // Setting temperature slightly higher for creative results
        temperature: 0.7,
      },
    });

    // 2. Extract and return the raw text response (which is a JSON string)
    const jsonString = response.text.trim();
    
    // 3. Return the JSON to the client
    return new Response(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // CORS header added to final response
      },
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate scenario', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }