class StatRow extends View {
    _nameElement = null;
    _valueElement = null;
    _modifierRows = {};

    constructor() {
        super(Templates.getInstance().get('statRow').cloneNode(true));

        this._nameElement = this._element.querySelector('.stat-row__name');
        this._valueElement = this._element.querySelector('.stat-row__value');
    }

    _initializeChildViews() {
        const modTypes = ["Species", "Character", "Misc"];
        modTypes.forEach(modType => {
            const modRow = this.addModifierRow(modType, modType);
            this.appendChild(modRow);
        });
    }

    setName(name) {
        this._nameElement.textContent = name;
    }

    setValue(value) {
        this._valueElement.textContent = value;
    }

    addModifierRow(name, statName) {
        const row = new StatModifierRow();

        row.setName(name);
        row.setStatName(statName);

        this.appendChild(row);
        this._modifierRows[name] = row;

        return row;
    }

}

class SkillRow extends StatRow {
    constructor() {
        super();
        this._nameElement.classList.add('stat-row__name--skill');
    }
}

class SpecRow extends StatRow {
    constructor() {
        super();
        this._nameElement.classList.add('stat-row__name--spec');
    }
}
