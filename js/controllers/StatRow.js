import { pipsToDice } from '../utils/Formatters.js';
import { Templates } from '../utils/Templates.js';
import { StatModifierRow } from './StatModifierRow.js';
import { View } from './View.js';

export class StatRow extends View {
    _stat = null;

    _nameElement = null;
    _valueElement = null;

    _modifierRows = {};

    onChange = null;

    constructor() {
        super(Templates.getInstance().get('statRow').cloneNode(true));

        this._nameElement = this._element.querySelector('.stat-row__name');
        this._valueElement = this._element.querySelector('.stat-row__value');
    }

    initialize(stat) {
        super.initialize();

        this._stat = stat;

        this._nameElement.textContent = stat.Name;

        return this;
    }

    refresh() {
        if (this._stat.TotalWithBonus != this._stat.Total)
            this._valueElement.textContent = "(" + pipsToDice(this._stat.Total) + ") " + pipsToDice(this._stat.TotalWithBonus);
        else
            this._valueElement.textContent = pipsToDice(this._stat.Total);

        Object.entries(this._modifierRows).forEach(([modifierName, row]) => {
            row.setValue(this._stat[modifierName]);
        });
    }

    _initializeChildViews() {
        this._createModifierRow("Starting", "create");
        this._createModifierRow("Improvement", "advance");
        this._createModifierRow("Bonus", "create");
    }

    _createModifierRow(modifierName, displayMode) {
        const row = new StatModifierRow().initialize({ name: modifierName, displayMode: displayMode });
        row.onChange = (modifier, delta) => this._modifierChange(modifier, delta);
        this.appendChild(row);
        this._modifierRows[modifierName] = row;
    }

    _modifierChange(modifier, delta) {
        this.onChange?.(modifier, delta);
    }
}

export class AttributeRow extends StatRow {
    _initializeChildViews() {
        this._createModifierRow("Species", "create");

        super._initializeChildViews();
    }
}

export class SkillRow extends StatRow {
    constructor() {
        super();
        this._nameElement.classList.add('stat-row__name--skill');
    }

    _initializeChildViews() {
        super._initializeChildViews();
    }
}

export class SpecRow extends StatRow {
    constructor() {
        super();
        this._nameElement.classList.add('stat-row__name--spec');
    }

    _initializeChildViews() {
        super._initializeChildViews();
    }
}
