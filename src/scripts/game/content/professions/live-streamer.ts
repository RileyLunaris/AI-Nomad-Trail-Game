import type { Profession } from "../../types"

export const LiveStreamer: Profession = {
    id: "live_streamer",
    name: "Live Streamer",
    description: "Plays games loudly, cries over losses, and somehow still gains followers.",
    quirk: "Has a collection of gaming chairs that rival their follower count",
    stats: {
        cash: 1_200,
        equipment: 80,
        health: 70,
        luck: 10,
    },
    perks: [
        "Famous to strangers", 
        "Can eat snacks without pausing gameplay",
        "Knows every cheat code, ever",
    ],
    drawbacks: [
        "Famous to strangers",
        "Has no private life",
        "Talks to chat mid conversation.", 
        "Keyboard frequently breaks mid-stream.",
    ],
}
