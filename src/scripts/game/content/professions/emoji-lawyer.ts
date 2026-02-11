import type { Profession } from "../../types"

export const EmojiLawyer: Profession = {
    id: "emoji_lawyer",
    name: " Emoji Lawyer",
    description: "Argues cases using only emojis. Surprisingly effective.",
    quirk: "Uses 😂 for objections",
    starting_stats: {
        cash: 1_200,
        laptop_health: 80,
        mental_health: 70,
        luck: 10,
    },
    perks: [
        "Never loses a text argument", 
        "Master of 😎 faces"
    ],
    drawbacks: [
        "Judges don't always understand 😂"
    ],
}
