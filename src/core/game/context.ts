
// ═══════════════════════════════════════════════════════════════════════════
//                              Game Context
// ═══════════════════════════════════════════════════════════════════════════

import type { EventBus } from "@/events";
import type { GameEngine } from "./engine";
import type { GameState } from "./states";


export class GameContext {
    engine: GameEngine
    bus: EventBus

    constructor (
        engine: GameEngine,
        event_bus: EventBus,
    ) {
        this.engine = engine
        this.bus = event_bus
    }

    changeState (new_state: GameState): void {
        this.engine.changeState(new_state)
    }
}
