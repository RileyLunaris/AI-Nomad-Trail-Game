
// ═══════════════════════════════════════════════════════════════════════════
//                              Encounter States
// ═══════════════════════════════════════════════════════════════════════════

import type { EncounterContext } from "../context";


export abstract class EncounterState {
    protected context: EncounterContext
    constructor (context: EncounterContext) {
        this.context = context
    }
    enter? (): void
    update? () :void
    exit? (): void
}
