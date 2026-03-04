import type { PlayerStats } from ".";

export interface Scenario {
    text: string,
    description: string,
    options: ScenarioOption[],
}

export interface ScenarioOption {
    id?: string,
    text: string,
    success: string,
    failure: string,
    affects: PlayerStats,
}
