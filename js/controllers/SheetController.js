import { pipsToDice } from '../utils/Formatters.js';
import { AttributeRow, SkillRow, SpecRow } from './StatRow.js';
import { View } from './View.js';

export class SheetController extends View {
    _character = null;
    _rows = {};

    _totalAttributeSpeciesElement = null;
    _totalAttributeCharacterElement = null;
    _totalSkillElement = null;
    _totalImprovementElement = null;
    _totalGrandElement = null;
    _totalImprovementPointsElement = null;

    constructor(character, sheetElement) {
        super(sheetElement);
        this._character = character;
        this._totalAttributeSpeciesElement = this._element.querySelector('#stat-total-attribute-species');
        this._totalAttributeCharacterElement = this._element.querySelector('#stat-total-attribute-character');
        this._totalSkillElement = this._element.querySelector('#stat-total-skill');
        this._totalImprovementElement = this._element.querySelector('#stat-total-improvement');
        this._totalGrandElement = this._element.querySelector('#stat-total-grand');
        this._totalImprovementPointsElement = this._element.querySelector('#stat-total-improvement-points');
    }

    initialize() {
        super.initialize();
        this.refresh();
        return this;
    }

    _initializeChildViews() {
        // Create rows in attribute, skill, spec order so that rows are parented
        // correctly regardless of order in character data

        this._character.getStatsWithType("Attribute").forEach(attribute => {
            this._createStatRow(AttributeRow, attribute);
        });

        this._character.getStatsWithType("Skill").forEach(skill => {
            this._createStatRow(SkillRow, skill);
        });

        this._character.getStatsWithType("Specialization").forEach(specialization => {
            this._createStatRow(SpecRow, specialization);
        });
    }

    _createStatRow(rowType, stat) {
        const row = new rowType().initialize(stat);
        row.onChange = (modifier, delta) => this.#rowModifierChange(stat, modifier, delta);

        if (stat.Base !== "")
            this._rows[stat.Base].appendChild(row);
        else
            this.appendChild(row);

        this._rows[stat.Name] = row;
    }

    #rowModifierChange(stat, modifier, delta) {
        stat[modifier] += delta;
        this._character.calculate();
        this.refresh();
    }

    refresh() {
        Object.values(this._rows).forEach(row => row.refresh());
        this._refreshTotals();
    }

    _refreshTotals() {
        // TODO: Move calculation to character class
        const attributes = this._character.getStatsWithType("Attribute");
        const skills = this._character.getStatsWithType("Skill");

        const totalAttributeSpecies = attributes.reduce((total, stat) => total + stat.Species, 0);
        const totalAttributeCharacter = attributes.reduce((total, stat) => total + stat.Character, 0);
        const totalSkill = skills.reduce((total, stat) => total + stat.Character, 0);
        const totalImprovement = attributes.reduce((total, attribute) => total + attribute.Improvement, 0) + skills.reduce((total, stat) => total + stat.Improvement, 0);

        this._totalAttributeSpeciesElement.textContent = pipsToDice(totalAttributeSpecies);
        this._totalAttributeCharacterElement.textContent = pipsToDice(totalAttributeCharacter);
        this._totalSkillElement.textContent = pipsToDice(totalSkill);
        this._totalImprovementElement.textContent = pipsToDice(totalImprovement);
        this._totalGrandElement.textContent = pipsToDice(totalAttributeSpecies + totalAttributeCharacter + totalSkill + totalImprovement);
        this._totalImprovementPointsElement.textContent = "nil"; // TODO
    }
}
