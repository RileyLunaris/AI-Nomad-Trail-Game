
// ═══════════════════════════════════════════════════════════════════════════
//                                Job Offer Screen
// ═══════════════════════════════════════════════════════════════════════════

import { EventBus, UserEvents } from "@/events"
import { Screen } from "."
import "@/styles/screens/job-offer.scss"
import type { Profession } from "@/scripts/game/types"
import { shuffleArray } from "@/scripts/utils"


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
        const random_company = () => {
            const companies = [
                "TehSlur",
                "Pineapple",
                "MacroSlop",
                "Chad Gypity",
                "ToyYoda",
                "StarBox",
                "ClockedIn",
                "Spotificate",
                "NeckFlicks",
            ]
            return shuffleArray(companies)[0]!
        }

        this.root.classList.add("job-offer-screen")
        this.title.textContent = `
New Email:
Subject :: 🚨👍🎉 !! Congrat$ G !! 🎉👍🚨
`
        this.description.textContent = `
Dear [appicant.name],


After carelessly reviewing your application. We here at ${random_company()} are less than thrilled to offer you a role as our new, remote only,  ${this.profession.name}!

We can't say that you are qualified, nor did we check your references. We are so eager to never meet you in person, ever!


Worst Regards, ❤️
[resourced_human.name]

`
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
