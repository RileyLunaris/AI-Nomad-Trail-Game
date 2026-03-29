
// ═══════════════════════════════════════════════════════════════════════════
//                              Game Over Screen
// ═══════════════════════════════════════════════════════════════════════════

import { UserEvents, type EventBus } from "@/events";
import { Screen } from "./screen";


export class GameOverScreen extends Screen {
    private reason: string

    protected title = document.createElement("h2")
    protected info = document.createElement("p")
    protected button = document.createElement("button")

    constructor (
        event_bus: EventBus,
        reason: string,
    ) {
        super(event_bus)
        this.reason = reason
    }

    private click_retry = () => {
        this.bus.broadcast(UserEvents.restarted_game)
    }
    protected subscribe(): void {
        this.listen(
            this.button,
            "click",
            this.click_retry
        )
    }
    protected build(): void {
        this.root.classList.add("game-over-screen")

        this.title.textContent = "GAME - OVER"
        this.info.textContent = this.reason
        this.button.textContent = "RETRY ?"

        this.root.replaceChildren(
            this.title,
            this.info,
            this.button,
        )
    }
}