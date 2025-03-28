export class View {
    #initialized = false;

    _element = null;
    _parent = null;
    _children = [];

    constructor(element) {
        this._element = element;
    }

    initialize() {
        if (this.#initialized)
            return;

        this._initializeChildViews();
        this._setupEventListeners();

        this.#initialized = true;

        return this;
    }

    _initializeChildViews() {
        // Override this method in subclasses
    }

    _setupEventListeners() {
        // Override this method in subclasses
    }

    appendChild(child) {
        if (!(child instanceof View)) {
            throw new Error("Child must be an instance of View.");
        }

        this._element.appendChild(child._element);
        this._children.push(child);
        child._parent = this;
    }

    appendToParent(parent) {
        if (!(parent instanceof View)) {
            throw new Error("Parent must be an instance of View.");
        }

        parent.appendChild(this);
    }

    removeChild(child) {
        if (!(child instanceof View)) {
            throw new Error("Child must be an instance of View.");
        }

        if (!this._children.includes(child)) {
            throw new Error("Child is not a child of this view.");
        }

        this._element.removeChild(child._element);
        this._children = this._children.filter(c => c !== child);
        child._parent = null;
    }

    removeFromParent() {
        if (this._parent) {
            this._parent.removeChild(this);
        }
    }
}
