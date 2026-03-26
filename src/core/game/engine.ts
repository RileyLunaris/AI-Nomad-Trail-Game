
// ═══════════════════════════════════════════════════════════════════════════
//                              Game Engine
// ═══════════════════════════════════════════════════════════════════════════

import { EventBus } from "@/events"
import { StartMenu, type GameState } from "./states"
import { EncounterController } from "../encounter/controller"
import { GameContext } from "./context"


export class GameEngine {
    bus: EventBus
    state: GameState
    context: GameContext
    encounter: EncounterController
    
    
    constructor (event_bus: EventBus) {
        this.bus = event_bus
        this.context = new GameContext(this, this.bus)
        this.encounter = new EncounterController(this.bus)
        this.state = new StartMenu(this.context)
        this.state.enter?.()
    }

    changeState (new_state: GameState) {
        this.state.exit?.()
        this.state = new_state
        this.state.enter?.()
    }
}
