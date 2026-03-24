
// ═══════════════════════════════════════════════════════════════════════════
//                              Screen Controller
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, type EventBus } from "@/events";
import { StartScreen } from "../screens";
import type { ScreenManager } from "./manager";


export class ScreenController {
    // ───────────────────────────────────────────────────────────────────────
    // #region Initialization
    // ───────────────────────────────────────────────────────────────────────

    private subscriptions: Array<() => void> = []
    private bus: EventBus
    private manager: ScreenManager
    
    constructor (
        bus: EventBus,
        manager: ScreenManager,
    ) {
        this.bus = bus
        this.manager = manager
    }
    
    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region helpers
    // ───────────────────────────────────────────────────────────────────────


    private start_screen = () => {
        this.manager.clear()
        this.manager.replace(new StartScreen(this.bus))
    }

    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Public API
    // ───────────────────────────────────────────────────────────────────────

    public subscribe () {
        this.bus.subscribe(GameEvents.started, this.start_screen)
    }

    public unsubscribe () {
        this.subscriptions.forEach((unsubscribe) => {unsubscribe()})
    }

    // #endregion
}
