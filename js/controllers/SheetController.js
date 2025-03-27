import { pipsToDice } from '../utils/Formatters.js';
import { AttributeRow, SkillRow, SpecRow } from './StatRow.js';
import { View } from './View.js';

export class SheetController extends View {
    #character = null;
    #rows = {};
    #totalAttributeSpeciesElement = null;
    #totalAttributeCharacterElement = null;
    #totalSkillElement = null;
    #totalImprovementElement = null;
    #totalGrandElement = null;
    #totalImprovementPointsElement = null;

    constructor(character, sheetElement) {
        super(sheetElement);
        this.#character = character;
        this.#totalAttributeSpeciesElement = this._element.querySelector('#stat-total-attribute-species');
        this.#totalAttributeCharacterElement = this._element.querySelector('#stat-total-attribute-character');
        this.#totalSkillElement = this._element.querySelector('#stat-total-skill');
        this.#totalImprovementElement = this._element.querySelector('#stat-total-improvement');
        this.#totalGrandElement = this._element.querySelector('#stat-total-grand');
        this.#totalImprovementPointsElement = this._element.querySelector('#stat-total-improvement-points');
    }

    initialize() {
        super.initialize();
        this.refresh();
        return this;
    }

    _initializeChildViews() {
        // Create rows in attribute, skill, spec order
        // so that rows are parented correctly regardless
        // of order in character data

        this.#character.getStatsWithType("Attribute").forEach(attribute => {
            const row = new AttributeRow().initialize(attribute);
            this.appendChild(row);
            this.#rows[attribute.Name] = row;
        });

        this.#character.getStatsWithType("Skill").forEach(skill => {
            const row = new SkillRow().initialize(skill);
            const attribRow = this.#rows[skill.Base];
            attribRow.appendChild(row);
            this.#rows[skill.Name] = row;
        });

        this.#character.getStatsWithType("Specialization").forEach(specialization => {
            const row = new SpecRow().initialize(specialization);
            const skillRow = this.#rows[specialization.Base];
            skillRow.appendChild(row);
            this.#rows[specialization.Name] = row;
        });

        Object.values(this.#rows).forEach(row => {
            row.onModifierChange = (statName, modifierName, delta) => this.#statModifierChange(statName, modifierName, delta);
        });
    }

    refresh() {
        Object.keys(this.#rows).forEach(name => {
            this._refreshStat(name);
        });

        this._refreshTotals();
    }

    _refreshStat(name) {
        this.#rows[name].refresh();

        this.#character.getStatsWithBase(name).forEach(subStat => {
            this._refreshStat(subStat.Name);
        });
    }

    #statModifierChange(statName, modifierName, delta) {
        const stat = this.#character.getStat(statName);
        stat[modifierName] += delta;
        this.#character.calculateStat(stat);
        this._refreshStat(statName);

        this._refreshTotals();
    }

    _refreshTotals() {
        // TODO: Move calculation to character class
        const attributes = this.#character.getStatsWithType("Attribute");
        const skills = this.#character.getStatsWithType("Skill");

        const totalAttributeSpecies = attributes.reduce((total, stat) => total + stat.Species, 0);
        const totalAttributeCharacter = attributes.reduce((total, stat) => total + stat.Character, 0);
        const totalSkill = skills.reduce((total, stat) => total + stat.Character, 0);
        const totalImprovement = attributes.reduce((total, attribute) => total + attribute.Improvement, 0) + skills.reduce((total, stat) => total + stat.Improvement, 0);

        this.#totalAttributeSpeciesElement.textContent = pipsToDice(totalAttributeSpecies);
        this.#totalAttributeCharacterElement.textContent = pipsToDice(totalAttributeCharacter);
        this.#totalSkillElement.textContent = pipsToDice(totalSkill);
        this.#totalImprovementElement.textContent = pipsToDice(totalImprovement);
        this.#totalGrandElement.textContent = pipsToDice(totalAttributeSpecies + totalAttributeCharacter + totalSkill + totalImprovement);
        this.#totalImprovementPointsElement.textContent = "nil"; // TODO
    }
}
