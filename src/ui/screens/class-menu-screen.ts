
// ═══════════════════════════════════════════════════════════════════════════
//                              Class Selection Screen
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents } from "@/events"
import { Screen } from "."
import type { Profession } from "@/scripts/game/types"


/**
 * Default Component class to be implemented.
 * 
 * @protected root - The root div element.
 * @method remove - Removes the container.
 * @property element - returns The root container.
 */
export abstract class Component {
    protected root: HTMLElement

    /**
     * Instantiating method.
     * @param root - Optional: HTML Element container.
     */
    constructor (root?: HTMLElement) {
        this.root = root ? root : document.createElement("div")
        this.root.classList.add("component")
    }

    /** Removes the component container. */
    remove () {
        this.root.remove()
    }

    /** The root element of the component. */
    get element (): HTMLElement {
        return this.root
    }
}



/** Container object for an individual profession. */
export class ProfessionCardComponent extends Component {
    // HTMLElements
    private title: HTMLElement = document.createElement("h3")
    private description: HTMLElement = document.createElement("p")
    private info: HTMLElement
    private button: HTMLButtonElement = document.createElement("button")

    private profession: Profession
    private subscriptions: Array<() => void> = []

    /**
     * Instantiating method for the Profession Card Component
     * @param profession - Profession class for the user to select.
     */
    constructor (
        profession: Profession
    ) {
        // Definitions
        super()
        this.root.classList.add("profession-card")
        this.root.onmouseenter = () => {this.onMouseEnter()}
        this.root.onmouseleave = () => {this.onMouseLeave()}

        // Value Assigning
        this.profession = profession
        this.title.textContent = profession.name
        this.description.textContent = profession.description
        this.info = cardStatInfoElement(profession.stats)
        this.button.textContent = `Start as ${profession.name}`

        this.subscribe()
        this.build()
    }
    
    //#region EventBus

    /** Subscribes default handlers to the event bus. */
    private subscribe() {
        this.subscriptions.push(
            bus.on(UIEvents.class_choice)
                .do(() => {this.remove()})
                .subscribe()
            )
    }

    /** Unsubscribes from the event bus */
    private unsubscribe() {
        this.subscriptions.forEach((unsubscribe) => {unsubscribe()})
    }

    //#endregion
    //#region DOM

    /** Builds the DOM Structure */
    private build () {
        this.root.replaceChildren(
            this.title,
            this.description,
            this.info,
        )

    }

    /** Adds the button to the DOM Object. */
    private addButton () {
        if (this.root.contains(this.button)) return
        this.addButtonListener()
        this.root.append(this.button)
    }

    /** Removes the button from the DOM object. */
    private removeButton () {
        if (!this.root.contains(this.button)) return
        this.removeButtonListner()
        this.root.removeChild(this.button)
    }

    //#endregion
    //#region Listeners

    /** Adds a Listener to the button. */
    private addButtonListener () {
        this.button.addEventListener("click", this.onConfirm, {once: true})
    }

    /** Removes the listener to the button. */
    private removeButtonListner () {
        this.button.removeEventListener("click", this.onConfirm)
    }

    //#endregion
    //#region Defined Handlers

    /** Runs when the profession card is selected. */
    private onMouseEnter= () => {
        console.log(`${this.constructor.name}: mouse-over @ ${this.profession.name}`)
        this.addButton()
    }

    /** 
     * Runs when the user clicks on something else. 
     * @param profession - Selected Card Profession Representation
     */
    private onMouseLeave = () => {
        console.log(`${this.constructor.name}: mouse-away @ ${this.profession.name}`)
        this.removeButton()
    }

    /** Runs when the the user confirms the selection. */
    private onConfirm = () => {
        console.log(`${this.constructor.name}: Confirm @ ${this.profession.name}`)
        bus.broadcast(UIEvents.class_choice, this.profession)
    }

    //#endregion

    /** Properly cleans and removes the objects */
    public remove () {
        console.log(`${this.constructor.name}: Remove @ ${this.profession.name}`)
        this.removeButton()
        this.unsubscribe()
        this.root.remove()
    }
}



/** Profession Selection Menu Screen. */
export class ClassSelectionScreen extends Screen {
    // ───────────────────────────────────────────────────────────────────────
    // #region Initialization
    // ───────────────────────────────────────────────────────────────────────
    
    protected info = document.createElement("div")
    protected options = document.createElement("div")
    protected title = document.createElement("h3")
    protected description = document.createElement("p")
    protected hint = document.createElement("p")

    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Helpers
    // ───────────────────────────────────────────────────────────────────────

    private displayOptions = (class_options: Profession[]) => {
        // Clear any previous options.
        this.options.innerHTML = ""

        class_options.forEach(
            (class_info: Profession) => {
                // Elements creation
                const card = document.createElement("div")
                const image = document.createElement("img")
                const info = document.createElement("div")
                const name = document.createElement("h3")
                const description = document.createElement("p")
                const button = document.createElement("button")

                // Class Assignments
                card.classList.add("class-card")
                image.classList.add("class-image", class_info.id)
                button.classList.add("class-button", class_info.id)

                // Values
                name.textContent = class_info.name
                description.textContent = class_info.description
                button.textContent = `Start as ${class_info.name}`
                
                // DOM
                info.replaceChildren(
                    name,
                    description,
                )
                card.replaceChildren(
                    image,
                    info,
                    button
                )

                // add each option.
                this.options.appendChild(card)
            }
        )
    }

    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Lifecycle
    // ───────────────────────────────────────────────────────────────────────
    
    protected subscribe(): void {
        // 
        this.track(
            this.bus.subscribe(GameEvents.get_player_class, this.displayOptions)
        )

        // Listeners


        // Trackers

    }

    protected build(): void {
        // Class
        this.root.classList.add("profession-screen")
        this.options.classList.add("options")
        this.info.classList.add("menu")

        // Set Values
        this.title.textContent = "Welcome to the AI Nomad Trail!"
        this.description.textContent = "Select your dream career to begin your journey as a digital nomad."
        this.hint.textContent = "Each profession has different abilities and stats that may help or hinder you."

        // DOM
        this.options.replaceChildren()
        professions.forEach(
            (profession) => {
                this.options.appendChild(
                    new ProfessionCardComponent(profession).element)
            }
        )

        this.info.replaceChildren(
            this.title,
            this.description,
            this.hint,
        )

        const title = Object.assign(document.createElement("div"), {textContent: " --- Profession Screen --- "})
        this.root.replaceChildren(
            title,
            this.info,
            this.options,
        )
    }
    
    // #endregion
}
