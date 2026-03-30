
// ═══════════════════════════════════════════════════════════════════════════
//                          Game State : Playing
// ═══════════════════════════════════════════════════════════════════════════

import type { Profession } from "@/scripts/game/types"
import type { GameContext } from "../context"
import { GameState } from "./state"
import { GameEvents, PlayerEvents, ScenarioEvents } from "@/events"


export class Playing extends GameState {

    private profession: Profession

    constructor (
        context: GameContext,
        profession: Profession
    ) {
        super(context)
        this.profession = profession
    }

    private update_player = () => {}
    private update_encounter = () => {}
    onEnter(): void {
        this.post(GameEvents.playing)
        this.listen(PlayerEvents.update, this.update_player)
        this.listen(ScenarioEvents.update, this.update_encounter)
    }
}
