export default class TitleBar {
    private element: HTMLDivElement;

    constructor() {
        this.element = document.createElement("div");
        this.element.className = "title-bar";
        this.element.textContent = "The AI Nomad Trail"
    }
    render() {
        return this.element;
    }
    set_text(title:string) {
        this.element.textContent = title;
    }
}
