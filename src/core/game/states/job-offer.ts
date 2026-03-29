
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Offered Job
// ═══════════════════════════════════════════════════════════════════════════

import { PlayerEvents, UserEvents } from "@/events"
import { GameState } from "./state"
import type { Profession } from "@/scripts/game/types"
import type { GameContext } from "../context"
import { ClassMenu } from "./class-menu"
import { GameOver, GameOverReason } from "./game-over"
import { Playing } from "./playing"


export class JobOffer extends GameState {
    private profession: Profession

    constructor (
        context: GameContext,
        profession: Profession,
    ) {
        super(context)
        this.profession = profession
    }


    private reject_offer = () => {
        this.context.jobs = this.context.jobs.filter(job => job != this.profession)
        if (this.context.jobs.length === 0) {
            this.context.changeState(new GameOver(this.context, GameOverReason.rejected_too_many_offers))
        } else {
            this.context.changeState(new ClassMenu(this.context))
        }
    }

    private accept_offer = () => {
        this.context.changeState(new Playing(this.context, this.profession))
    }

    listen(): void {
        this.subscriptions.push(
            this.context.bus.subscribe(
                UserEvents.rejected_offer, 
                this.reject_offer
            ),
            this.context.bus.subscribe(
                UserEvents.accepted_offer,
                this.accept_offer
            ),
        )
    }

    post () {
        this.context.bus.broadcast(PlayerEvents.offered_job, this.profession)
    }
}
