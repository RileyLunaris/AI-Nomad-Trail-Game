
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Start Menu
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, UserEvents } from "@/events"
import { ClassMenu, GameState } from "."


export class StartMenu extends GameState {
    
    private seek_employment = () => {
        this.changeState(new ClassMenu(this.context))
    }

    onEnter(): void {
        this.post(GameEvents.started)
        this.listen(UserEvents.started_game, this.seek_employment)
    }
}
