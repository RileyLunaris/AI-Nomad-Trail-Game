import type { Player, Scenario } from ".";

export interface GameState {
    currenct_scenario: Scenario
    player: Player,
    location: string,
}

export interface GameStateSummary {
    scenario: string
    attempt: string
    profession: string
}
