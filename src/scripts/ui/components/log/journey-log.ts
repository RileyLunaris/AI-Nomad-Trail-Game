import { Component } from "../component";

export class JourneyLogView extends Component {
    header: HTMLHeadingElement;
    output: HTMLDivElement;

    constructor(
        log_id: string,     // delete later after refactor
        output_id: string,  // delete later after refactor
    ) {
        super(document.createElement("div"));
        this.root.id = log_id; // "log-container";
        this.root.className = "mt-8 pt-4 border-t"

        // Components
        this.header = Object.assign(document.createElement("h4"), {
            className: "text-lg font-semibold text-gray-800 mb-2",
            textContent: "Journey Log",
        })
        this.output = Object.assign(document.createElement("div"), {
            id: output_id, // "log-area", 
            className: "h-32 overflow-y-scroll bg-gray-50 p-3 rounded border",
        })

        // Build Dom
        this.root.replaceChildren(
            this.header,
            this.output,
        )
    }

    public set_label(label:string) {
        this.header.textContent = label;
    }

    public set_value(event:string) {
        this.output.prepend(event);
    }

    public clear() {
        this.output.innerHTML = "";
    }
}
