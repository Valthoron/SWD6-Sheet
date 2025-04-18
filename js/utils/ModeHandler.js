export class ModeHandler {
    #storageKey = "swd6-sheet-mode";
    #currentMode = "";

    constructor() {
        this.buttons = {
            "view": document.getElementById("nav-mode-view"),
            "edit": document.getElementById("nav-mode-edit"),
        };

        this.buttons["view"].addEventListener("click", () => this.switchMode("view"));
        this.buttons["edit"].addEventListener("click", () => this.switchMode("edit"));
    }

    initialize() {
        const savedMode = localStorage.getItem(this.#storageKey) || "view";
        this.switchMode(savedMode);
        return this;
    }

    switchMode(mode) {
        if (this.#currentMode === mode) return;

        this.buttons[this.#currentMode]?.classList.remove("navbar__button--active");
        this.buttons[mode].classList.add("navbar__button--active");

        this.#currentMode = mode;
        document.body.setAttribute("mode", mode);

        localStorage.setItem(this.#storageKey, mode);
    }
}
