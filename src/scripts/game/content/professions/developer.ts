import type { Profession } from "../../types"

export const Developer: Profession = {
    id: "developer",
    name: "Software Developer",
    description: "Turns coffee into code, creates bugs faster than they fix them",
    quirk: "keeps a rubber ducky with them at all times.",
    starting_stats: {
        cash: 3_600,
        laptop_health: 90,
        mental_health: 70,
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
