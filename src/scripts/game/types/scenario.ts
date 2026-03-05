import type { Stats } from ".";

export interface Scenario {
    text: string,
    description: string,
    outcome?: Outcome,
    options: Option[],
}

export interface Option {
    id?: string,
    text: string,
    chance?: number,
    success: Outcome,
    failure: Outcome,
}

export interface Outcome {
    text: string,
    effects: Stats,
}
