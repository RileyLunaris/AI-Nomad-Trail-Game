import type { Profession } from "../../types"

export const EmojiLawyer: Profession = {
    id: "emoji_lawyer",
    name: " Emoji Lawyer",
    description: "Argues cases using only emojis. Surprisingly effective.",
    quirk: "Uses 😂 for objections",
    stats: {
        cash: 1_200,
        equipment: 80,
        health: 70,
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
