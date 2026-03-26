
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Game Over
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents } from "@/events"
import { GameState } from "./state"


export class GameOver extends GameState {
    enter () {
        this.context.bus.broadcast(GameEvents.game_over)
    }
}
