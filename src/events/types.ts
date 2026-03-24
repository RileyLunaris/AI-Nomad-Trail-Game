
// ═══════════════════════════════════════════════════════════════════════════
//                                  Event Types
// ═══════════════════════════════════════════════════════════════════════════

import { 
    GameEvents, 
    UserEvents, 
    PlayerEvents, 
    ScenarioEvents,
} from "./def"


/**
 * Collection of all events within the app.
 */
type EventGroups = 
| typeof GameEvents 
| typeof UserEvents 
| typeof PlayerEvents 
| typeof ScenarioEvents

/**
 * Utility type that extracts the union of all values from an object type.
 */
type ValueOf<T> = T[keyof T]

/**
 * Mapped Name type for all events within the app.
 */
export type EventName = ValueOf<EventGroups>

/**
 * Default structure for Event Handlers and optional data.
 * 
 * Event Handlers are internal functions with optional paramaters that called
 * during a subscribed event flag.
 */
export type EventHandler <T = any> = (data: T) => void

/**
 * An Event subscription typing which links and event with a handler.
 */
export type EventSubscription<T = any> = {
    event: EventName
    handler: EventHandler<T>
}
