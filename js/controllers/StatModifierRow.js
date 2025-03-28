import { pipsToDice } from '../utils/Formatters.js';
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

    initialize({ name, displayMode }) {
        super.initialize();

        this._nameElement.textContent = name;
        this._element.classList.add(`stat-modifier-row--${displayMode}`);

        return this;
    }

    setValue(value) {
        this._valueElement.textContent = pipsToDice(value);
    }

    _setupEventListeners() {
        this._decreaseButton.addEventListener('click', () => this._change(-1));
        this._increaseButton.addEventListener('click', () => this._change(1));
    }

    _change(delta) {
        this.onChange?.(this._nameElement.textContent, delta);
    };
}
