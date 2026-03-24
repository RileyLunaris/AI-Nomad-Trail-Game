
// ═══════════════════════════════════════════════════════════════════════════
//                                  Event Types
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, UserEvents } from "."


/**
 * Default structure for Event Handlers and optional data.
 * 
 * Event Handlers are internal functions with optional paramaters that called
 * during a subscribed event flag.
 */
export type EventHandler <T = any> = (data: T) => void


/**
 * Mapped Names for all events within the app.
 * Includes events from the game, the api, and the user interfaces.
 */
export type EventName = 
| typeof GameEvents[keyof typeof GameEvents]
| typeof UserEvents[keyof typeof UserEvents]


/**
 * An Event subscription typing which links and event with a handler.
 */
export type EventSubscription<T = any> = {
    event: EventName
    handler: EventHandler<T>
}
