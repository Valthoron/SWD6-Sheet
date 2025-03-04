class StatModifierRow extends View {
    constructor(templateElement) {
        super(templateElement.cloneNode(true));
        this.nameElement = this.element.querySelector('.stat-modifier-row__name');
        this.valueElement = this.element.querySelector('.stat-modifier-row__value');

        const buttons = this.element.querySelectorAll('.stat-modifier-row__button');
        this.decreaseButton = buttons[0];
        this.increaseButton = buttons[1];

        this.statName = null;
        this.modifierType = null;
    }

    setName(name) {
        this.nameElement.textContent = name;
        this.modifierType = name;
    }

    setStatName(statName) {
        this.statName = statName;
    }

    setValue(pips) {
        this.valueElement.textContent = pipsToDice(pips);
    }

    setupEventListeners(character) {
        this.character = character;
        this.decreaseButton.addEventListener('click', () => this.handleModifierChange(-1));
        this.increaseButton.addEventListener('click', () => this.handleModifierChange(1));
    }

    handleModifierChange(changeAmount) {
        this.character.modifyStatModifier(this.statName, this.modifierType, changeAmount);
        const stat = this.character.getStat(this.statName);
        this.setValue(stat[this.modifierType]);
        updateAffectedStats(this.character, this.statName);
    };
}
