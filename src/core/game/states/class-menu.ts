
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Class Menu
// ═══════════════════════════════════════════════════════════════════════════

import { PlayerEvents, UserEvents } from "@/events"
import { GameState } from "./state"
import { JobOffer } from "./job-offer"
import { getProfessionById } from "@/scripts/game/content/professions"
import { GameOver } from "./game-over"
import { GameOverReason } from "../endings"


export class ClassMenu extends GameState {

    private submit_application = (profession_id: string) => {
        const profession = getProfessionById(profession_id)
        this.changeState(new JobOffer(this.context, profession))
    }

    private go_back = () => {
        this.changeState(new GameOver(this.context, GameOverReason.didnt_look_for_jobs))
    }

    onEnter(): void {
        this.post(PlayerEvents.unemployed, this.context.jobs)
        this.listen(UserEvents.chose_class, this.submit_application)
        this.listen(UserEvents.went_back, this.go_back)
    }
}
