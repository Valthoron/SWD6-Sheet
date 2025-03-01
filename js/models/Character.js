class Character {
    constructor(data) {
        this.name = data.Name;
        this.stats = data.Stats;
    }

    getStat(name) {
        return this.stats.find(stat => stat.Name === name);
    }

    getStatsByType(type) {
        return this.stats.filter(stat => stat.Type === type);
    }

    updateStat(name, field, value) {
        const stat = this.getStat(name);
        if (stat) {
            stat[field] = value;
        }
    }

    toJSON() {
        return {
            Name: this.name,
            Stats: this.stats
        };
    }

    getStatTotal(stat) {
        let total = 0;

        // If stat has a base, recursively get its total
        if (stat.Base) {
            const baseStat = this.getStat(stat.Base);
            if (baseStat) {
                total += this.getStatTotal(baseStat);
            }
        }

        // Add this stat's own modifiers
        total += stat.Species + stat.Character + stat.Misc;
        return total;
    }

    modifyStatModifier(statName, modifierType, delta) {
        const stat = this.getStat(statName);
        if (stat && stat[modifierType] !== undefined) {
            stat[modifierType] += delta;
            // Prevent negative values
            if (stat[modifierType] < 0) {
                stat[modifierType] = 0;
            }
        }
    }
}
