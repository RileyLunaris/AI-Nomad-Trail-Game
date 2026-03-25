
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Start Menu
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, UserEvents } from "@/events"
import type { GameContext } from "../context"
import { CharacterSelection, GameState } from "."


export class StartMenu extends GameState {
    enter (context: GameContext) {
        context.bus.broadcast(GameEvents.started)
        this.subscriptions.push(
            context.bus.subscribe(
                UserEvents.started_game, 
                () => {context.changeState(new CharacterSelection())}
            )
        )
    }
}
