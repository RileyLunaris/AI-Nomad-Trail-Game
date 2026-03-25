
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
 *
 * This utility works distributively over union types. That means if `T` is a union
 * (e.g., `A | B`), it will compute the value types of each member separately and
 * return their union.
 *
 * @template T - The object type (or union of object types) to extract values from.
 *
 * @example
 * type Foo = { a: string; b: number };
 * type Result = ValueOf<Foo>;
 * // string | number
 *
 * @example
 * type A = { x: string };
 * type B = { y: number };
 * type Result = ValueOf<A | B>;
 * // string | number (distributes over the union)
 */
type ValueOf<T> = T extends any ? T[keyof T] : never

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
