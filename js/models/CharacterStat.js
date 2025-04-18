import { jsonAddNonZero } from "../utils/json.js";

export class CharacterStat {
    #character = null;

    #type = "";
    #name = "";
    #base = "";

    #baseStarting = 0;

    #species = 0;
    #starting = 0;
    #bonus = 0;
    #improvement = 0;

    #total = 0;
    #characterPoints = 0;

    constructor(character, data = {}) {
        this.#character = character;

        this.#name = data.Name;
        this.#type = data.Type;
        this.#base = data.Base || "";

        this.#baseStarting = data.BaseStarting || 0;

        this.#species = data.Species || 0;
        this.#starting = data.Starting || 0;
        this.#bonus = data.Bonus || 0;
        this.#improvement = data.Improvement || 0;
    }

    get Name() { return this.#name; }
    set Name(value) { this.#name = value; }

    get Type() { return this.#type; }
    set Type(value) { this.#type = value; }

    get Base() { return this.#base; }
    set Base(value) { this.#base = value; }

    get BaseStarting() { return this.#baseStarting; }
    set BaseStarting(value) { this.#baseStarting = value; }

    get Species() { return this.#species; }
    set Species(value) { this.#species = value; }

    get Starting() { return this.#starting; }
    set Starting(value) { this.#starting = value; }

    get Bonus() { return this.#bonus; }
    set Bonus(value) { this.#bonus = value; }

    get Improvement() { return this.#improvement; }
    set Improvement(value) { this.#improvement = value; }

    get Total() { return this.#total; }
    get TotalWithBonus() { return this.#total + this.#bonus; }
    get CharacterPoints() { return this.#characterPoints; }

    calculate() {
        this.calculateTotal();
        this.calculateCharacterPoints();
    }

    calculateTotal() {
        const calculators = {
            "Attribute": () => this.#calculateAttributeTotal(),
            "Skill": () => this.#calculateSkillTotal(),
            "AdvancedSkill": () => this.#calculateAdvancedSkillTotal(),
            "Specialization": () => this.#calculateSpecializationTotal()
        };

        this.#total = calculators[this.#type]();
    }

    #calculateAttributeTotal() {
        // species + starting

        return this.#species + this.#starting + this.#improvement;
    }

    #calculateSkillTotal() {
        // (attribute: species + starting + improvement) + starting

        const attribute = this.#character.getStat(this.#base);

        return (attribute.#species + attribute.#starting + attribute.#improvement) + this.#starting + this.#improvement;
    }

    #calculateAdvancedSkillTotal() {
        // starting + improvement

        return this.#starting + this.#improvement;
    }

    #calculateSpecializationTotal() {
        // Spec on creation
        // (attribute: species + starting + improvement) + (base: character) + starting

        // Spec learned later
        // (attribute: species + starting + improvement) + (base: character) + starting

        const skill = this.#character.getStat(this.#base);
        const attribute = this.#character.getStat(skill.#base);

        if (this.#baseStarting !== 0)
            return (attribute.#species + attribute.#starting + attribute.#improvement) + (skill.#baseStarting) + this.#starting + this.#improvement;
        else
            return (attribute.#species + attribute.#starting + attribute.#improvement) + (skill.#starting) + this.#starting + this.#improvement;
    }

    calculateCharacterPoints() {
        if (this.#improvement < 0) {
            this.#characterPoints = 0;
            return;
        }

        if (this.#improvement > 300) {
            this.#characterPoints = 0;
            return;
        }

        const multipliers = {
            "Attribute": 10,
            "Skill": 1,
            "AdvancedSkill": 2,
            "Specialization": 0.5
        }

        const multiplier = multipliers[this.#type];
        let points = 0;
        let start = this.#total - this.#improvement;

        while (start < this.#total) {
            let dice = Math.floor(start / 3)
            points += Math.ceil(multiplier * dice);
            start++;
        }

        this.#characterPoints = points;
    }

    toJSON() {
        let json = {
            "Type": this.#type,
            "Name": this.#name
        };

        if (this.#type !== "Attribute")
            json["Base"] = this.#base;

        jsonAddNonZero(json, "Species", this.#species);
        jsonAddNonZero(json, "Starting", this.#starting);
        jsonAddNonZero(json, "Improvement", this.#improvement);
        jsonAddNonZero(json, "Bonus", this.#bonus);
        jsonAddNonZero(json, "BaseStarting", this.#baseStarting);

        return json;
    }
}