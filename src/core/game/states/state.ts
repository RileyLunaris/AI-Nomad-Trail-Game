
// ═══════════════════════════════════════════════════════════════════════════
//                              Game States
// ═══════════════════════════════════════════════════════════════════════════

import type { GameContext } from "../context";


export abstract class GameState {
    // #region Initialization


    protected context: GameContext
    protected subscriptions: Array<() => void>

    constructor (context: GameContext) {
        this.context = context
        this.subscriptions = []
    }


    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region helpers

    
    listen? (): void
    post? (): void
    update? () :void


    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Public API


    enter () {
        this.listen?.()
        this.post?.()
    }
    exit () {
        this.subscriptions.forEach((unsubscribe) => {unsubscribe()})
    }
    

    // #endregion
}
