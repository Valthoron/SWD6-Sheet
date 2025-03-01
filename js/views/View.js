class View {
    constructor(element) {
        this.element = element;
    }

    appendChild(child) {
        this.element.appendChild(child.element);
    }
}
