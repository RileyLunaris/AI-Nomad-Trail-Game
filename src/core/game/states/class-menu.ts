
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Class Menu
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents } from "@/events"
import type { GameContext } from "../context"
import { GameState } from "./state"
import { ListRandomProfessions } from "@/scripts/game/content/professions"


export class CharacterSelection extends GameState {
    enter (context: GameContext) {
        context.bus.broadcast(GameEvents.choose_class, ListRandomProfessions())
    }
}
