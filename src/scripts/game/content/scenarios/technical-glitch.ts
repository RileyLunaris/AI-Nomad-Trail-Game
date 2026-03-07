import type { ScenarioData } from "../../types";

export const TECHNICAL_GLITCH: ScenarioData = {
    text: "A technical glitch occurred.",
    description: "You must troubleshoot now.",
    options: [
        {
            text: "Fix it quickly",
            success: {
                text: "Your patch was easy and successful.",
                effects: {
                    cash: 10,
                    equipment: 5,
                    health: 2,
                },
            },
            failure: {
                text: "Your patch introduced more bugs than you fixed.",
                effects: {
                    cash: -50,
                    equipment: -10,
                    health: -10,
                },
            },
        },
        { 
            text: "Ignore and rest", 
            success: {
                text: "You feel well rested, but your laptop is judging you.",
                effects: {
                    cash: -50,
                    equipment: -20,
                    health: 10,
                },
            },
            failure: {
                text: "You struggle to fall asleep and you had a nightmare about robot bugs.",
                effects: {
                    cash: -75,
                    equipment: -20,
                    health: -10,
                },
            },
        },
    ],
};
