import { Component } from "../component";

export class Info extends Component{

    constructor(
        info_id: string, 
    ) {
        super(document.createElement("div"));
        this.root.id = info_id;
        this.root.className = "mb-6";
    }

    public set_value(value:string) {
        this.root.textContent = value;
    }

    public clear() {
        this.root.textContent = "";
    }
}
