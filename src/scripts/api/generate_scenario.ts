import { GenerateContentResponse, GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import type { GameStateSummary } from "../game/types";


/* Constants */
const apikey = import.meta.env.VITE_GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey: apikey });


/* Schema Definitions */
export const OutcomeSchema = z.object({
    text:   z.string().describe("message pertaining to the outcome of player choice."),
    cost:   z.number().describe("money spent based on the action."),
    damage: z.number().describe("damage taken or repaired based on the action."),
    health: z.number().describe("damage taken or healed based on the action."),
    luck:   z.number().describe("luck used or gained based on action."),
})
export const ActionSchema = z.object({
    text:        z.string().describe("short 1st person phrase of action."),
    description: z.string().describe("very short summary of action."),
    chance:      z.number().describe("chance for success, between 0 and 100"),
    success:     OutcomeSchema.describe("successful outcome of action."),
    failure:     OutcomeSchema.describe("failed outcome of action."),
});
export const DilemmaSchema = z.object({
    title:       z.string().describe("A short title of the dilemma."),
    description: z.string().describe("A 2-4 sentence summary of the dilemma."),
    options:     z.array(ActionSchema).describe("a list of options to solve the dilemma.")
});


/* Functions */
function makePrompt(state: GameStateSummary) {
    return `
Current_Game_State:
${JSON.stringify(state, null, 2)}

Based on the Current_Game_State, generate a new funny or satirical dilemma for the player to solve.
The dilemma location be somewhere between the origin and the target.
the dilemma must be based around current events, news feeds, in the area.
Based on this scenario generate 2 or 3 possible actions for the user to take to remedy the issue at hand.
Each action will affect the players stats, some will be of detriment to the player. some by chance will benefit them.
All stats can go up or down.
All scenarios, and options should be somewhat funny.
DO NOT RE-USE LAST SCENARIO TOPIC!
`;
}

function parseJson(response: GenerateContentResponse) {
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
        throw new Error("No text returned from model");
    }
    return JSON.parse(text);
}

async function fetch(request:string) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: request,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(DilemmaSchema),
        }
    });
    return response;
}

export async function parseNewScenario(state: GameStateSummary) {
    const data = parseJson(await fetch(makePrompt(state)));
    console.log(data);
    return DilemmaSchema.parseAsync(data);
}
