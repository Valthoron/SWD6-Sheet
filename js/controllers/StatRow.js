import { pipsToDice } from "../utils/formatters.js";
import { Templates } from "../utils/Templates.js";
import { StatModifierRow } from "./StatModifierRow.js";
import { View } from "./View.js";

export class StatRow extends View {
    _stat = null;
    _modifierRows = null;

    // Elements
    _nameLabel = null;
    _valueLabel = null;
    _advancedTag = null;
    _preBonusValueLabel = null;

    _renameButton = null;
    _nameEditContainer = null;
    _nameInput = null;
    _nameSaveButton = null;
    _nameRevertButton = null;

    _removeButton = null;
    _confirmRemoveButton = null;

    _advancedToggle = null;
    _advancedCheckbox = null;

    _modifierContainer = null;
    _statContainer = null;

    _addButton = null;

    // Events
    onNameChange = null;
    onTypeChange = null;
    onModifierChange = null;
    onAddStat = null;
    onRemoveStat = null;

    constructor() {
        const [element, childMap] = Templates.instantiateWithChildMap("statRow");
        super(element);

        this._modifierRows = new Map();

        this._nameLabel = this._element.querySelector(".stat-row__name-label");
        this._valueLabel = this._element.querySelector(".stat-row__value-label");

        this._advancedTag = this._element.querySelector(".stat-row__advanced-tag");
        this._preBonusValueLabel = this._element.querySelector(".stat-row__pre-bonus-value-label");

        this._buttonContainer = this._element.querySelector(".stat-row__buttons");
        this._renameButton = childMap.get("stat-row-rename-button");
        this._removeButton = childMap.get("stat-row-remove-button");
        this._abortRemoveButton = this._element.querySelector(".stat-row__abort-remove-button");
        this._confirmRemoveButton = this._element.querySelector(".stat-row__confirm-remove-button");

        this._nameEditContainer = this._element.querySelector(".stat-row__name-edit");
        this._nameInput = this._element.querySelector(".stat-row__name-input");
        this._nameSaveButton = childMap.get("stat-row-name-save-button");
        this._nameRevertButton = childMap.get("stat-row-name-revert-button");

        this._advancedToggle = this._element.querySelector(".stat-row__advanced-checkbox");
        this._advancedCheckbox = childMap.get("stat-row-advanced-checkbox");

        this._modifierContainer = this._element.querySelector(".stat-row__modifier-container");
        this._registerContainer("modifier-container", this._modifierContainer);
        this._statContainer = this._element.querySelector(".stat-row__stat-container");
        this._registerContainer("stat-container", this._statContainer);

        this._addButton = this._element.querySelector(".stat-row__add-button");
    }

    initialize(stat) {
        this._stat = stat;

        super.initialize();

        this._nameLabel.textContent = stat.Name;

        return this;
    }

    _initializeChildViews() {
        this._createModifierRow("Starting");
        this._createModifierRow("Improvement");
        this._createModifierRow("Bonus");
    }

    _setupEventListenersAdd() {
        this._addButton.addEventListener("click", () => this._addStat());
    }

    _setupEventListenersRename() {
        this._nameLabel.addEventListener("click", () => this._beginRename());
        this._renameButton.addEventListener("click", () => this._beginRename());
        this._nameSaveButton.addEventListener("click", () => this._saveName());
        this._nameRevertButton.addEventListener("click", () => this._revertName());

        this._nameInput.addEventListener("input", () => this._validateNameInput());
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

    _setupEventListenersRemove() {
        this._removeButton.addEventListener("click", () => this._beginRemove());
        this._abortRemoveButton.addEventListener("click", () => this._abortRemove());
        this._confirmRemoveButton.addEventListener("click", () => this._confirmRemove());
    }

    _setupEventListenersAdvancedSkill() {
        this._advancedCheckbox.addEventListener("change", () => this._toggleAdvancedSkill());
    }

    refresh() {
        if (this._stat.TotalWithBonus != this._stat.Total) {
            this._valueLabel.textContent = pipsToDice(this._stat.TotalWithBonus);
            this._preBonusValueLabel.textContent = "(" + pipsToDice(this._stat.Total) + ")";
            this._preBonusValueLabel.style.display = "block";
        }
        else {
            this._valueLabel.textContent = pipsToDice(this._stat.Total);
            this._preBonusValueLabel.style.display = "";
        }

        this._modifierRows.forEach((row, modifierName) => {
            row.setValue(this._stat[modifierName]);
        });
    }

    beginRenameAndSelect() {
        this._beginRename();
        this._nameInput.select();
    }

    _createModifierRow(modifierName) {
        const row = new StatModifierRow().initialize(modifierName);
        row.onValueChange = (modifier, delta) => this._modifierChange(modifier, delta);
        this.appendChild(row, "modifier-container");
        this._modifierRows.set(modifierName, row);
    }

    _modifierChange(modifier, delta) {
        this.onModifierChange?.(modifier, delta);
    }

    _isNameValid(name) {
        // Empty names are invalid
        if (!name === "")
            return false;

        // If the name is unchanged, it's valid
        if (name.toLowerCase() === this._stat.Name.toLowerCase())
            return true;

        // Check for duplicates in all stats
        const stats = this._stat.Character.Stats;
        return !stats.some(stat => stat.Name.toLowerCase() === name.toLowerCase());
    }

    _validateNameInput() {
        const isValid = this._isNameValid(this._nameInput.value.trim());

        if (isValid) {
            this._nameInput.classList.remove("stat-row__name-input--invalid");
            this._nameSaveButton.disabled = false;
        } else {
            this._nameInput.classList.add("stat-row__name-input--invalid");
            this._nameSaveButton.disabled = true;
        }

        return isValid;
    }

    _beginRename() {
        if (document.body.getAttribute("mode") === "view")
            return;

        this._nameInput.value = this._stat.Name;
        this._nameInput.setSelectionRange(-1, -1);

        this._nameLabel.style.display = "none";
        this._buttonContainer.style.display = "none";
        this._nameEditContainer.style.display = "block";

        this._nameInput.classList.remove("stat-row__name-input--invalid");
        this._nameSaveButton.disabled = false;

        this._nameInput.focus();
    }

    _endRename() {
        this._nameInput.value = this._stat.Name;
        this._nameInput.setSelectionRange(-1, -1);

        this._nameLabel.style.display = "block";
        this._buttonContainer.style.display = "flex";
        this._nameEditContainer.style.display = "none";

        this._nameInput.classList.remove("stat-row__name-input--invalid");
        this._nameSaveButton.disabled = false;
    }

    _saveName() {
        const newName = this._nameInput.value.trim();

        if (!this._isNameValid(newName))
            return;

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

    _beginRemove() {
        this._removeButton.style.display = "none";
        this._abortRemoveButton.style.display = "block";
        this._confirmRemoveButton.style.display = "block";
    }

    _abortRemove() {
        this._removeButton.style.display = "block";
        this._abortRemoveButton.style.display = "none";
        this._confirmRemoveButton.style.display = "none";
    }

    _confirmRemove() {
        this.onRemoveStat?.();
    }
}

export class AttributeRow extends StatRow {
    constructor() {
        super();
        this._element.classList.add("stat-row--attribute");
    }

    initialize(stat) {
        super.initialize(stat);

        this._addButton.textContent = `➕ Add Skill`;

        return this;
    }

    _initializeChildViews() {
        this._createModifierRow("Species");

        super._initializeChildViews();
    }

    _setupEventListeners() {
        super._setupEventListeners();

        this._setupEventListenersAdd();
    }
}

export class SkillRow extends StatRow {
    constructor() {
        super();
        this._element.classList.add("stat-row--skill");
    }

    initialize(stat) {
        super.initialize(stat);

        if (stat.Type === "AdvancedSkill")
            this._advancedCheckbox.checked = true;

        this._addButton.textContent = `➕ Add Specialization`;

        return this;
    }

    _setupEventListeners() {
        super._setupEventListeners();
        this._setupEventListenersRename();
        this._setupEventListenersRemove();

        this._setupEventListenersAdvancedSkill();
        this._setupEventListenersAdd();
    }

    refresh() {
        super.refresh();

        if (this._stat.Type === "AdvancedSkill")
            this._advancedTag.style.display = "block";
        else
            this._advancedTag.style.display = "none";
    }
}

export class SpecRow extends StatRow {
    constructor() {
        super();
        this._element.classList.add("stat-row--spec");
    }

    _setupEventListeners() {
        super._setupEventListeners();
        this._setupEventListenersRename();
        this._setupEventListenersRemove();
    }
}
