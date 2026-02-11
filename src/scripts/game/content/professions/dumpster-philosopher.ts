import type { Profession } from "../../types"

export const DumpsterPhilosopher: Profession = {
    id: "dumpster_philosopher",
    name: "Dumpster Philosopher",
    description: "Finds wisdom and random treasures in trash while pondering life's mysteries.",
    quirk: "Carries a notebook for deep thoughts about pizza boxes",
    starting_stats: {
        cash: 3_600,
        laptop_health: 90,
        mental_health: 70,
        luck: 25,
    },
    perks: [
        "Discovers hidden treasures", 
        "Sees the poetry in garbage"
    ],
    drawbacks: [
        "Smells suspicious sometimes", 
        "People avoid eye contact"
    ],
}
