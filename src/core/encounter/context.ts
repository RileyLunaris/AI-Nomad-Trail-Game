
// ═══════════════════════════════════════════════════════════════════════════
//                              Encounter Context
// ═══════════════════════════════════════════════════════════════════════════

import type { EncounterController } from "./controller";
import type { Encounter } from "./encounter";
import type { EncounterState } from "./states";


export class EncounterContext {
    controller: EncounterController
    data?: Encounter

    constructor (
        controller: EncounterController
    ) {
        this.controller = controller
    }

    changeState (state: EncounterState) {
        this.controller.changeState(state)
    }
}