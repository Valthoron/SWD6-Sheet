import { pipsToDice } from '../utils/Formatters.js';
import { AttributeRow, SkillRow, SpecRow } from './StatRow.js';
import { View } from './View.js';

export class SheetController extends View {
    _character = null;
    _rows = {};

    _totalAttributesSpeciesElement = null;
    _totalAttributesStartingElement = null;
    _totalSkillsElement = null;
    _totalImprovementElement = null;
    _totalDiceElement = null;
    _totalCharacterPointsElement = null;

    constructor(character, sheetElement) {
        super(sheetElement);
        this._character = character;

        // Statistics / totals
        this._totalAttributesSpeciesElement = this._element.querySelector('#stat-total-attributes-species');
        this._totalAttributesStartingElement = this._element.querySelector('#stat-total-attributes-starting');
        this._totalSkillsElement = this._element.querySelector('#stat-total-skills');
        this._totalImprovementElement = this._element.querySelector('#stat-total-improvement');
        this._totalDiceElement = this._element.querySelector('#stat-total-dice');
        this._totalCharacterPointsElement = this._element.querySelector('#stat-total-character-points');
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

        this._character.getStatsWithType("AdvancedSkill").forEach(skill => {
            this._createStatRow(SkillRow, skill);
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
        this._totalAttributesSpeciesElement.textContent = pipsToDice(this._character.Totals.AttributesSpecies);
        this._totalAttributesStartingElement.textContent = pipsToDice(this._character.Totals.AttributesStarting);
        this._totalSkillsElement.textContent = pipsToDice(this._character.Totals.Skills);
        this._totalImprovementElement.textContent = pipsToDice(this._character.Totals.Improvement);
        this._totalDiceElement.textContent = pipsToDice(this._character.Totals.Dice);
        this._totalCharacterPointsElement.textContent = this._character.Totals.CharacterPoints;
    }
}
