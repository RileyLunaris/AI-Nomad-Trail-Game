
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Start Menu
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, UserEvents } from "@/events"
import { CharacterSelection, GameState } from "."


export class StartMenu extends GameState {
    listen(): void {
        this.subscriptions.push(
            this.context.bus.subscribe(
                UserEvents.started_game,
                () => {this.context.changeState(new CharacterSelection(this.context))}
            )
        )
    }
    
    post(): void {
        this.context.bus.broadcast(GameEvents.started)
    }
}
