
// ────────────────────────────────────────────────────────────────────────────
//                              User Interface Events
// ────────────────────────────────────────────────────────────────────────────


/** 
 * Event that happen via the user interface.
 * 
 * When the user selects a button or a choice. these events are sent through an
 * event bus as a subcription. This allows the Game engine to look for when the
 * user chooses options or clicks buttons to run logic.
 */
export const UIEvents = {
    /** User wants to start the game. */
    game_start: "user.game_start",

    /** User chose a class. */
    class_choice: "user.class_select",

    /** User chose an option from the scenario. */
    scenario_choice: "user:scenario.option_select",
}
