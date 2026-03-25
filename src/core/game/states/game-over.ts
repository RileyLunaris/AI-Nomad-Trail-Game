
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Game Over
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents } from "@/events"
import type { GameContext } from "../context"
import { GameState } from "./state"


export class GameOver extends GameState {
    enter (context: GameContext) {
        context.bus.broadcast(GameEvents.game_over)
    }
}
