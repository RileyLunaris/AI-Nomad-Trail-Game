import { Component } from "../component";

export class OptionButtonComponent extends Component {
    constructor(
        text: string,
        button_action: CallableFunction,
    ) {
        super(document.createElement("button"))
        this.root.className = "w-full px-4 py-2 mb-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-md" 
        this.root.textContent = text,
        this.root.onclick = button_action()
    }
    set_value() {}
    clear() {}
}
export class OptionComponent extends Component {
    constructor() {
        super()
    }
    set_value () {}
    clear () {}
}