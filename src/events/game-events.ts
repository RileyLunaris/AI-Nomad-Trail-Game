
// ═══════════════════════════════════════════════════════════════════════════
//                                  Game Events
// ═══════════════════════════════════════════════════════════════════════════


/** 
 * Events that happen within the game logic.
 * 
 * These allow the visual display and user interface to repond to events that
 * happen within the game logic. 
 */
export const GameEvents = {
    //#region game core events

    /** The game is initialized. */
    start: "game.start",

    /** The game is a foot. 🦶 */
    play: "game.play",

    /** The game has ended. */
    game_over: "game.game_over",

    //#endregion


    //#region gameplay updates

    /** The player's stats were affected.  */
    player_update: "game.player_update",

    /** A new scenario encounter. */
    scenario_update: "game.scenario_update",

    /** The game scenario Outcome has resolved. */
    scenario_outcome: "game.scenario_outcome",

    //#endregion
}
