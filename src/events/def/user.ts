
// ═══════════════════════════════════════════════════════════════════════════
//                                  User Events
// ═══════════════════════════════════════════════════════════════════════════


/** 
 * Contains event names related to user actions.
 * 
 * These events represent actions performed by the user's actions or status
 * within the application layer.
 */
export const UserEvents = {

    /** User wants to start the game. */
    started_game: "user.started_game",

    /** User re-started the game. */
    restarted_game: "user.restarted_game",

    /** User chose a class. */
    chose_class: "user.chose_class",

    /** User chose a difficulty. */
    chose_difficulty: "user.chose_difficulty",

    /** Accepted Job Offer. */
    accepted_offer: "user.accepted_offer",

    /** Rejected job Offer. */
    rejected_offer: "user.rejected_offer",

    /** User chose an option from the scenario. */
    chose_scenario_option: "user.chose_scenario_option",

    /** User went back. */
    went_back: "user.went_back"
    
} as const
