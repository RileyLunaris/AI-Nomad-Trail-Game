import type { Stats } from ".";

export interface Profession {
    id: string,
    name: string,
    description: string,
    quirk: string
    perks: string[],
    drawbacks: string[]
    stats: Stats,
}
