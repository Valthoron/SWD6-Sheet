class StatRow extends View {
    constructor(templateElement) {
        super(templateElement.cloneNode(true));
        this.nameElement = this.element.querySelector('.stat-row__name');
        this.valueElement = this.element.querySelector('.stat-row__value');
        this.modifierRows = {};
    }

    setId(id) {
        this.element.id = id;
    }

    setName(name) {
        this.nameElement.textContent = name;
    }

    addModifierRow(name, templateElement, statName) {
        const row = new StatModifierRow(templateElement);
        row.setName(name);
        row.setStatName(statName);
        this.appendChild(row);
        this.modifierRows[name] = row;

        return row;
    }

    updateValue(diceString) {
        this.valueElement.textContent = diceString;
    }
}

class SkillRow extends StatRow {
    constructor(templateElement) {
        super(templateElement);
        this.nameElement.classList.add('stat-row-name--skill');
    }
}

class SpecRow extends StatRow {
    constructor(templateElement) {
        super(templateElement);
        this.nameElement.classList.add('stat-row-name--spec');
    }
}
