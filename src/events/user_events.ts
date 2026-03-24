
// ═══════════════════════════════════════════════════════════════════════════
//                              User Interface Events
// ═══════════════════════════════════════════════════════════════════════════


/** 
 * Event that happen via the user interface.
 * 
 * When the user selects a button or a choice. these events are sent through an
 * event bus as a subcription. This allows the Game engine to look for when the
 * user chooses options or clicks buttons to run logic.
 */
export const UserEvents = {
    /** User wants to start the game. */
    started_game: "user.started_game",

    /** User chose a class. */
    chose_class: "user.chose_class",

    /** User chose a difficulty. */
    chose_difficulty: "user.chose_difficulty",

    /** User chose an option from the scenario. */
    chose_scenario_option: "user.chose_scenario_option",
}
