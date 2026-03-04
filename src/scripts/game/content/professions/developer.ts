import type { Profession } from "../../types"

export const Developer: Profession = {
    id: "developer",
    name: "Software Developer",
    description: "Turns coffee into code, creates bugs faster than they fix them",
    quirk: "keeps a rubber ducky with them at all times.",
    stats: {
        cash: 3_600,
        equipment: 90,
        health: 70,
        luck: 25,
    },
    perks: [
        "Can write code while half-asleep",
        "Knows all the keyboard shortcuts"
    ],
    drawbacks: [
        "Breaks things just by thinking about them", 
        "Talks to coworkers in pseudo-code"
    ],
}
