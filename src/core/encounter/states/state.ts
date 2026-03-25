
// ═══════════════════════════════════════════════════════════════════════════
//                              Encounter States
// ═══════════════════════════════════════════════════════════════════════════

import type { EncounterContext } from "../context";


export abstract class EncounterState {
    enter? (context: EncounterContext): void
    update? (context: EncounterContext) :void
    exit? (context: EncounterContext): void
}
