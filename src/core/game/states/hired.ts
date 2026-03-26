
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Hired
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents } from "@/events"
import { GameState } from "./state"
import type { Profession } from "@/scripts/game/types"
import type { GameContext } from "../context"
import { getProfessionById } from "@/scripts/game/content/professions"


export class Hired extends GameState {
    private profession: Profession

    constructor (
        context: GameContext,
        profession_id: string,
    ) {
        super(context)
        this.profession = getProfessionById(profession_id)
    }

    post () {
        this.context.bus.broadcast(GameEvents.employed, this.profession)
    }
}
