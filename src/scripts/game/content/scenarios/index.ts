import { shuffleArray } from "../../../utils";
import { Scenario, type ScenarioData } from "../../types";
import { FIREWALL_FIASCO } from "./firewall-fiasco"
import { TECHNICAL_GLITCH } from "./technical-glitch";

export const default_scenarios: ScenarioData[] = [
    FIREWALL_FIASCO,
    TECHNICAL_GLITCH,
]

export function getRandomScenario(): Scenario {
    return Scenario.from(shuffleArray(default_scenarios)[0]!);
}
