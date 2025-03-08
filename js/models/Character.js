class Character {
    #name = "";
    #stats = [];

    constructor(data) {
        this.#name = data.Name || "";
        this.#stats = data.Stats || [];
    }

    get name() { return this.#name; }

    getStats() { return this.#stats; }

    getStat(name) {
        return this.#stats.find(stat => stat.Name === name);
    }

    getStatsWithType(type) {
        return this.#stats.filter(stat => stat.Type === type);
    }

    getStatsWithBase(base) {
        return this.#stats.filter(stat => stat.Base === base);
    }



    toJSON() {
        return {
            Name: this.#name,
            Stats: this.#stats.map(stat => stat.toJSON())
        };
    }

    static async fromData(path) {
        try {
            const response = await fetch('data/' + path);
            const characterData = await response.json();
            return new Character(characterData);
        } catch (error) {
            console.error('Error loading character data:', error);
            throw error;
        }
    }
}
