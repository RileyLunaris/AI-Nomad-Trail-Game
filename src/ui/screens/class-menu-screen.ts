
// ═══════════════════════════════════════════════════════════════════════════
//                          Screen : Class Selection
// ═══════════════════════════════════════════════════════════════════════════

import { PlayerEvents, UserEvents } from "@/events"
import { Screen } from "."
import type { Profession } from "@/scripts/game/types"
import "@/styles/screens/class-selection.scss"


/** Profession Selection Menu Screen. */
export class ClassSelectionScreen extends Screen {
    // #region Initialization

    
    protected title = document.createElement("h3")
    protected description = document.createElement("p")
    protected hint = document.createElement("p")

    protected info_panel = document.createElement("div")
    protected options_panel = document.createElement("div")
    protected options?: Profession[]

    protected go_back = document.createElement("button")

    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Helpers


    private displayOptions = (
        class_options: Profession[], 
        rejected?: Profession[]
    ) => {
        // Clear any previous options.z3
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
                card.classList.add("class-card", class_info.id)
                info.classList.add("card-info")
                button.classList.add(class_info.id, "hidden")

                // Values
                name.textContent = class_info.name
                description.textContent = class_info.description
                button.textContent = "Apply"
                
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

    private open_job_listing = (card: Element) => {
        this.options_panel.querySelectorAll("button")?.forEach(
            (button) => {button.classList.add("hidden")}
        )
        card.querySelector("button")?.classList.remove("hidden")
    }
    private select_class = (button: Element) => {
        this.bus.broadcast(UserEvents.chose_class, button.classList[0])
    }

    private return_to_home_screen = () => {
        this.bus.broadcast(UserEvents.went_back)
    }


    // #endregion
    // ───────────────────────────────────────────────────────────────────────
    // #region Lifecycle
    

    protected subscribe(): void {
        this.track(
            this.bus.subscribe(PlayerEvents.unemployed, this.displayOptions)
        )
        this.delegate(
            this.options_panel, 
            "button",
            "click",
            this.select_class
        )
        this.delegate(
            this.options_panel,
            ".class-card",
            "click",
            this.open_job_listing
        )
        this.listen(
            this.go_back,
            "click",
            this.return_to_home_screen
        )
    }

    protected build(): void {
        this.build_info_panel()
        this.root.classList.add("profession-screen")
        this.root.replaceChildren(
            this.info_panel,
            this.options_panel,
            this.go_back,
        )

        this.go_back.textContent = "<- Back"
    }
    
    
    // #endregion
}
