import type { Formatter } from "../../../../game/types/formatter";

const defaultFormatter = (value: number): string => String(value);

export class PlayerStatComponent {
    protected root: HTMLDivElement;
    protected label: HTMLDivElement;
    protected value: HTMLSpanElement;
    protected formatter: Formatter;
    

    constructor(
        label:string, 
        value_id: string,
        value_formatter:Formatter = defaultFormatter,
    ) {
        this.formatter = value_formatter;
        this.root = Object.assign(document.createElement("div"), {
            className: "player-stat"
        });
        this.label = Object.assign(document.createElement("div"), {
            className: "player-stat-label",
            textContent: `${label}: `, 
        });
        this.value = Object.assign(document.createElement("span"), {
            id: value_id,
            className: "player-stat-value text-green-600",
        });
        this.label.append(this.value);
        this.root.append(this.label);
    }

    
    public get() {
        return this.root;
    }
    public set_label(label:string) {
        this.label.textContent = `${label}: `
    }
    public set_value(
        value: number,
    ) {
        this.value.textContent = this.formatter(value);
    }
    public clear() {
        this.label.textContent = ""
        this.value.textContent = ""
    }
}
