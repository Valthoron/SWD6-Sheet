import { CharacterStat } from './CharacterStat.js';

export class Character {
    #name = "";
    #stats = [];

    constructor(data) {
        this.#name = data.Name || "";
        this.#stats = (data.Stats || []).map(statData => new CharacterStat(this, statData));
    }

    get name() { return this.#name; }
    get stats() { return this.#stats; }

    getStat(name) {
        return this.#stats.find(stat => stat.Name === name);
    }

    getStatsWithType(type) {
        return this.#stats.filter(stat => stat.Type === type);
    }

    getStatsWithBase(base) {
        return this.#stats.filter(stat => stat.Base === base);
    }

    calculate() {
        this.#stats.forEach(stat => { stat.calculate(this); });
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
