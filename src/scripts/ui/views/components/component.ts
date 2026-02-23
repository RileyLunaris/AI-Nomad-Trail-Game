export abstract class Component {
    protected root: HTMLElement;
    
    constructor(root:HTMLElement) {
        this.root = root;
    }
    
    element(): HTMLElement {
        return this.root;
    }

    set_value(...args: any[]): void {}

    clear() {
        this.root.innerHTML = "";
    }
}
