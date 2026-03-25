
// ═══════════════════════════════════════════════════════════════════════════
//                              Game States
// ═══════════════════════════════════════════════════════════════════════════

import type { GameContext } from "../context";


export abstract class GameState {
    subscriptions: Array<() => void> = []
    enter? (context: GameContext): void
    update? (context: GameContext) :void
    exit? (context: GameContext) {
        console.log(context)
        this.subscriptions.forEach((unsubscribe) => {unsubscribe()})
    }
}
