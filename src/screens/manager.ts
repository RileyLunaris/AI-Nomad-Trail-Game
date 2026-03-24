
// ═══════════════════════════════════════════════════════════════════════════
//                              Screen Manager
// ═══════════════════════════════════════════════════════════════════════════

import { Screen } from "."


/** Manages a stack of UI Screens. */
export class ScreenManager {
    // ───────────────────────────────────────────────────────────────────────
    // #region Initialization
    // ───────────────────────────────────────────────────────────────────────

    /** Root container for all the screens. */
    private root: HTMLElement
    /** Stack of active UI Screens. */
    private stack: Screen[] = []
    

    /** Initializing method for a UI Manager. */
    constructor (root: HTMLElement) {
        this.root = root
    }

    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Public API
    // ───────────────────────────────────────────────────────────────────────

    /** 
     * Adds a new screen to the top of the stack. 
     * @param screen - The new screen.
     */
    public push (screen: Screen): void {
        this.stack.push(screen)
        screen.enter(this.root)
    }

    /** Removes the top screen from the stack. */
    public pop (): void {
        const screen = this.stack.pop()
        screen?.exit()
    }

    /**
     * Replaces the current screen with another.
     * @param screen - the new screen.
     */
    public replace (screen: Screen): void {
        this.pop()
        this.push(screen)
    }

    /** Removes all screens except for the first. */
    public clear (): void {
        while (this.stack.length > 0) {
            this.pop()
        }
    }

    /**
     * Returns the current active screen.
     * @returns - the active screen.
     */
    public current (): Screen | undefined {
        return this.stack[this.stack.length - 1];
    }
    
    //#endregion
}
