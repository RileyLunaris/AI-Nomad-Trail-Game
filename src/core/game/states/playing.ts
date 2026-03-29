
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Gameplay
// ═══════════════════════════════════════════════════════════════════════════

import type { Profession } from "@/scripts/game/types"
import type { GameContext } from "../context"
import { GameState } from "./state"
import { GameEvents } from "@/events"


export class Playing extends GameState {
    private profession: Profession

    constructor (
        context: GameContext,
        profession: Profession
    ) {
        super(context)
        this.profession = profession
    }

    listen(): void {
        
    }
    post(): void {
        this.context.bus.broadcast(GameEvents.playing)
    }
    update(): void {
        
    }
}
