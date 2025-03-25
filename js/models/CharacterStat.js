export class CharacterStat {
    #type = "";
    #name = "";
    #base = "";

    #baseStarting = 0;
    #advancedSkill = false;

    #species = 0;
    #character = 0;
    #misc = 0;
    #improvement = 0;

    #total = 0;
    #characterPoints = 0;

    constructor(data = {}) {
        this.#name = data.Name;
        this.#type = data.Type;
        this.#base = data.Base || "";

        this.#baseStarting = data.BaseStarting || 0;
        this.#advancedSkill = data.AdvancedSkill || false;

        this.#species = data.Species || 0;
        this.#character = data.Character || 0;
        this.#misc = data.Misc || 0;
        this.#improvement = data.Improvement || 0;
    }

    get Name() { return (this.#advancedSkill ? "(A) " : "") + this.#name; }
    get Type() { return this.#type; }
    get Base() { return this.#base; }

    get BaseStarting() { return this.#baseStarting; }
    get AdvancedSkill() { return this.#advancedSkill; }

    get Species() { return this.#species; }
    set Species(value) { this.#species = value; }

    get Character() { return this.#character; }
    set Character(value) { this.#character = value; }

    get Misc() { return this.#misc; }
    set Misc(value) { this.#misc = value; }

    get Improvement() { return this.#improvement; }
    set Improvement(value) { this.#improvement = value; }

    get Total() { return this.#total; }
    get CharacterPoints() { return this.#characterPoints; }

    calculateTotal(baseTotal) {
        this.#total = baseTotal + this.#species + this.#character + this.#misc + this.#improvement;
    }

    calculateCharacterPoints() {
        switch (this.#type) {
            case "Attribute":
                this.#characterPoints = this.#species + this.#character + this.#misc + this.#improvement - this.#baseStarting;
                return;

            case "Skill":
                this.#characterPoints = this.#species + this.#character + this.#misc + this.#improvement;
                return;

            case "Spec":
                this.#characterPoints = this.#species + this.#character + this.#misc + this.#improvement - this.#baseStarting;
                return;
        }

        this.#characterPoints = 0;
    }

    toJSON() {
        let json = {
            "Type": this.#type,
            "Name": this.#name,
            "Base": this.#base,
            "Species": this.#species,
            "Character": this.#character,
            "Misc": this.#misc,
            "improvement": this.#improvement
        };

        if (this.#baseStarting !== 0)
            json["BaseStarting"] = this.#baseStarting;

        if (this.#advancedSkill)
            json["AdvancedSkill"] = this.#advancedSkill;

        return json;
    }
}