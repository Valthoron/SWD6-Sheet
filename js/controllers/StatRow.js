import { pipsToDice } from "../utils/Formatters.js";
import { Templates } from "../utils/Templates.js";
import { StatModifierRow } from "./StatModifierRow.js";
import { View } from "./View.js";

export class StatRow extends View {
    _stat = null;

    _nameLabel = null;
    _valueLabel = null;

    _renameButton = null;
    _addButton = null;
    _nameEditContainer = null;
    _nameInput = null;
    _nameSaveButton = null;
    _nameRevertButton = null;

    _advancedToggle = null;
    _advancedCheckbox = null;

    _modifierRows = {};

    onNameChange = null;
    onTypeChange = null;
    onModifierChange = null;
    onAddStat = null;

    constructor() {
        super(Templates.getInstance().get("statRow").cloneNode(true));

        this._nameLabel = this._element.querySelector(".stat-row__name");
        this._valueLabel = this._element.querySelector(".stat-row__value");

        this._renameButton = this._element.querySelector(".stat-row__rename-button");
        this._addButton = this._element.querySelector(".stat-row__add-button");
        this._nameEditContainer = this._element.querySelector(".stat-row__name-edit");
        this._nameInput = this._element.querySelector(".stat-row__name-input");
        this._nameSaveButton = this._element.querySelector(".stat-row__name-save-button");
        this._nameRevertButton = this._element.querySelector(".stat-row__name-revert-button");

        this._advancedToggle = this._element.querySelector(".stat-row__advanced-toggle");
        this._advancedCheckbox = this._element.querySelector(".stat-row__advanced-checkbox");
    }

    initialize(stat) {
        super.initialize();

        this._stat = stat;
        this._nameLabel.textContent = stat.Name;

        return this;
    }

    _initializeChildViews() {
        this._createModifierRow("Starting", "create");
        this._createModifierRow("Improvement", "advance");
        this._createModifierRow("Bonus", "create");
    }

    _setupEventListeners() {
        this._renameButton.addEventListener("click", () => this._beginRename());
        this._addButton.addEventListener("click", () => this._addStat());
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

        this._advancedCheckbox.addEventListener("change", () => this._toggleAdvancedSkill());
    }

    refresh() {
        if (this._stat.TotalWithBonus != this._stat.Total)
            this._valueLabel.textContent = "(" + pipsToDice(this._stat.Total) + ") " + pipsToDice(this._stat.TotalWithBonus);
        else
            this._valueLabel.textContent = pipsToDice(this._stat.Total);

        Object.entries(this._modifierRows).forEach(([modifierName, row]) => {
            row.setValue(this._stat[modifierName]);
        });
    }

    beginRenameAndSelect() {
        this._beginRename();
        this._nameInput.select();
    }

    _createModifierRow(modifierName, displayMode) {
        const row = new StatModifierRow().initialize({ name: modifierName, displayMode: displayMode });
        row.onChange = (modifier, delta) => this._modifierChange(modifier, delta);
        this.appendChild(row);
        this._modifierRows[modifierName] = row;
    }

    _modifierChange(modifier, delta) {
        this.onModifierChange?.(modifier, delta);
    }

    _beginRename() {
        this._nameInput.value = this._stat.Name;

        this._nameLabel.style.display = "none";
        this._renameButton.style.display = "none";
        this._addButton.style.display = "none";
        this._nameEditContainer.style.display = "";
        this._nameInput.focus();
    }

    _endRename() {
        this._nameLabel.style.display = "";
        this._renameButton.style.display = "";
        this._addButton.style.display = "";
        this._nameEditContainer.style.display = "none";
    }

    _saveName() {
        const newName = this._nameInput.value.trim();

        if (newName && (newName !== this._stat.Name)) {
            this.onNameChange?.(newName);
            this._nameLabel.textContent = newName;
        }

        this._endRename();
    }

    _revertName() {
        this._endRename();
    }

    _toggleAdvancedSkill() {
        const newType = this._advancedCheckbox.checked ? "AdvancedSkill" : "Skill";
        this.onTypeChange?.(newType);
    }

    _addStat() {
        this.onAddStat?.();
    }
}

export class AttributeRow extends StatRow {
    initialize(stat) {
        super.initialize(stat);

        this._renameButton.remove();
        this._nameEditContainer.remove();
        this._advancedToggle.remove();

        return this;
    }

    _initializeChildViews() {
        this._createModifierRow("Species", "create");

        super._initializeChildViews();
    }
}

export class SkillRow extends StatRow {
    constructor() {
        super();
        this._nameLabel.classList.add("stat-row__name--skill");
    }

    initialize(stat) {
        super.initialize(stat);

        if (stat.Type === "AdvancedSkill") {
            this._nameLabel.textContent = "(A) " + stat.Name;
            this._advancedCheckbox.checked = true;
        }

        this._nameEditContainer.style.display = "none";

        return this;
    }

    _initializeChildViews() {
        super._initializeChildViews();
    }

    refresh() {
        super.refresh();

        if (this._stat.Type === "AdvancedSkill")
            this._nameLabel.textContent = "(A) " + this._stat.Name;
        else
            this._nameLabel.textContent = this._stat.Name;
    }
}

export class SpecRow extends StatRow {
    constructor() {
        super();
        this._nameLabel.classList.add("stat-row__name--spec");
    }

    initialize(stat) {
        super.initialize(stat);

        this._nameEditContainer.style.display = "none";
        this._advancedToggle.remove();

        return this;
    }

    _initializeChildViews() {
        super._initializeChildViews();
    }
}
