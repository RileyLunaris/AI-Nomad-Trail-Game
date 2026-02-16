import type { Formatter } from "../../../../game/types/formatter";
import { percent } from "../../../../utils";
import PlayerStatComponent from "./player-stat";

const defaultFormatter = (value: number): string => String(value);

export default class PLayerStatBarComponent extends PlayerStatComponent {
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

/**
    /* player health card 
    const player_stat_health_card = Object.assign(
        document.createElement('div'), {
            className: "bg-gray-100 p-4 rounded-lg shadow-inner", 
    });
    const player_stat_health_label = Object.assign(
        document.createElement('p'), {
            id: "mental-label", 
            className: "text-sm text-gray-700 mb-1",
            textContent: "Mental Health: 100%",
    });
    const player_stat_health_bar = Object.assign(
        document.createElement('div'), {
            className: "stat-bar bg-gray-300",
    });
    const player_stat_health_bar_fill = Object.assign(
        document.createElement('div'), {
            id: "mental-fill",
            className: "stat-fill bg-yellow-500",
    });
    player_stat_health_bar.appendChild(player_stat_health_bar_fill);
    player_stat_health_card.replaceChildren(
        player_stat_health_label,
        player_stat_health_bar,
    );
 */