
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Class Menu
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, UserEvents } from "@/events"
import { GameState } from "./state"
import { ListRandomProfessions } from "@/scripts/game/content/professions"
import { Hired } from "./hired"


export class CharacterSelection extends GameState {
    listen(): void {
        this.subscriptions.push(
            this.context.bus.subscribe(
                UserEvents.chose_class,
                (profession_id) => {this.context.changeState(new Hired(this.context, profession_id))}
            )
        )
    }
    
    post(): void {
        this.context.bus.broadcast(
            GameEvents.unemployed,
            ListRandomProfessions()
        )
    }
}
