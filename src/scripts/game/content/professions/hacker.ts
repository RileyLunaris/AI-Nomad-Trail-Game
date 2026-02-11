import type { Profession } from "../../types"

export const Hacker: Profession = {
    id: "hacker",
    name: " Hacker",
    description: "Knows every backdoor, but still struggles to remember their own Wi-Fi password. Lives for caffeine and chaos.",
    quirk: "Breaks into systems just to leave a funny ASCII art.",
    starting_stats: {
        cash: 1_200,
        laptop_health: 80,
        mental_health: 70,
        luck: 10,
    },
    perks: [
        "Instant Wi-Fi access",
        "Incognito, the person"
    ],
    drawbacks: [
        "Accidentally deletes important files",
        "Gets paranoid when devices beep",
        "Falls for their own phishing attacks"
    ],
}
