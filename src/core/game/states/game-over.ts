
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Game Over
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, UserEvents } from "@/events"
import { GameState } from "./state"
import type { GameContext } from "../context"
import { StartMenu } from "./start-menu"
import { ListRandomProfessions } from "@/scripts/game/content/professions"


export const GameOverReason = {
    didnt_look_for_jobs: "You remain jobless, bills are overflowing, and you cripple under the weight of expectations.",
    rejected_too_many_offers: "Dispite having potential, you remain a lost cause. Your lack of willingness to work tarnishes your reputation and you can't get a job.",

}

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
        this.context.changeState(
            new StartMenu(this.context)
        )
    }

    listen(): void {
        this.subscriptions.push(
            this.context.bus.subscribe(
                UserEvents.restarted_game,
                this.restart_game,
            )
        )
    }

    post () {
        this.context.bus.broadcast(GameEvents.game_over, this.reason)
    }
}
