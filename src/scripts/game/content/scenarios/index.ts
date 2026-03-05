import { shuffleArray } from "../../../utils";
import type { Scenario } from "../../types";
import { FIREWALL_FIASCO } from "./firewall-fiasco"
import { TECHNICAL_GLITCH } from "./technical-glitch";

export const default_scenarios: Scenario[] = [
    FIREWALL_FIASCO,
    TECHNICAL_GLITCH,
]

export function getRandomScenario(): Scenario {
    return shuffleArray(default_scenarios)[0]!;
}
