import type { Stats } from ".";

export interface Scenario {
    text: string,
    description: string,
    outcome: Outcome,
    options: Option[],
}

export interface Option {
    id?: string,
    text: string,
    success: string,
    failure: string,
    affects: Stats,
}

export interface Outcome {
    text: string,
    affects: Stats,
}
