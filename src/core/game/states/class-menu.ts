
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Class Menu
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents } from "@/events"
import { GameState } from "./state"
import { ListRandomProfessions } from "@/scripts/game/content/professions"


export class CharacterSelection extends GameState {
    enter () {
        this.context.bus.broadcast(
            GameEvents.choose_class, 
            ListRandomProfessions()
        )
    }
}
