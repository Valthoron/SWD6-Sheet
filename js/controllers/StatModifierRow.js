import { pipsToDice } from "../utils/Formatters.js";
import { Templates } from "../utils/Templates.js";
import { View } from "./View.js";

export class StatModifierRow extends View {
    _nameLabel = null;
    _valueLabel = null;
    _decreaseButton = null;
    _increaseButton = null;

    onChange = null;

    constructor() {
        const [element, childMap] = Templates.getInstance().getWithChildMap("statModifierRow");
        super(element);

        this._nameLabel = childMap.get("stat-modifier-row-name-label");
        this._valueLabel = childMap.get("stat-modifier-row-value-label");

        this._decreaseButton = childMap.get("stat-modifier-row-decrement-button");
        this._increaseButton = childMap.get("stat-modifier-row-increment-button");
    }

    initialize({ name, displayMode }) {
        super.initialize();

        this._nameLabel.textContent = name;
        this._element.classList.add(`stat-modifier-row--${displayMode}`);

        return this;
    }

    _setupEventListeners() {
        this._decreaseButton.addEventListener("click", () => this._change(-1));
        this._increaseButton.addEventListener("click", () => this._change(1));
    }

    setValue(value) {
        this._valueLabel.textContent = pipsToDice(value);
    }

    _change(delta) {
        this.onChange?.(this._nameLabel.textContent, delta);
    };
}
