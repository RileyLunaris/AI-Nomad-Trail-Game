import { Component } from "../component";

export class ScenarioView extends Component {
    title: HTMLElement;
    description: HTMLElement;
    hint: HTMLElement;

    constructor(
        scenario_id: string,
        title_id: string,
        description_id: string,
        hint_id: string,
    ) {
        super(document.createElement("div"));
        this.root.id = scenario_id; // "scenario-display";
        this.root.className = "bg-indigo-50 p-6 rounded-lg shadow-inner mb-6";

        // Components
        this.title = Object.assign(document.createElement("h3"), {
            id: title_id, // "scenario-title", 
            className: "text-xl font-semibold text-indigo-800", 
            textContent: "Choose Your Path", 
        });
        this.description = Object.assign(document.createElement("p"), {
            id: description_id, // "scenario-description", 
            className: "text-gray-700 mt-2", 
            textContext: "Select your digital nomad profession to begin your journey."
        });
        this.hint = Object.assign(document.createElement("p"), {
            id: hint_id, // "scenario-hit", 
            className: "text-gray-700 mt-2", 
        });

        // Build DOM
        this.root.replaceChildren(
            this.title,
            this.description,
            this.hint,
        );
    }

    public set_value(
        title?: string,
        description?: string,
        hint?: string,
    ) : void {
        this.title.textContent = title ? title : "";
        this.description.textContent = description ? description : "";
        this.hint.textContent = hint ? hint : "";
    }

    public clear() {
        this.title.textContent = "";
        this.description.textContent = "";
        this.hint.textContent = "";
    }
}
