import { Templates } from '../utils/Templates.js';
import { View } from './View.js';

export class StatModifierRow extends View {
    _nameElement = null;
    _valueElement = null;
    _decreaseButton = null;
    _increaseButton = null;

    constructor() {
        super(Templates.getInstance().get('statModifierRow').cloneNode(true));

        this._nameElement = this._element.querySelector('.stat-modifier-row__name');
        this._valueElement = this._element.querySelector('.stat-modifier-row__value');

        const buttons = this._element.querySelectorAll('.stat-modifier-row__button');
        this._decreaseButton = buttons[0];
        this._increaseButton = buttons[1];
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

    setupEventListeners(character) {
        //this.character = character;
        //this.decreaseButton.addEventListener('click', () => this.handleModifierChange(-1));
        //this.increaseButton.addEventListener('click', () => this.handleModifierChange(1));
    }

    handleModifierChange(changeAmount) {
        //this.character.modifyStatModifier(this.statName, this.modifierType, changeAmount);
        //const stat = this.character.getStat(this.statName);
        //this.setValue(stat[this.modifierType]);
        //updateAffectedStats(this.character, this.statName);
    };
}
