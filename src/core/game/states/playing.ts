
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Gameplay
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents } from "@/events";
import type { GameContext } from "../context"
import { GameState } from "./state"


export class Playing extends GameState {
    enter (context: GameContext) {
        context.bus.broadcast(GameEvents.playing)
    }
}