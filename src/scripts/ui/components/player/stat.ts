import type { Formatter } from "../../../game/types/formatter";
import { default_formatter } from "../../../utils";
import { Component } from "../component";

export class Stat extends Component {
    protected label: HTMLDivElement;
    protected value: HTMLSpanElement;
    protected formatter: Formatter;
    

    constructor(
        label:string, 
        value_id: string,   // delete later after refactor
        value_formatter:Formatter = default_formatter,
    ) {
        super(document.createElement("div"));
        this.root.className = "player-stat";
        this.formatter = value_formatter;

        // Components
        this.label = Object.assign(document.createElement("div"), {
            className: "player-stat-label",
            textContent: `${label}: `, 
        });
        this.value = Object.assign(document.createElement("span"), {
            id: value_id,
            className: "player-stat-value text-green-600",
        });

        // Build DOM
        this.label.append(this.value);
        this.root.append(this.label);
    }

    public set_label(label:string) {
        this.label.textContent = `${label}: `
    }

    public set_value(value: number) {
        this.value.textContent = this.formatter(value);
    }
    
    public clear() {
        this.label.textContent = ""
        this.value.textContent = ""
    }
}
