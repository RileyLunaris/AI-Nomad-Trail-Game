
// ═══════════════════════════════════════════════════════════════════════════
//                                Job Offer Screen
// ═══════════════════════════════════════════════════════════════════════════

import { EventBus, PlayerEvents, UserEvents } from "@/events"
import { Screen } from "."
import "@/styles/screens/job-offer.scss"
import type { Profession } from "@/scripts/game/types"


export class JobOfferScreen extends Screen {
    // #region Initialization


    protected profession: Profession

    protected title = document.createElement("h3")
    protected description = document.createElement("p")
    protected accept = document.createElement("button")
    protected reject = document.createElement("button")

    constructor (
        event_bus: EventBus, 
        profession: Profession,
    ) {
        super(event_bus)
        this.profession = profession
    }


    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Helpers


    protected start_game () {
        this.bus.broadcast(UserEvents.accepted_offer, this.profession)
    }
    private keep_applying () {
        this.bus.broadcast(UserEvents.rejected_offer, this.profession)
    }


    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Lifecycle


    protected subscribe(): void {
        this.listen(
            this.accept,
            "click",
            this.start_game.bind(this)
        )
        this.listen(
            this.reject,
            "click",
            this.keep_applying.bind(this)
        )
    }

    protected build(): void {
        this.root.classList.add("job-offer-screen")
        this.title.textContent = "!! Congratulations !!"
        this.description.textContent = `You've been selected to work as a remote ${this.profession.name}`
        this.accept.textContent = "Accept"
        this.reject.textContent = "Reject"
        this.root.replaceChildren(
            this.title,
            this.description,
            this.accept,
            this.reject,
        )
    }
}
