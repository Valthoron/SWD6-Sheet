import { pipsToDice } from "../utils/Formatters.js";
import { Templates } from "../utils/Templates.js";
import { StatModifierRow } from "./StatModifierRow.js";
import { View } from "./View.js";

export class StatRow extends View {
    _stat = null;

    _nameLabel = null;
    _valueLabel = null;

    _renameButton = null;
    _nameEditContainer = null;
    _nameInput = null;
    _nameSaveButton = null;
    _nameRevertButton = null;

    _modifierRows = {};

    onModifierChange = null;
    onNameChange = null;

    constructor() {
        super(Templates.getInstance().get("statRow").cloneNode(true));

        this._nameLabel = this._element.querySelector(".stat-row__name");
        this._valueLabel = this._element.querySelector(".stat-row__value");

        this._renameButton = this._element.querySelector(".stat-row__rename-button");
        this._nameEditContainer = this._element.querySelector(".stat-row__name-edit");
        this._nameInput = this._element.querySelector(".stat-row__name-input");
        this._nameSaveButton = this._element.querySelector(".stat-row__name-save-button");
        this._nameRevertButton = this._element.querySelector(".stat-row__name-revert-button");
    }

    initialize(stat) {
        super.initialize();

        this._stat = stat;

        this._nameLabel.textContent = stat.Name;
        this._nameEditContainer.style.display = "none";

        return this;
    }

    _initializeChildViews() {
        this._createModifierRow("Starting", "create");
        this._createModifierRow("Improvement", "advance");
        this._createModifierRow("Bonus", "create");
    }

    _setupEventListeners() {
        this._renameButton.addEventListener("click", () => this._beginRename());
        this._nameSaveButton.addEventListener("click", () => this._saveName());
        this._nameRevertButton.addEventListener("click", () => this._revertName());
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
        this._nameEditContainer.style.display = "";
        this._nameInput.focus();
    }

    _endRename() {
        this._nameLabel.style.display = "";
        this._renameButton.style.display = "";
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
}

export class AttributeRow extends StatRow {
    initialize(stat) {
        super.initialize(stat);

        this._renameButton.remove()
        this._nameEditContainer.remove()

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

    _initializeChildViews() {
        super._initializeChildViews();
    }
}

export class SpecRow extends StatRow {
    constructor() {
        super();
        this._nameLabel.classList.add("stat-row__name--spec");
    }

    _initializeChildViews() {
        super._initializeChildViews();
    }
}
