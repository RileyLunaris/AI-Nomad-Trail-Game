import type { Option } from "../../game/types";
import { Component } from "../components/component";

export class OptionsView extends Component {
    grid: HTMLElement;
    continue: HTMLButtonElement;
    constructor (
        panel_id: string,
        grid_id: string,
        continue_id: string,
    ) {
        super();
        this.root.id = panel_id;
        this.root.className = "space-y-4"
        this.grid = document.createElement("div")
        this.grid.id = grid_id;
        this.grid.className = "space-y-4"
        this.continue = document.createElement("button")
        this.continue.id = continue_id;
        this.continue.style = "background-color: #9ca3af; cursor: not-allowed; opacity: 0.7;";
        this.continue.className = "w-full px-4 py-3 mt-4 text-white font-bold rounded-lg";
        this.continue.textContent = "Continue Journey (Travel & Risk New Event)";

        this.root.replaceChildren(
            this.grid,
            this.continue,
        );
    }
    public set_value(options: Option[]): void {       
    }
    public clear(): void {
    }
}