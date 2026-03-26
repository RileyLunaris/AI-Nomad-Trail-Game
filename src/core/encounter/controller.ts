
// ═══════════════════════════════════════════════════════════════════════════
//                          Encounter Controller
// ═══════════════════════════════════════════════════════════════════════════

import type { EventBus } from "@/events";
import { EncounterContext } from "./context";
import { Fetching, type EncounterState } from "./states";


export class EncounterController {
    bus: EventBus
    state: EncounterState
    context: EncounterContext

    constructor (
        event_bus: EventBus,
    ) {
        this.bus = event_bus
        this.context = new EncounterContext(this)
        this.state = new Fetching(this.context);
        this.state.enter?.()
    }

    changeState (new_state: EncounterState) {
        this.state.exit?.()
        this.state = new_state
        this.state.enter?.()
    }
}