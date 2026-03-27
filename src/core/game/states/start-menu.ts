
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Start Menu
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, UserEvents } from "@/events"
import { ClassMenu, GameState } from "."


export class StartMenu extends GameState {
    private seek_employment = () => {
        this.context.changeState(new ClassMenu(this.context))
    }


    listen(): void {
        this.subscriptions.push(
            this.context.bus.subscribe(
                UserEvents.started_game,
                this.seek_employment
            )
        )
    }
    
    post(): void {
        this.context.bus.broadcast(GameEvents.started)
    }
}
