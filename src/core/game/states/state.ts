
// ═══════════════════════════════════════════════════════════════════════════
//                              Game States
// ═══════════════════════════════════════════════════════════════════════════

import type { GameContext } from "../context";


export abstract class GameState {
    protected context: GameContext
    protected subscriptions: Array<() => void>

    constructor (context: GameContext) {
        this.context = context
        this.subscriptions = []
    }

    enter? (): void
    update? () :void
    exit () {
        this.subscriptions.forEach((unsubscribe) => {unsubscribe()})
    }
}
