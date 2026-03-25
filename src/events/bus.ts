
// ═══════════════════════════════════════════════════════════════════════════
//                                  Events Bus
// ═══════════════════════════════════════════════════════════════════════════

import type {EventName, EventHandler} from "."


/**
 * Fluent builder used to configure and register event subscriptions.
 * 
 * This class is stateful and accumulates handlers and modifiers
 * (such as `once`) before finally registering them via `subscribe()`.
 * 
 * Behaviour:
 * - `.do()` Adds handler to event.
 * - `.once()` Limits execution of all handlers to a single call.
 * - `.subscribe()` Finalizes the builder. returns unsubscription process.
 * 
 * @example
 * ```ts
 * const unsubscribe = bus.on(EventName.name)
 *   .do(handlerA)
 *   .do(handlerB)
 *   .once() // order does not matter, both A and B will run only once.
 *   .subscribe()
 * 
 * unsubscribe() // unsubscribes all handlers
 * ```
 */
class EventSubscription {
    /** The Event Bus. */
    private bus: EventBus
    /** The event handlers subscribe to. */
    private event: EventName
    /** All the handler functions for this event. */
    private handlers: EventHandler[] = []
    /** Internal flag for single use subscriptions. */
    private limit_once: boolean = false
    
    /** Initializer for the EventBuilder.
     * 
     * @param bus The event bus subscription manager.
     * @param event The event that handlers will subscribe to.
     */
    constructor (
        bus: EventBus,
        event: EventName,
    ) {
        this.bus = bus
        this.event = event
    }
    
    /**
     * Adds a handler to this subscription.
     * 
     * @example 
     * ```ts
     * // Chaining multiple handlers:
     * bus.on(EventName.name)
     *    .do(a)
     *    .do(b)
     * ```
     * 
     * @param handler Funtion that is called when the event is broadcast.
     * @returns The same builder instance for chaining.
     */
    do (handler:EventHandler) {
        this.handlers.push(handler)
        return this
    }

    /**
     * Marks this subscription as single use.
     * 
     * All handlers added to this builder will:
     * - Execute only on the first event broadcast.
     * - Automattically unsubscribe themselves afterwards.
     * 
     * @returns The same builder instance for chaining.
     */
    once () {
        this.limit_once = true
        return this
    }

    /**
     * Wrapps a handler so it only executes once.
     * 
     * After the first execution:
     * - The handler is marked as called
     * - It removes itself from the event bus.
     * @param handler Original handler function.
     * @returns A wrapped handler with "once" behavior.
     */
    private wrapHandler <T> (handler: EventHandler): EventHandler {
        let called = false

        const wrapper = (data?: T) => {
            if (this.limit_once && called) return
            called = true
            handler(data)

            if (this.limit_once) {
                this.bus.unsubscribe(this.event, wrapper)
            }
        }

        return wrapper
    }

    /**
     * Finalizes the builder and registers all handlers to the EventBus.
     * 
     * Internally:
     * - Wraps handlers if `.once()` was used
     * - Registers each handler to the bus
     * - Collects all unsubscribe functions
     * 
     * @returns A callable function that unsubscribes all handlers created by
     * this builder.
     * 
     * @example
     * ```ts
     * const unsubscribe = bus.on(Event.name)
     *   .do(handler)
     *   .subscribe()
     * 
     * unsubscribe() // removes the handler
     * ```
     */
    subscribe (): () => void {
        const subscriptions : (() => void)[] = []

        this.handlers.forEach((handler) => {
            this.bus.subscribe(
                this.event, 
                this.wrapHandler(handler)
            )

            subscriptions.push(() => {
                this.bus.unsubscribe(
                    this.event, 
                    this.wrapHandler(handler)
                )
            })
        })

        return () => {
            subscriptions.forEach((unsubscribe) => {unsubscribe()})
        }
    }
}


/**
 * Event bus used to publish and subscribe to events.
 * 
 * Each event is mapped to event handlers, stored in a set to prevent duplicate
 * registrations. 
 */
export class EventBus {
    /** Mapping of events to event handler functions. */
    private events = new Map<EventName, Set<EventHandler>>()

    /**
     * Subscribes a handler function to an event.
     * 
     * If the event does not yet exist in the registry, it will be created.
     * The handler is stored in a Set, ensuring no duplicate registrations.
     * 
     * @param event The event name to listen to
     * @param handler Function to execute when the event is broadcast
     * 
     * @example
     * ```ts
     * bus.subscribe("user:login", (user) => {
     *   console.log(user)
     * })
     * ```
     */
    subscribe (
        event: EventName,
        handler: EventHandler,
    ): () => void {
        if (!this.events.has(event)) {
            this.events.set(event, new Set())
        }
        this.events.get(event)!.add(handler)
        return () => {this.unsubscribe(event, handler)}
    }

    /**
     * Removes a previously subscribed handler from an event.
     * 
     * If the handler is not found, this operation is a no-op.
     * 
     * @param event The event name the handler was subscribed to
     * @param handler The handler function to remove
     * 
     * @example
     * ```ts
     * bus.unsubscribe("user:login", handler)
     * ```
     */
    unsubscribe (
        event: EventName,
        handler: EventHandler,
    ) {
        this.events.get(event)?.delete(handler)
    }

    /**
     * Broadcasts an event to all subscribed handlers.
     * 
     * Each handler will be invoked with the provided data.
     * If no handlers are registered for the event, nothing happens.
     * 
     * @typeParam T The type of data passed to handlers
     * @param event The event name to broadcast
     * @param data Optional payload passed to each handler
     * 
     * @example
     * ```ts
     * bus.broadcast("user:login", { id: 1 })
     * ```
     */
    broadcast <T> (event: EventName, data?:T) {
        console.log(`Event: ${event}`)
        this.events.get(event)?.forEach((handle) => {handle(data)})
    }

    /**
     * Creates a fluent subscription builder for a specific event.
     * 
     * This allows chaining handlers and modifiers (e.g. `.once()`)
     * before registering them with `.subscribe()`.
     * 
     * @param event The event name to subscribe to
     * @returns An `EventBuilder` instance for chaining
     * 
     * @example
     * ```ts
     * const off = bus.on("event")
     *   .do(handler)
     *   .once()
     *   .subscribe()
     * 
     * off() // unsubscribe
     * ```
     */
    on (event: EventName) {
        return new EventSubscription(this, event)
    }
}
