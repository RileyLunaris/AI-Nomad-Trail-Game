import type { Formatter } from "../../../game/types/formatter";
import { default_formatter, fill_width, limit_value_between } from "../../../utils";
import { Stat } from "./stat";

export class StatBar extends Stat {
    protected bar: HTMLDivElement;
    protected fill: HTMLDivElement;

    constructor(
        label:string,
        value_id: string,   // delete later after refactor
        fill_id: string,    // delete later after refactor
        fill_color: string,     // Make Color Enum?
        formatter: Formatter = default_formatter,
    ) {
        super(
            label,
            value_id
        );
        this.formatter = formatter;
        
        // Components
        this.value.className = "player-stat-bar-value"
        this.bar = Object.assign(document.createElement("div"), {
            className: "stat-bar bg-gray-300",
        })
        this.fill = Object.assign(document.createElement("div"), {
            id: fill_id,
            className: "player-stat-bar-fill",
            style: `background-color: ${fill_color}`,
        })

        // DOM building
        this.bar.appendChild(this.fill);
        this.root.appendChild(this.bar);
    }

    public set_value(value: number): void {
        this.value.textContent = this.formatter(value)
        this.fill.style = fill_width(limit_value_between(value));
    }

    public clear() {
        this.label.textContent = "";
        this.value.textContent = "";
        this.fill.style = fill_width(0);
    }
}
