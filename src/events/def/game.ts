
// ═══════════════════════════════════════════════════════════════════════════
//                                  Game Events
// ═══════════════════════════════════════════════════════════════════════════


/** 
 * Defines all event names related to core game lifecycle and state changes.
 *
 * These events typically represent high-level transitions or actions
 * that affect the overall game flow.
 */
export const GameEvents = {
    /** The game is initialized. */
    started: "game.started",

    /** The game is a foot. 🦶 */
    playing: "game.playing",

    /** The game has ended. */
    game_over: "game.game_over",
}
