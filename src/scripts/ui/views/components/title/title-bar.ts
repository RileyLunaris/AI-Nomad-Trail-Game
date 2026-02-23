import { Component } from "../component";

export class TitleBar extends Component{
    constructor(title?:string|null) {
        super(document.createElement("div"));
        this.root.className = "title-bar"
        this.root.textContent = title ?? "";
    }

    public set_value(title:string) {
        this.root.textContent = title;
    }

    public clear() {
        this.root.textContent = "";
    }
}
