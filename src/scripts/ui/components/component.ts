export abstract class Component {
    protected root: HTMLElement;

    constructor(root?:HTMLElement) {
        this.root = root ? root : document.createElement("div");
        this.root.style.display = "block";
    }

    public remove() {
        this.root.remove();
    }
    public hide() {this.root.style.display = "none";}
    public show() {this.root.style.display = "";}
    public get element(): HTMLElement {
        return this.root;
    }

    // Methods to overwrite per component type
    public abstract set_value(...args: any[]): void;
    public abstract clear(): void;
}
