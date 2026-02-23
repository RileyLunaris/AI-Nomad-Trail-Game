export abstract class Component {
    protected root: HTMLElement;
    
    constructor(root:HTMLElement) {
        this.root = root;
    }
    
    public element(): HTMLElement {
        return this.root;
    }

    public set_value(...args: any[]): void {}

    public clear() {}

    public remove() {
        this.root.innerHTML = "";
    }
}
