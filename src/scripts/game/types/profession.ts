import type { Stats } from "./stats";

export interface Profession {
    id: string,
    name: string;
    description: string;
    quirk: string;
    perks?: string[];
    drawbacks?: string[];
    starting_stats: Stats;
}
