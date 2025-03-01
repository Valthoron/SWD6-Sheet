class View {
    constructor(element) {
        this.element = element;
    }

    appendChild(child) {
        this.element.appendChild(child.element);
    }
}

class StatRow extends View {
    constructor(templateElement) {
        super(templateElement.cloneNode(true));
        this.nameElement = this.element.querySelector('.stat-row-name');
        this.valueElement = this.element.querySelector('.stat-row-value');
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

class SkillRow extends StatRow {
    constructor(templateElement) {
        super(templateElement);
        this.nameElement.classList.add('stat-row-name-skill');
    }
}

class SpecRow extends StatRow {
    constructor(templateElement) {
        super(templateElement);
        this.nameElement.classList.add('stat-row-name-spec');
    }
}

class Character {
    constructor(data) {
        this.name = data.Name;
        this.stats = data.Stats;
    }

    getStat(name) {
        return this.stats.find(stat => stat.Name === name);
    }

    getStatsByType(type) {
        return this.stats.filter(stat => stat.Type === type);
    }

    updateStat(name, field, value) {
        const stat = this.getStat(name);
        if (stat) {
            stat[field] = value;
        }
    }

    toJSON() {
        return {
            Name: this.name,
            Stats: this.stats
        };
    }

    getStatTotal(stat) {
        let total = 0;

        // If stat has a base, recursively get its total
        if (stat.Base) {
            const baseStat = this.getStat(stat.Base);
            if (baseStat) {
                total += this.getStatTotal(baseStat);
            }
        }

        // Add this stat's own modifiers
        total += stat.Species + stat.Character + stat.Misc;
        return total;
    }

    modifyStatModifier(statName, modifierType, delta) {
        const stat = this.getStat(statName);
        if (stat && stat[modifierType] !== undefined) {
            stat[modifierType] += delta;
            // Prevent negative values
            if (stat[modifierType] < 0) {
                stat[modifierType] = 0;
            }
        }
    }
}

class Templates {
    static #instance = null;
    #templates = new Map();

    static getInstance() {
        if (!Templates.#instance) {
            Templates.#instance = new Templates();
        }
        return Templates.#instance;
    }

    initialize() {
        this.#templates.set('statRow', document.getElementById('template-stat-row'));
        this.#templates.set('statModifierRow', document.getElementById('template-stat-modifier-row'));
    }

    get(templateName) {
        const template = this.#templates.get(templateName);
        if (!template) {
            throw new Error(`Template '${templateName}' not found`);
        }
        return template;
    }
}

let currentCharacter = null;
let statRowsMap = {};

function pipsToDice(totalPips) {
    let dice = Math.floor(totalPips / 3);
    let pips = totalPips % 3;

    if (pips === 0)
        return dice + "D";

    return dice + "D+" + pips;
}

function calculateStatTotals(character, rows) {
    character.stats.forEach(stat => {
        const total = character.getStatTotal(stat);
        const row = rows[stat.Name];

        if (row) {
            // Update the main stat value
            row.updateValue(pipsToDice(total));

            // Update the modifier row displays
            for (const modType of ["Species", "Character", "Misc"]) {
                const modRow = row.modifierRows[modType];
                if (modRow) {
                    modRow.setValue(stat[modType]);
                }
            }
        }
    });
}

async function loadCharacterData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        currentCharacter = new Character(data);
        return currentCharacter;
    } catch (error) {
        console.error('Error loading character data:', error);
        throw error;
    }
}

function processCharacterStats(character, statView) {
    const templates = Templates.getInstance();
    const statRowTemplate = templates.get('statRow');
    const modifierRowTemplate = templates.get('statModifierRow');
    const rows = {};

    character.stats.forEach(element => {
        let row = null;

        switch (element.Type) {
            case "Attribute":
                row = new StatRow(statRowTemplate);
                row.setId("attribute-" + element.Name);
                row.setName(element.Name);

                // Add modifier rows with references to their stat
                const speciesRow = row.addModifierRow("Species", modifierRowTemplate, element.Name);
                speciesRow.setValue(element.Species);
                speciesRow.setupEventListeners(character);

                const characterRow = row.addModifierRow("Character", modifierRowTemplate, element.Name);
                characterRow.setValue(element.Character);
                characterRow.setupEventListeners(character);

                const miscRow = row.addModifierRow("Misc", modifierRowTemplate, element.Name);
                miscRow.setValue(element.Misc);
                miscRow.setupEventListeners(character);

                statView.appendChild(row);
                rows[element.Name] = row;
                break;

            case "Skill":
                row = new SkillRow(statRowTemplate);
                row.setId("skill-" + element.Name);
                row.setName(element.Name);

                // Add modifier rows with references to their stat
                const skillSpeciesRow = row.addModifierRow("Species", modifierRowTemplate, element.Name);
                skillSpeciesRow.setValue(element.Species);
                skillSpeciesRow.setupEventListeners(character);

                const skillCharacterRow = row.addModifierRow("Character", modifierRowTemplate, element.Name);
                skillCharacterRow.setValue(element.Character);
                skillCharacterRow.setupEventListeners(character);

                const skillMiscRow = row.addModifierRow("Misc", modifierRowTemplate, element.Name);
                skillMiscRow.setValue(element.Misc);
                skillMiscRow.setupEventListeners(character);

                let attributeRow = rows[element.Base];
                attributeRow.appendChild(row);
                rows[element.Name] = row;
                break;

            case "Specialization":
                row = new SpecRow(statRowTemplate);
                row.setId("spec-" + element.Name);
                row.setName(element.Name);

                // Add modifier rows with references to their stat
                const specSpeciesRow = row.addModifierRow("Species", modifierRowTemplate, element.Name);
                specSpeciesRow.setValue(element.Species);
                specSpeciesRow.setupEventListeners(character);

                const specCharacterRow = row.addModifierRow("Character", modifierRowTemplate, element.Name);
                specCharacterRow.setValue(element.Character);
                specCharacterRow.setupEventListeners(character);

                const specMiscRow = row.addModifierRow("Misc", modifierRowTemplate, element.Name);
                specMiscRow.setValue(element.Misc);
                specMiscRow.setupEventListeners(character);

                let skillRow = rows[element.Base];
                skillRow.appendChild(row);
                rows[element.Name] = row;
                break;
        }
    });

    // Store rows globally for updates
    statRowsMap = rows;
    return rows;
}

// Update only the affected stats when a modifier changes
function updateAffectedStats(character, changedStatName) {
    // Find the stat that changed
    const changedStat = character.getStat(changedStatName);
    if (!changedStat) return;

    // Update the changed stat
    const changedRow = statRowsMap[changedStatName];
    if (changedRow) {
        changedRow.updateValue(pipsToDice(character.getStatTotal(changedStat)));
    }

    // Find and update any stats that depend on this one
    character.stats.forEach(stat => {
        if (stat.Base === changedStatName) {
            const row = statRowsMap[stat.Name];
            if (row) {
                row.updateValue(pipsToDice(character.getStatTotal(stat)));

                // Recursively update any stats that depend on this one
                updateAffectedStats(character, stat.Name);
            }
        }
    });
}

// Fill sheet after DOM loads
document.addEventListener("DOMContentLoaded", async () => {
    const statView = new View(document.getElementById('stat-view'));
    Templates.getInstance().initialize();

    try {
        const character = await loadCharacterData('hecreus.json');
        const rows = processCharacterStats(character, statView);
        calculateStatTotals(character, rows);
    } catch (error) {
        console.error('Failed to load character sheet:', error);
    }
});