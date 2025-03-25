import { Templates } from '../utils/Templates.js';
import { StatModifierRow } from './StatModifierRow.js';
import { View } from './View.js';

export class StatRow extends View {
    _nameElement = null;
    _valueElement = null;
    _modifierRows = {};

    onModifierChange = null;

    constructor() {
        super(Templates.getInstance().get('statRow').cloneNode(true));

        this._nameElement = this._element.querySelector('.stat-row__name');
        this._valueElement = this._element.querySelector('.stat-row__value');
    }

    _initializeChildViews() {
        this._createModifierRow("Species", "create");
        this._createModifierRow("Character", "create");
        this._createModifierRow("Misc", "create");
        this._createModifierRow("Improvement", "advance");

        Object.values(this._modifierRows).forEach(row => {
            row.onChange = (modifierName, delta) => this.#modifierChange(modifierName, delta);
        });
    }

    _createModifierRow(modifierName, displayMode) {
        const row = new StatModifierRow().initialize();
        row.setName(modifierName);
        row.setDisplayMode(displayMode);
        this.appendChild(row);
        this._modifierRows[modifierName] = row;
    }

    setName(name) {
        this._nameElement.textContent = name;
    }

    setValue(value) {
        this._valueElement.textContent = value;
    }

    setModifierValue(modifierName, value) {
        this._modifierRows[modifierName].setValue(value);
    }

    #modifierChange(modifierName, delta) {
        if (this.onModifierChange)
            this.onModifierChange(this._nameElement.textContent, modifierName, delta);
    }
}

export class SkillRow extends StatRow {
    constructor() {
        super();
        this._nameElement.classList.add('stat-row__name--skill');
    }
}

export class SpecRow extends StatRow {
    constructor() {
        super();
        this._nameElement.classList.add('stat-row__name--spec');
    }
}
