
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Start Menu
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, UserEvents } from "@/events"
import { CharacterSelection, GameState } from "."


export class StartMenu extends GameState {
    enter () {
        this.context.bus.broadcast(GameEvents.started)
        this.subscriptions.push(
            this.context.bus.subscribe(
                UserEvents.started_game, 
                () => {this.context.changeState(new CharacterSelection(this.context))}
            )
        )
    }
}
