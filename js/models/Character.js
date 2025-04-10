import { CharacterStat } from './CharacterStat.js';

export class Character {
    #name = "";
    #stats = [];

    #totals = {
        AttributesSpecies: 0,
        AttributesStarting: 0,
        Attributes: 0,
        Skills: 0,
        Improvement: 0,
        Dice: 0,
        CharacterPoints: 0
    }

    constructor(data) {
        this.#name = data.Name || "";
        this.#stats = (data.Stats || []).map(statData => new CharacterStat(this, statData));
    }

    get Name() { return this.#name; }
    get Stats() { return this.#stats; }
    get Totals() { return this.#totals; }

    getStat(name) {
        return this.#stats.find(stat => stat.Name === name);
    }

    getStatsWithType(type) {
        return this.#stats.filter(stat => stat.Type === type);
    }

    getStatsWithBase(base) {
        return this.#stats.filter(stat => stat.Base === base);
    }

    updateStatName(name, newName) {
        const stat = this.getStat(name);

        if (!stat)
            return;

        stat.Name = newName;
        this.#stats.forEach(stat => { if (stat.Base === name) stat.Base = newName; });
    }

    updateStatModifier(name, modifier, delta) {
        const stat = this.getStat(name);

        if (!stat)
            return;

        if (!(modifier in stat))
            return;

        stat[modifier] += delta;

        if ((stat[modifier] < 0) && (modifier !== "Bonus"))
            stat[modifier] = 0;

        this.calculate();
    }

    updateStatType(name, newType) {
        const stat = this.getStat(name);

        if (!stat)
            return;

        stat.Type = newType;
        this.calculate();
    }

    addStat(statData) {
        const newStat = new CharacterStat(this, statData);
        this.#stats.push(newStat);
        this.calculate();
        return newStat;
    }

    removeStat(name) {
        let statsToRemove = [name];
        this.getStatsWithBase(name).forEach(stat => statsToRemove.push(stat.Name));
        this.#stats = this.#stats.filter(stat => !statsToRemove.includes(stat.Name));
        this.calculate();
        return statsToRemove;
    }

    calculate() {
        this.#stats.forEach(stat => { stat.calculate(this); });

        // Statistics / totals
        const attributes = this.getStatsWithType("Attribute");
        const skills = this.#stats.filter(stat => ["Skill", "AdvancedSkill", "Specialization"].includes(stat.Type));

        this.#totals.AttributesSpecies = attributes.reduce((total, stat) => total + stat.Species, 0);
        this.#totals.AttributesStarting = attributes.reduce((total, stat) => total + stat.Starting, 0);
        this.#totals.Skills = skills.reduce((total, stat) => total + stat.Starting, 0);
        this.#totals.Improvement = this.#stats.reduce((total, stat) => total + stat.Improvement, 0);
        this.#totals.CharacterPoints = this.#stats.reduce((total, stat) => total + stat.CharacterPoints, 0);

        this.#totals.Attributes = this.#totals.AttributesSpecies + this.#totals.AttributesStarting;
        this.#totals.Dice = this.#totals.Attributes + this.#totals.Skills + this.#totals.Improvement;
    }

    toJSON() {
        return {
            Name: this.#name,
            Stats: this.#stats.map(stat => stat.toJSON())
        };
    }

    downloadAsJson() {
        const characterData = JSON.stringify(this.toJSON(), null, 4);
        const blob = new Blob([characterData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const fileName = `${this.#name || 'character'}.json`;
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = fileName;
        downloadLink.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    static async fromData(path) {
        try {
            const response = await fetch('data/' + path);
            const characterData = await response.json();
            const character = new Character(characterData);
            character.calculate();
            return character;
        } catch (error) {
            console.error('Error loading character data:', error);
            throw error;
        }
    }
}
