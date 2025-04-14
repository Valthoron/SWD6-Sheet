import { pipsToDice } from '../utils/formatters.js';
import { AttributeRow, SkillRow, SpecRow } from './StatRow.js';
import { View } from './View.js';

export class SheetController extends View {
    _character = null;
    _rows = {};

    _nameLabel = null;

    _totalAttributesSpeciesElement = null;
    _totalAttributesStartingElement = null;
    _totalSkillsElement = null;
    _totalImprovementElement = null;
    _totalDiceElement = null;
    _totalCharacterPointsElement = null;

    constructor(character, nameLabel, sheetElement, statusBar) {
        super(sheetElement);
        this._character = character;

        this._nameLabel = nameLabel;

        // Statistics / totals
        this._totalAttributesSpeciesElement = statusBar.querySelector('#stat-total-attributes-species');
        this._totalAttributesStartingElement = statusBar.querySelector('#stat-total-attributes-starting');
        this._totalSkillsElement = statusBar.querySelector('#stat-total-skills');
        this._totalImprovementElement = statusBar.querySelector('#stat-total-improvement');
        this._totalDiceElement = statusBar.querySelector('#stat-total-dice');
        this._totalCharacterPointsElement = statusBar.querySelector('#stat-total-character-points');
    }

    initialize() {
        super.initialize();

        this._nameLabel.textContent = this._character.Name;
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

        row.onNameChange = (newName) => this._rowNameChange(stat, newName);
        row.onTypeChange = (newType) => this._rowTypeChange(stat, newType);
        row.onModifierChange = (modifier, delta) => this._rowModifierChange(stat, modifier, delta);
        row.onAddStat = () => this._rowAddStat(stat);
        row.onRemoveStat = () => this._rowRemoveStat(stat);

        if (stat.Base !== "")
            this._rows[stat.Base].appendChild(row, "stat-container");
        else
            this.appendChild(row);

        this._rows[stat.Name] = row;

        return row;
    }

    _rowNameChange(stat, newName) {
        this._character.updateStatName(stat.Name, newName);
    }

    _rowTypeChange(stat, newType) {
        this._character.updateStatType(stat.Name, newType);
        this.refresh();
    }

    _rowModifierChange(stat, modifier, delta) {
        this._character.updateStatModifier(stat.Name, modifier, delta);
        this.refresh();
    }

    _rowAddStat(parentStat) {
        if (parentStat.Type === "Attribute") {
            const stat = this._character.addStat({
                Type: "Skill",
                Name: "New Skill",
                Base: parentStat.Name
            });

            const row = this._createStatRow(SkillRow, stat);
            row.beginRenameAndSelect();

        } else if ((parentStat.Type === "Skill") || (parentStat.Type === "AdvancedSkill")) {
            const stat = this._character.addStat({
                Type: "Specialization",
                Name: "New Specialization",
                Base: parentStat.Name
            });

            const row = this._createStatRow(SpecRow, stat);
            row.beginRenameAndSelect();
        }

        this.refresh();
    }

    _rowRemoveStat(stat) {
        const statsToRemove = this._character.removeStat(stat.Name);

        statsToRemove.forEach(statName => {
            this._rows[statName].removeFromParent();
            delete this._rows[statName];
        });

        this.refresh();
    }

    refresh() {
        Object.values(this._rows).forEach(row => row.refresh());

        this._totalAttributesSpeciesElement.textContent = pipsToDice(this._character.Totals.AttributesSpecies);
        this._totalAttributesStartingElement.textContent = pipsToDice(this._character.Totals.AttributesStarting);
        this._totalSkillsElement.textContent = pipsToDice(this._character.Totals.Skills);
        this._totalImprovementElement.textContent = pipsToDice(this._character.Totals.Improvement);
        this._totalDiceElement.textContent = pipsToDice(this._character.Totals.Dice);
        this._totalCharacterPointsElement.textContent = this._character.Totals.CharacterPoints;
    }
}
