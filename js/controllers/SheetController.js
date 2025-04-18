import { pipsToDice } from "../utils/formatters.js";
import { AttributeRow, SkillRow, SpecRow } from "./StatRow.js";
import { View } from "./View.js";

export class SheetController extends View {
    _character = null;

    _rows = null;
    _nameLabel = null;

    _totalAttributesSpeciesElement = null;
    _totalAttributesStartingElement = null;
    _totalSkillsElement = null;
    _totalImprovementElement = null;
    _totalDiceElement = null;
    _totalCharacterPointsElement = null;

    constructor(character, navBar, sheetElement, statusBar) {
        super(sheetElement);

        this._character = character;

        this._rows = new Map();
        this._nameLabel = navBar.querySelector("#nav-name-label");

        this._renameButton = navBar.querySelector("#nav-rename-button");

        this._nameEditContainer = navBar.querySelector(".navbar__character-name-edit");
        this._nameInput = navBar.querySelector(".navbar__character-name-input");
        this._nameSaveButton = navBar.querySelector("#nav-name-save-button");
        this._nameRevertButton = navBar.querySelector("#nav-name-revert-button");

        // Statistics / totals
        this._totalAttributesSpeciesElement = statusBar.querySelector("#stat-total-attributes-species");
        this._totalAttributesStartingElement = statusBar.querySelector("#stat-total-attributes-starting");
        this._totalSkillsElement = statusBar.querySelector("#stat-total-skills");
        this._totalImprovementElement = statusBar.querySelector("#stat-total-improvement");
        this._totalDiceElement = statusBar.querySelector("#stat-total-dice");
        this._totalCharacterPointsElement = statusBar.querySelector("#stat-total-character-points");
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

    _setupEventListeners() {
        super._setupEventListeners();

        this._nameLabel.addEventListener("click", () => this._beginRename());
        this._renameButton.addEventListener("click", () => this._beginRename());
        this._nameSaveButton.addEventListener("click", () => this._saveName());
        this._nameRevertButton.addEventListener("click", () => this._revertName());

        this._nameInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                this._saveName();
            } else if (event.key === "Escape") {
                event.preventDefault();
                this._revertName();
            }
        });
    }

    _beginRename() {
        if (document.body.getAttribute("mode") === "view")
            return;

        this._nameInput.value = this._character.Name;
        this._nameInput.setSelectionRange(-1, -1);

        this._nameLabel.style.display = "none";
        this._renameButton.style.display = "none";
        this._nameEditContainer.style.display = "flex";

        this._nameInput.focus();
    }

    _endRename() {
        this._nameInput.value = this._character.Name;
        this._nameInput.setSelectionRange(-1, -1);

        this._nameLabel.style.display = "block";
        this._renameButton.style.display = "";
        this._nameEditContainer.style.display = "none";
    }

    _saveName() {
        const newName = this._nameInput.value.trim();

        this._nameLabel.textContent = newName;
        this._character.Name = newName;

        this._endRename();
    }

    _revertName() {
        this._endRename();
    }

    _createStatRow(rowType, stat) {
        const row = new rowType().initialize(stat);

        row.onNameChange = (newName) => this._rowNameChange(stat, newName);
        row.onTypeChange = (newType) => this._rowTypeChange(stat, newType);
        row.onModifierChange = (modifier, delta) => this._rowModifierChange(stat, modifier, delta);
        row.onAddStat = () => this._rowAddStat(stat);
        row.onRemoveStat = () => this._rowRemoveStat(stat);

        if (stat.Base !== "") {
            let base = this._rows.get(this._character.getStat(stat.Base));
            base.appendChild(row, "stat-container");
        }
        else
            this.appendChild(row);

        this._rows.set(stat, row);

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

    _createUniqueStatName(startingName) {
        let name = startingName;
        let i = 2;

        while (this._character.getStat(name)) {
            name = `${startingName} (${i})`;
            i++;

            if (i > 10)
                break;
        }

        return name;
    }

    _rowAddStat(parentStat) {
        if (parentStat.Type === "Attribute") {
            const stat = this._character.addStat({
                Type: "Skill",
                Name: this._createUniqueStatName("New Skill"),
                Base: parentStat.Name
            });

            const row = this._createStatRow(SkillRow, stat);
            row.beginRenameAndSelect();

        } else if ((parentStat.Type === "Skill") || (parentStat.Type === "AdvancedSkill")) {
            const stat = this._character.addStat({
                Type: "Specialization",
                Name: this._createUniqueStatName("New Specialization"),
                Base: parentStat.Name
            });

            const row = this._createStatRow(SpecRow, stat);
            row.beginRenameAndSelect();
        }

        this.refresh();
    }

    _rowRemoveStat(stat) {
        const statsToRemove = this._character.removeStat(stat.Name);

        statsToRemove.forEach(stat => {
            this._rows.get(stat).removeFromParent();
            this._rows.delete(stat);
        });

        this.refresh();
    }

    refresh() {
        this._rows.forEach((row, _) => { row.refresh(); });

        this._totalAttributesSpeciesElement.textContent = pipsToDice(this._character.Totals.AttributesSpecies);
        this._totalAttributesStartingElement.textContent = pipsToDice(this._character.Totals.AttributesStarting);
        this._totalSkillsElement.textContent = pipsToDice(this._character.Totals.Skills);
        this._totalImprovementElement.textContent = pipsToDice(this._character.Totals.Improvement);
        this._totalDiceElement.textContent = pipsToDice(this._character.Totals.Dice);
        this._totalCharacterPointsElement.textContent = this._character.Totals.CharacterPoints;
    }
}
