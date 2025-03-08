import { SkillRow, SpecRow, StatRow } from './StatRow.js';
import { View } from './View.js';

export class SheetController extends View {
    #character = null;
    #rows = {};

    constructor(character, sheetElement) {
        super(sheetElement);
        this.#character = character;
    }

    initialize() {
        super.initialize();
        //this.refresh();
        return this;
    }

    _initializeChildViews() {
        // Create rows in attribute, skill, spec order
        // so that rows are parenteed correctly regardless
        // of order in character data

        this.#character.getStatsWithType("Attribute").forEach(attrib => {
            const row = new StatRow().initialize();
            row.setName(attrib.Name);

            this.appendChild(row);
            this.#rows[attrib.Name] = row;
        });

        this.#character.getStatsWithType("Skill").forEach(skill => {
            const row = new SkillRow().initialize();
            row.setName(skill.Name);

            const attribRow = this.#rows[skill.Base];
            attribRow.appendChild(row);
            this.#rows[skill.Name] = row;
        });

        this.#character.getStatsWithType("Specialization").forEach(spec => {
            const row = new SpecRow().initialize();
            row.setName(spec.Name);

            const skillRow = this.#rows[spec.Base];
            skillRow.appendChild(row);
            this.#rows[spec.Name] = row;
        });
    }

    refresh() {
        Object.entries(this.#rows).forEach(([name, row]) => {
            this._refreshStat(name);
        });
    }

    _refreshStat(name) {
        const stat = this.#character.getStat(name);
        this.#rows[name].setValue(this.#character.getStat(name).Species);

        const subStats = this.#character.getStatsWithBase(name);
        subStats.forEach(subStat => {
            this._refreshStat(subStat.Name);
        });
    }
}
