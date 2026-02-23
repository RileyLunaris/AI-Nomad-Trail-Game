import type { Formatter } from "../../../../game/types/formatter";
import { default_formatter, limit_value_between } from "../../../../utils";
import { Component } from "../component";

export class ProgressBar extends Component {
    protected value: HTMLElement;
    protected bar: HTMLElement;
    protected fill: HTMLElement;
    protected formatter: Formatter;

    constructor(
        value_id: string,   // delete later after refactor
        fill_id: string,    // delete later after refactor
        value_formatter: Formatter = default_formatter,
    ) {
        super(document.createElement("div"));

        // components
        this.value = Object.assign(document.createElement("div"), {
            id: value_id,
            className:"text-sm text-gray-500",
        });
        this.bar = Object.assign(document.createElement("div"), {
            className:"bg-gray-200 h-3 rounded-full mb-8",
        });
        this.fill = Object.assign(document.createElement("div"), {
            id: fill_id,
            className: "progress-bar h-full bg-indigo-500 rounded-full", 
            style: "width: 0%;",
        });
        this.formatter = value_formatter;
        
        // DOM Creation
        this.root.replaceChildren(
            this.value,
            this.bar,
        )
        this.bar.replaceChildren(
            this.fill,
        )
    }

    public set_value(value:number, target:number, units:string) {
        this.value.textContent = `${limit_value_between(value, target)} / ${target} ${units}`
        this.fill.style = `width: `
    }
}
