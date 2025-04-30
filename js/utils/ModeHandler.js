export class ModeHandler {
    #storageKey = "swd6-sheet-mode";
    #currentMode = "";
    #buttons = null;

    constructor() {
        this.#buttons = {
            "view": document.getElementById("nav-mode-view"),
            "advance": document.getElementById("nav-mode-advance"),
            "create": document.getElementById("nav-mode-create"),
        };

        Object.entries(this.#buttons).forEach(([name, button]) => {
            button.addEventListener("click", () => this.switchMode(name));
        });
    }

    initialize() {
        let savedMode = localStorage.getItem(this.#storageKey);

        if (!Object.keys(this.#buttons).includes(savedMode))
            savedMode = Object.keys(this.#buttons)[0];

        this.switchMode(savedMode);
        return this;
    }

    switchMode(mode) {
        if (this.#currentMode === mode) return;

        this.#buttons[this.#currentMode]?.classList.remove("navbar__button--active");
        this.#buttons[mode]?.classList.add("navbar__button--active");

        this.#currentMode = mode;
        document.body.setAttribute("mode", mode);

        localStorage.setItem(this.#storageKey, mode);
    }
}
