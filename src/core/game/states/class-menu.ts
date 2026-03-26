
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Class Menu
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, UserEvents } from "@/events"
import { GameState } from "./state"
import { ListRandomProfessions } from "@/scripts/game/content/professions"
import { Playing } from "./playing"


export class CharacterSelection extends GameState {
    listen(): void {
        this.subscriptions.push(
            this.context.bus.subscribe(
                UserEvents.chose_class,
                (profession_id) => {this.context.changeState(new Playing(this.context, profession_id))}
            )
        )
    }
    
    post(): void {
        this.context.bus.broadcast(
            GameEvents.choose_class,
            ListRandomProfessions()
        )
    }
}
