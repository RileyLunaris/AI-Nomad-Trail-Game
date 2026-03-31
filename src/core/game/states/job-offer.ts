
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Job Offer
// ═══════════════════════════════════════════════════════════════════════════

import { PlayerEvents, UserEvents } from "@/events"
import { GameState } from "./state"
import type { Profession } from "@/scripts/game/types"
import type { GameContext } from "../context"
import { ClassMenu } from "./class-menu"
import { GameOver } from "./game-over"
import { Playing } from "./playing"
import { GameOverReason } from "../endings"
import { fetchJobOffer } from "@/core/job-offer/offer"
import type { Offer } from "@/core/job-offer"


export class JobOffer extends GameState {

    private profession: Profession
    private offer: Offer

    constructor (
        context: GameContext,
        profession: Profession,
    ) {
        super(context)
        this.profession = profession
        this.offer = fetchJobOffer(profession.name)
    }

    private end_game () {
        this.changeState(new GameOver(this.context, GameOverReason.rejected_too_many_offers))
    }
    private continue_game () {
        this.context.jobs = this.context.jobs.filter( job => job != this.profession )
        this.changeState(new ClassMenu(this.context))
    }

    private reject_offer = () => {
        if (this.context.jobs.length <= 1) {
            this.end_game()
        } else { 
            this.continue_game()
        }
    }

    private accept_offer = () => {
        this.changeState(new Playing(this.context, this.profession))
    }

    onEnter(): void {
        this.post(PlayerEvents.offered_job, this.offer)
        this.listen(UserEvents.rejected_offer, this.reject_offer)
        this.listen(UserEvents.accepted_offer, this.accept_offer)
    }
}
