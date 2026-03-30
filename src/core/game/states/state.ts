
// ═══════════════════════════════════════════════════════════════════════════
//                          Game States
// ═══════════════════════════════════════════════════════════════════════════

import type { EventHandler, EventName } from "@/events";
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
    // #region Helpers

    
    protected listen (
        event: EventName, 
        handler: EventHandler
    ) {
        this.subscriptions.push(
            this.context.bus.subscribe(event, handler)
        )
    }
    
    protected post <T> (
        event: EventName, 
        data?: T
    ) {
        this.context.bus.broadcast(event, data)
    }

    protected changeState (
        state: GameState
    ) {
        this.context.changeState(state)
    }


    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Helpers

    
    onEnter? (): void
    onExit? (): void
    update? () :void


    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Public API


    public enter () {
        this.onEnter?.()
    }
    public exit () {
        this.onExit?.()
        this.subscriptions.forEach((unsubscribe) => {unsubscribe()})
    }
    

    // #endregion
}
