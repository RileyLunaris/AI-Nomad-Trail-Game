import type { Formatter } from "../../../../game/types/formatter";
import { percent } from "../../../../utils";
import { PlayerStatComponent } from "./player-stat";


const defaultFormatter = (value: number): string => String(value);

export class PLayerStatBarComponent extends PlayerStatComponent {
    protected bar: HTMLDivElement;
    protected fill: HTMLDivElement;

    constructor(
        label:string,
        value_id: string,
        fill_id: string,
        fill_color: string,
        formatter:Formatter = defaultFormatter,
    ) {
        super(
            label,
            value_id
        );
        this.value.className = "player-stat-value"
        this.bar = Object.assign(document.createElement("div"), {
            className: "stat-bar bg-gray-300",
        })
        this.fill = Object.assign(document.createElement("div"), {
            id: fill_id,
            className: "player-stat-bar-fill",
            style: `background-color: ${fill_color}`,
        })
        this.bar.appendChild(this.fill);
        this.root.appendChild(this.bar);
    }
    public set_value(value: number): void {
        this.value.textContent = this.formatter(value)
        this.fill.style = `width: ${percent(value)}`;
    }
    public clear(): void {
        
    }
}
