
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Class Menu
// ═══════════════════════════════════════════════════════════════════════════

import { PlayerEvents, UserEvents } from "@/events"
import { GameState } from "./state"
import { JobOffer } from "./job-offer"
import { StartMenu } from "./start-menu"
import { getProfessionById } from "@/scripts/game/content/professions"


export class ClassMenu extends GameState {
    private submit_application = (profession_id: string) => {
        const profession = getProfessionById(profession_id)
        this.context.changeState(
            new JobOffer(this.context, profession)
        )
    }
    private go_back = () => {
        this.context.changeState(
            new StartMenu(this.context)
        )
    }

    listen(): void {
        this.subscriptions.push(
            this.context.bus.subscribe(
                UserEvents.chose_class,
                this.submit_application,
            )
        )

        this.subscriptions.push(
            this.context.bus.subscribe(
                UserEvents.went_back,
                this.go_back,
            )
        )
    }
    
    post(): void {
        this.context.bus.broadcast(
            PlayerEvents.unemployed,
            this.context.jobs,
        )
    }
}
