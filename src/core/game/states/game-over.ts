
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Game Over
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, UserEvents } from "@/events"
import { GameState } from "./state"
import type { GameContext } from "../context"
import { StartMenu } from "./start-menu"
import { ListRandomProfessions } from "@/scripts/game/content/professions"


export class GameOver extends GameState {
    
    private reason: string

    constructor (
        context: GameContext,
        reason: string
    ) {
        super(context)
        this.reason = reason
    }

    private restart_game = () => {
        console.log("restarting-game")
        this.context.jobs = ListRandomProfessions()
        this.changeState(new StartMenu(this.context))
    }
    
    onEnter(): void {
        this.post(GameEvents.game_over, this.reason)
        this.listen(UserEvents.restarted_game, this.restart_game)
    }
}
