
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Gameplay
// ═══════════════════════════════════════════════════════════════════════════

import type { Profession } from "@/scripts/game/types"
import type { GameContext } from "../context"
import { GameState } from "./state"
import { getProfessionById } from "@/scripts/game/content/professions"
import { GameEvents } from "@/events"


export class Playing extends GameState {
    private profession: Profession

    constructor (
        context: GameContext,
        profession_id: string,
    ) {
        super(context)
        this.profession = getProfessionById(profession_id)
    }
    post(): void {
        this.context.bus.broadcast(GameEvents.playing)
    }
    update(): void {
        
    }
}
