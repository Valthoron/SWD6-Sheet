export class View {
    #initialized = false;
    #containers = new Map();

    _element = null;
    _parent = null;
    _children = {};

    get Element() { return this._element; }
    get Parent() { return this._parent; }
    get Children() { return this._children; }

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
        // Override
    }

    _setupEventListeners() {
        // Override
    }

    _registerContainer(name, element) {
        if (!(element instanceof Element))
            throw new Error("Container must be a DOM element.");

        if (!this._element.contains(element))
            throw new Error("Container must be within this view's DOM tree.");

        this.#containers.set(name, element);
    }

    _appendChild(child, targetElement = null) {
        if (!(child instanceof View))
            throw new Error("Child must be an instance of View.");

        const target = targetElement || this._element;

        if (!this._element.contains(target))
            throw new Error("Target element must be within this view's DOM tree.");

        target.appendChild(child._element);
        this._children[child] = target;
        child._parent = this;
    }

    appendChild(child, containerName = "") {
        if (containerName === "") {
            this._appendChild(child);
            return;
        }

        if (!this.#containers.has(containerName))
            throw new Error(`Container "${containerName}" not found.`);

        this._appendChild(child, this.#containers.get(containerName));
    }

    removeChild(child) {
        if (!(child instanceof View))
            throw new Error("Child must be an instance of View.");

        if (!(child in this._children))
            throw new Error("Child is not a child of this view.");

        const parent = this._children[child];
        parent.removeChild(child._element);
        delete this._children[child];
        child._parent = null;
    }

    appendToParent(parent, containerName = "") {
        if (!(parent instanceof View))
            throw new Error("Parent must be an instance of View.");

        parent.appendChild(this, containerName);
    }

    removeFromParent() {
        if (!this._parent)
            throw new Error("This view has no parent.");

        this._parent.removeChild(this);
    }
}
