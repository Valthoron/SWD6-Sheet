class StatModifierRow extends View {
    constructor(templateElement) {
        super(templateElement.cloneNode(true));
        this.nameElement = this.element.querySelector('.stat-modifier-row-name');
        this.valueElement = this.element.querySelector('.stat-modifier-row-value');

        const buttons = this.element.querySelectorAll('.stat-modifier-row-button');
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
        this.decreaseButton.addEventListener('click', () => {
            character.modifyStatModifier(this.statName, this.modifierType, -1);

            // Get the updated modifier value
            const stat = character.getStat(this.statName);

            // Update just this modifier display
            this.setValue(stat[this.modifierType]);

            // Update this stat's total value and any dependent stats
            updateAffectedStats(character, this.statName);
        });

        this.increaseButton.addEventListener('click', () => {
            character.modifyStatModifier(this.statName, this.modifierType, 1);

            // Get the updated modifier value
            const stat = character.getStat(this.statName);

            // Update just this modifier display
            this.setValue(stat[this.modifierType]);

            // Update this stat's total value and any dependent stats
            updateAffectedStats(character, this.statName);
        });
    }
}
