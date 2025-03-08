import { pipsToDice } from '../utils/Formatters.js';
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
        this.refresh();
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

        Object.values(this.#rows).forEach(row => {
            row.onModifierChange = (statName, modifierName, delta) => this.#statModifierChange(statName, modifierName, delta);
        });
    }

    refresh() {
        Object.keys(this.#rows).forEach(name => {
            this._refreshStat(name);
        });
    }

    _refreshStat(name) {
        const stat = this.#character.getStat(name);
        this.#rows[name].setValue(pipsToDice(stat.Total));
        this.#rows[name].setModifierValue("Species", pipsToDice(stat.Species));
        this.#rows[name].setModifierValue("Character", pipsToDice(stat.Character));
        this.#rows[name].setModifierValue("Misc", pipsToDice(stat.Misc));
        this.#rows[name].setModifierValue("Advancement", pipsToDice(stat.Advancement));

        const subStats = this.#character.getStatsWithBase(name);
        subStats.forEach(subStat => {
            this._refreshStat(subStat.Name);
        });
    }

    #statModifierChange(statName, modifierName, delta) {
        const stat = this.#character.getStat(statName);
        stat[modifierName] += delta;
        this.#character.calculateStat(stat);
        this._refreshStat(statName);
    }
}
