import { Templates } from '../utils/Templates.js';
import { View } from './View.js';

export class StatModifierRow extends View {
    _nameElement = null;
    _valueElement = null;
    _decreaseButton = null;
    _increaseButton = null;

    onChange = null;

    constructor() {
        super(Templates.getInstance().get('statModifierRow').cloneNode(true));

        this._nameElement = this._element.querySelector('.stat-modifier-row__name');
        this._valueElement = this._element.querySelector('.stat-modifier-row__value');

        const buttons = this._element.querySelectorAll('.stat-modifier-row__button');
        this._decreaseButton = buttons[0];
        this._increaseButton = buttons[1];
    }

    _setupEventListeners() {
        this._decreaseButton.addEventListener('click', () => this.#change(-1));
        this._increaseButton.addEventListener('click', () => this.#change(1));
    }

    setName(name) {
        this._nameElement.textContent = name;
    }

    setValue(value) {
        this._valueElement.textContent = value;
    }

    setDisplayMode(displayMode) {
        this._element.classList.add(`stat-modifier-row--${displayMode}`);
    }

    #change(delta) {
        if (this.onChange)
            this.onChange(this._nameElement.textContent, delta);
    };
}
