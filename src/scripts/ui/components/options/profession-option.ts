import type { Profession, Stats } from "../../../game/types";
import { Component } from "../component"

const DIVIDER = Object.assign(document.createElement("span"), {textContent: " | "});

class ProfessionStatComponent {
    text: HTMLElement;
    prefix: string;
    value: HTMLElement;
    suffix: string;
    constructor (
        text: string,
        value: number,
        prefix?: string,
        suffix?: string,
    ) {
        this.prefix = prefix ? prefix : "";
        this.suffix = suffix ? suffix : "";
        this.text = Object.assign(document.createElement("span"), {textContent: text});
        this.value = Object.assign(document.createElement("span"), {textContent: `${prefix}${value}${suffix}`});
    }
}

export class ProfessionCardStatsComponent extends Component {
    cash: ProfessionStatComponent;
    equipment: ProfessionStatComponent;
    health: ProfessionStatComponent;

    constructor (stats: Stats) {
        super(document.createElement("p"));
        this.cash = new ProfessionStatComponent(
            "Cash: ",
            stats.cash ? stats.cash : 0,
            "$",
            "",
        );
        this.equipment = new ProfessionStatComponent(
            "Laptop: ", 
            stats.equipment ? stats.equipment : 0,
            "",
            "%",
        );
        this.health = new ProfessionStatComponent(
            "Mental: ",
            stats.health ? stats.health : 0,
            "",
            "%",
        );

        this.root.className = "text-sm text-gray-500";
        this.cash.value.className = "text-green-600 font-semibold"
        
        const statList = [
            this.cash.text,
            this.cash.value,
            DIVIDER,
            this.equipment.text,
            this.equipment.value,
            DIVIDER,
            this.health.text,
            this.health.value,
        ]
        statList.forEach(
            (stat) => {this.root.appendChild(stat.cloneNode(true))}
        )
    }   
    set_value () {}
    clear () {}
}

export class ProfessionCardComponent extends Component {
    title: HTMLElement;
    description: HTMLElement;
    stats: ProfessionCardStatsComponent;
    button: ProfessionSelectionButton;

    constructor (
        profession: Profession,
        action: CallableFunction,
    ) {
        super();
        this.root.className = "p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow";
        this.title = Object.assign(document.createElement("h4"), {
            className: "font-bold text-indigo-700", 
            textContent: profession.name,
        });
        this.description = Object.assign(document.createElement("p"), {
            className: "text-sm text-gray-600 mb-2",
            textContent: profession.description,
        });
        this.stats = new ProfessionCardStatsComponent(profession.stats);
        this.button = new ProfessionSelectionButton(
            `Start as ${profession.name}`, action);
        this.root.replaceChildren(
            this.title,
            this.description,
            this.stats.element,
            this.button.element,
        )
    }
    set_value () {}
    clear () {}
}

export class ProfessionSelectionButton extends Component {
    constructor (
        text: string,
        action: CallableFunction,
    ) {
        super(document.createElement("button"))
        this.root.onclick = () => {
            action()
        }
        this.root.textContent = text
        this.root.className = "w-full mt-2 px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors shadow-lg"
    }
    set_value () {}
    clear () {}
}
