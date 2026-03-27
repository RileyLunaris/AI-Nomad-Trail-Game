
// ═══════════════════════════════════════════════════════════════════════════
//                              Game Context
// ═══════════════════════════════════════════════════════════════════════════

import type { EventBus } from "@/events";
import type { GameEngine } from "./engine";
import type { GameState } from "./states";
import { ListRandomProfessions } from "@/scripts/game/content/professions";
import type { Profession } from "@/scripts/game/types";


export class GameContext {
    engine: GameEngine
    bus: EventBus
    jobs: Profession[]
    last?: GameState

    constructor (
        engine: GameEngine,
        event_bus: EventBus,
    ) {
        this.engine = engine
        this.bus = event_bus
        this.jobs = ListRandomProfessions()
    }

    changeState (new_state: GameState): void {
        this.last = this.engine.state
        this.engine.changeState(new_state)
    }

    revertState () {
        if (this.last) this.engine.changeState(this.last)
    }
}
