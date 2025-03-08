class View {
    #initialized = false;

    _element = null;
    //_children = [];

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
        this._element.appendChild(child._element);
        //this._children.push(child);
    }
}
