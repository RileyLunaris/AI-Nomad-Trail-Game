import type { Profession } from "../../types"

export const CatTheratpist: Profession = {
    id: "cat_therapist",
    name: "Cat Therapist",
    description: "Helps cats talk about their feelings. Mostly ignored by cats.",
    quirk: "Always wears a tie with paw prints",
    starting_stats: {
        cash: 1_200,
        laptop_health: 80,
        mental_health: 70,
        luck: 10,
    },
    perks: [
        "Free catnip",
        "Master of ignoring judgemental humans",
    ],
    drawbacks: [
        "is addicted to catnip",
        "Allergic to 50% of clients",
    ],
}