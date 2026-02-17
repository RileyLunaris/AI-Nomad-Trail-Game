import type { Profession } from "../../types"

export const SystemsDirector: Profession = {
    id: "systems_director",
    name: "Systems Director",
    description: "Once a visionary, now mostly just keeps the servers running by moonlighting as a fire fighter.",
    quirk: "Drinks coffee like it's life support and mutters acronyms under breath.",
    starting_stats: {
        cash: 1_200,
        laptop_health: 80,
        mental_health: 70,
        luck: 10,
    },
    perks: [
        "Caffine fueled problem solver",
        "Sarcasm is second language",
    ],
    drawbacks: [
        "Meeting Magnet",
        "Talks too much",
        "Only laughs at disaster memes",
    ],
}
