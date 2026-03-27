
// ═══════════════════════════════════════════════════════════════════════════
//                                  Player Events
// ═══════════════════════════════════════════════════════════════════════════


/** 
 * Defines event names for player specific actions within the game.
 * 
 * These events are a subset of game events that are directly related to the
 * player's status and states within the game.
 */
export const PlayerEvents = {

    /** The player needs a job. */
    unemployed: "player.seeking_employment",
    
    /** The player was offered a job. */
    offered_job: "player.offered_job",

    /** Player accepted the offer */
    accepted_offer: "player.accepted_offer",

    /** Player rejected the offer. */
    rejected_offer: "player.rejected_offer",

    /** The player accepted the offer. */
    was_hired: "player.was_hired",

    /** The player's stats were affected.  */
    update: "player.update",
    
} as const
