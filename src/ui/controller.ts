
// ═══════════════════════════════════════════════════════════════════════════
//                              Screen Controller
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, PlayerEvents, type EventBus } from "@/events";
import { ClassSelectionScreen, StartScreen } from "./screens";
import type { ScreenManager } from ".";
import { JobOfferScreen } from "./screens/job-offer-screen";
import type { Profession } from "@/scripts/game/types";


export class ScreenController {
    // #region Initialization

    
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


    private start_screen = () => {
        this.manager.clear()
        if (!this.manager.current_screen) {
            this.manager.push(new StartScreen(this.bus))
        }
    }

    private class_selection_screen = () => {
        this.manager.push(new ClassSelectionScreen(this.bus))
    }

    private job_offer_screen = (profession: Profession) => {
        this.manager.push(new JobOfferScreen(this.bus, profession))
    }

    private go_to_last_page = () => {
        this.manager.pop() 
    }

    
    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Public API


    public subscribe () {
        this.bus.subscribe(GameEvents.started, this.start_screen)
        this.bus.subscribe(PlayerEvents.unemployed, this.class_selection_screen)
        this.bus.subscribe(PlayerEvents.offered_job, this.job_offer_screen)
        this.bus.subscribe(PlayerEvents.rejected_offer, this.go_to_last_page)
        // this.bus.subscribe(PlayerEvents.was_hired, this.journey_screen)
    }

    public unsubscribe () {
        this.subscriptions.forEach((unsubscribe) => {unsubscribe()})
    }


    // #endregion
}
