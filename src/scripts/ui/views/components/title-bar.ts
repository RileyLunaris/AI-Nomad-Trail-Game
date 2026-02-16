export default class TitleBar {
    private root: HTMLDivElement;

    constructor(
        title:string
    ) {
        this.root = Object.assign(document.createElement("div"), {
            className: "title-bar",
            textContent: title,
        });
    }

    get() {
        return this.root;
    }
    set_text(title:string) {
        this.root.textContent = title;
    }
}
