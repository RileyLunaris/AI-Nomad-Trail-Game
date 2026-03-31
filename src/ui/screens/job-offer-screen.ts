
// ═══════════════════════════════════════════════════════════════════════════
//                            Screen : Job Offer
// ═══════════════════════════════════════════════════════════════════════════

import type { Offer } from "@/core/job-offer"
import { EventBus, UserEvents } from "@/events"
import { Screen } from "."
import "@/styles/screens/job-offer.scss"


export class JobOfferScreen extends Screen {
    // #region Initialization
    protected offer: Offer

    protected email = document.createElement("div")
    protected subject = document.createElement("h3")
    protected body = document.createElement("p")
    protected signature = document.createElement("p")
    protected accept = document.createElement("button")
    protected reject = document.createElement("button")

    constructor (
        event_bus: EventBus, 
        offer: Offer,
    ) {
        super(event_bus)
        this.offer = offer
    }


    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Helpers


    protected start_game () {
        this.bus.broadcast(UserEvents.accepted_offer, this.offer.position)
    }
    private keep_applying () {
        this.bus.broadcast(UserEvents.rejected_offer, this.offer.position)
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
        
        this.subject.textContent = this.offer.subject
        this.body.textContent = this.offer.body
        this.signature.textContent = this.offer.signature

        this.accept.textContent = "Accept"
        this.reject.textContent = "Reject"

        this.email.replaceChildren(
            this.subject,
            this.body,
            this.signature,
        )
        this.root.replaceChildren(
            this.email,
            this.accept,
            this.reject,
        )
    }
}
