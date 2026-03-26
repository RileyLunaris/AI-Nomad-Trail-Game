
// ═══════════════════════════════════════════════════════════════════════════
//                              Class Selection Screen
// ═══════════════════════════════════════════════════════════════════════════

import { GameEvents, UserEvents } from "@/events"
import { Screen } from "."
import type { Profession } from "@/scripts/game/types"


/** Profession Selection Menu Screen. */
export class ClassSelectionScreen extends Screen {
    // #region Initialization

    
    protected title = document.createElement("h3")
    protected description = document.createElement("p")
    protected hint = document.createElement("p")

    protected info_panel = document.createElement("div")
    protected options_panel = document.createElement("div")
    protected options?: Profession[]


    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Helpers


    private displayOptions = (class_options: Profession[]) => {
        // Clear any previous options.
        this.options_panel.innerHTML = ""

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
                image.classList.add(class_info.id)
                button.classList.add(class_info.id)

                // Values
                name.textContent = class_info.name
                description.textContent = class_info.description
                button.textContent = `Apply for: ${class_info.name}`
                
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
                this.options_panel.appendChild(card)
            }
        )
    }

    private build_info_panel () {
        // Classes
        this.info_panel.classList.add("class-menu")
        
        // Values
        this.title.textContent = "Welcome to the AI Nomad Trail!"
        this.description.textContent = "Select you dream career to begin your life as a digital nomad."
        this.hint.textContent = "Each field has it's own perks and pitfalls that may help or hinder you."
        
        // DOM
        this.info_panel.replaceChildren(
            this.title,
            this.description,
            this.hint,
        )
    }

    private selectClass = (button: Element) => {
        const class_id = button.classList[0]
        this.bus.broadcast(UserEvents.chose_class, class_id)
    }


    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Lifecycle
    

    protected subscribe(): void {
        this.track(
            this.bus.subscribe(GameEvents.unemployed, this.displayOptions)
        )
        this.delegate(
            this.options_panel, 
            "button",
            "click",
            this.selectClass
        )
    }

    protected build(): void {
        this.build_info_panel()
        this.root.classList.add("profession-screen")
        this.root.replaceChildren(
            this.info_panel,
            this.options_panel,
        )
    }
    
    
    // #endregion
}
