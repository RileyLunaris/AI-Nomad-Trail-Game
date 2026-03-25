
// ═══════════════════════════════════════════════════════════════════════════
//                              Default Screen
// ═══════════════════════════════════════════════════════════════════════════

import type { EventBus } from "@/events"


/**
 * Base class representing a user interface screen.
 *
 * Provides a lifecycle-driven structure for creating, mounting, and
 * cleaning up UI screens. A screen is responsible for:
 *
 * - Building its DOM structure
 * - Subscribing to external systems (event bus, etc.)
 * - Managing DOM event listeners
 * - Cleaning up ALL side effects on exit
 *
 * All side effects (event listeners, timers, subscriptions, etc.)
 * should be registered via `track()` to ensure automatic cleanup.
 */
export abstract class Screen {
    // #region Initialization


    /** Root DOM element for this screen. */
    protected root: HTMLElement

    /**
     * Collection of cleanup callbacks.
     *
     * Each function represents a side effect (event listener,
     * subscription, etc.) that must be undone when the screen exits.
     */
    protected subscriptions: Array<() => void> = []

    /** The event bus to subscribe and broadcast to. */
    protected bus: EventBus

    /** Tracks whether the screen is currently mounted. */
    protected is_mounted = false


    /**
     * Initializes the screen instance.
     *
     * - Creates the root `<div>` element
     * - Applies the `ui-screen` CSS class
     *
     * NOTE:
     * DOM is NOT built here. Building occurs on `enter()` to allow
     * for controlled lifecycle timing and safer subclassing.
     * 
     * @param bus - Event bus used for sbuscribing and broadcasting events.
     */
    constructor (bus: EventBus) {
        this.root = document.createElement("div")
        this.root.classList.add("ui-screen")
        this.bus = bus
    }


    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Public API


    /**
     * Mounts the screen into the provided container element.
     *
     * Lifecycle order:
     * 1. build()
     * 2. subscribe()
     * 3. append to DOM
     * 4. onEnter()
     *
     * @param container - The parent element where this screen will be appended
     */
    enter (container: HTMLElement): void {
        if (this.is_mounted) return
        this.is_mounted = true

        this.build()
        this.subscribe()

        container.appendChild(this.root)

        this.onEnter?.()
    }

    /**
     * Unmounts the screen from the DOM and cleans up all side effects.
     *
     * Lifecycle order:
     * 1. cleanup() (removes all tracked listeners/subscriptions)
     * 2. onExit()
     * 3. destroy()
     * 4. remove root element
     */
    exit (): void {
        if (!this.is_mounted) return            // check 
        this.is_mounted = false

        this.cleanup()
        this.onExit?.()
        this.destroy?.()

        this.root.remove()
    }

    /**
     * Returns the root DOM element representing this screen.
     */
    get element(): HTMLElement {
        return this.root
    }
    

    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Helpers


    /**
     * Registers a cleanup callback.
     *
     * All side effects (event listeners, subscriptions, timers, etc.)
     * should be registered through this method to ensure they are
     * automatically cleaned up on `.exit()`.
     *
     * @param cleanup - Function that undoes a side effect
     */
    protected track (cleanup: () => void): void {
        this.subscriptions.push(cleanup)
    }

    /**
     * Adds a DOM event listener and automatically tracks its removal.
     *
     * @param element - Target element
     * @param event - Event name (e.g., "click")
     * @param handler - Event handler function
     */
    protected listen (
        element: HTMLElement,
        event: string,
        handler: EventListenerOrEventListenerObject
    ): void {
        element.addEventListener(event, handler)
        const cleanup = () => {element.removeEventListener(event, handler)}
        this.track(cleanup)
    }

    /**
     * Adds a delegated DOM event listener with automatic cleanup.
     *
     * Instead of attaching listeners to many child elements, this attaches a
     * single listener to a parent (`root`) and resolves events dynamically
     * using `Element.closest()`.
     *
     * This is ideal for:
     * - Dynamic content (elements added/removed after render)
     * - Lists, menus, and repeated components
     * - Reducing the number of active listeners
     *
     * Behavior:
     * - Only triggers when the event target (or one of its ancestors)
     *   matches the provided `selector`
     * - Ignores matches that are outside the given `root`
     * - Passes the matched element (NOT the raw event target) to the handler
     *
     * The listener is automatically removed on `exit()` via `track()`.
     *
     * @param root - Parent element that receives the listener
     * @param selector - CSS selector used to match descendants
     * @param event - DOM event type (e.g. "click", "input")
     * @param handler - Callback invoked with the matched element and event
     *
     * @example Button clicks (common UI pattern)
     * ```ts
     * this.delegate(this.root, "[data-action]", "click", (element) => {
     *     const action = element.getAttribute("data-action")
     *
     *     if (action === "start") {
     *         this.bus.broadcast(UIEvents.game_start)
     *     }
     *
     *     if (action === "settings") {
     *         this.bus.broadcast(UIEvents.open_settings)
     *     }
     * })
     * ```
     *
     * @example Event bus bridge (UI → system events)
     * ```ts
     * this.delegate(this.root, ".inventory-item", "click", (element) => {
     *     const id = element.getAttribute("data-id")
     *
     *     this.bus.broadcast(GameEvents.item_selected, { id })
     * })
     * ```
     *
     * @example Dynamic lists (no re-binding needed)
     * ```ts
     * this.delegate(this.list, "li", "click", (element) => {
     *     console.log("Clicked item:", element.textContent)
     * })
     *
     * // Works even if <li> elements are added later
     * ```
     */
    protected delegate (
        root: HTMLElement,
        selector: string,
        event: string,
        handler: (element: Element, event: Event) => void
    ): void {
        // Linstener Constructor
        const listener = (event: Event): void => {

            const target = event.target as Element | null

            if (!target) return

            const element = target.closest(selector)

            if (!element ||
                !root.contains(element)
            ) return

            handler(element, event)
        }

        root.addEventListener(event, listener)
        this.track(() => {root.removeEventListener(event, listener)})
    }

    /**
     * Cleans up all tracked side effects.
     *
     * Invokes every registered cleanup callback and clears the list.
     * Called automatically during `exit()`.
     */
    protected cleanup (): void {
        this.subscriptions.forEach(unsubscribe => unsubscribe())
        this.subscriptions = []
    }
    

    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Lifecycle


    /**
     * Defines all side-effect subscriptions for the screen.
     *
     * This method is responsible for wiring up:
     * - DOM event listeners (via `listen()`)
     * - External subscriptions (event bus, timers, etc.) via `track()`
     *
     * All side effects MUST be registered through `listen()` or `track()`
     * to ensure automatic cleanup during `exit()`.
     * - Do NOT call `addEventListener` directly
     * - Do NOT create subscriptions without tracking their cleanup
     * 
     * This method is called during `enter()`.
     * 
     * Examples:
     *
     * ```ts
     * // DOM event (automatically tracked)
     * this.listen(this.button, "click", () => {
     *     this.bus.broadcast(UIEvents.game_start)
     * })
     *
     * // Event bus subscription
     * this.track(
     *     this.bus.on(UIEvents.some_event, (payload) => {
     *         console.log(payload)
     *     })
     * )
     *
     * // Timer example
     * const id = setInterval(() => {
     *     console.log("tick")
     * }, 1000)
     *
     * this.track(() => clearInterval(id))
     * ```
     */
    protected abstract subscribe (): void

    /**
     * Builds and initializes the DOM structure for the screen.
     *
     * Implementations should create and append elements to `this.root`.
     *
     * Called during `enter()`.
     */
    protected abstract build (): void

    /**
     * Optional final cleanup hook.
     *
     * Use this for non-tracked cleanup (e.g., nullifying references,
     * heavy resource disposal).
     *
     * Called during `exit()` AFTER `cleanup()`.
     */
    protected destroy? (): void

    /**
     * Optional hook invoked after the screen is mounted.
     */
    protected onEnter? (): void

    /**
     * Optional hook invoked before the screen is removed.
     */
    protected onExit? (): void


    // #endregion
}
