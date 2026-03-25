
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Class Menu
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents } from "@/events"
import type { GameContext } from "../context"
import { GameState } from "./state"


export class CharacterSelection extends GameState {
    enter (context: GameContext) {
        context.bus.broadcast(GameEvents.choose_class)
    }
}
