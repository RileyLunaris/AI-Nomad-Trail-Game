
// ═══════════════════════════════════════════════════════════════════════════
//                              Start Screen
// ═══════════════════════════════════════════════════════════════════════════

import { UserEvents } from "@/events";
import { Screen } from ".";


/**
 * Start Screen for initializing the game.
 */
export class StartScreen extends Screen {
    // ───────────────────────────────────────────────────────────────────────
    // #region Initialization
    // ───────────────────────────────────────────────────────────────────────

    /** The title container. */
    protected title: HTMLElement = document.createElement("h1")

    /** The start button to begin the game. */
    protected start_button: HTMLButtonElement = document.createElement("button")

    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Lifecycle
    // ───────────────────────────────────────────────────────────────────────
    
    protected subscribe(): void {
        // Handlers
        /** Broadcasts that the user wants to start the game. */
        const start_game = () => {
            this.bus.broadcast(UserEvents.started_game)
        }

        // Listeners
        this.listen(this.start_button, "click", start_game)
    }

    protected build(): void {
        // class definitions
        this.root.classList.add("start-screen")
        this.title.classList.add("title")
        this.start_button.classList.add("start")

        // Values
        this.title.textContent = "AI NOMAD TRAIL"
        this.start_button.textContent = "START JOURNEY"

        // DOM
        this.root.replaceChildren(
            this.title,
            this.start_button,
        )
    }

    // #endregion
}
