
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

    /** The player needs a job. */
    unemployed: "game.player_unemployed",
    
    /** The player was Hired. */
    employed: "game.player_employed",

    /** The game is a foot. 🦶 */
    playing: "game.playing",

    /** The game has ended. */
    game_over: "game.game_over",
} as const
