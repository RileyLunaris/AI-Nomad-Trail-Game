
// ═══════════════════════════════════════════════════════════════════════════
//                              Game States
// ═══════════════════════════════════════════════════════════════════════════

import type { GameContext } from "../context";


export abstract class GameState {
    subscriptions: Array<() => void> = []
    enter? (context: GameContext): void
    update? (context: GameContext) :void
    exit? (context: GameContext) {
        this.subscriptions.forEach((unsubscribe) => {unsubscribe()})
    }
}
