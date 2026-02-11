import type { Profession } from "../../types"

export const Author: Profession = {
    id: "author",
    name: "Author",
    description: "Crafts epic tales, tragic poems, and bizarre footnotes no one asked for.",
    quirk: "Always carries a pen behind the ear, even while sleeping",
    starting_stats: {
        cash: 1_200,
        laptop_health: 80,
        mental_health: 70,
        luck: 10,
    },
    perks: [
        "Can invent words on the spot", 
        "Has an endless supply of plot twists",
    ],
    drawbacks: [
        "Gets lost in imaginary worlds", 
    ],
}
