export class CharacterStat {
    #type = "";
    #name = "";
    #base = "";

    #species = 0;
    #character = 0;
    #misc = 0;
    #advancement = 0;

    #total = 0;
    #characterPoints = 0;

    constructor(data = {}) {
        this.#name = data.Name;
        this.#type = data.Type;
        this.#base = data.Base || "";

        this.#species = data.Species || 0;
        this.#character = data.Character || 0;
        this.#misc = data.Misc || 0;
        this.#advancement = data.Advancement || 0;
    }

    get Name() { return this.#name; }
    get Type() { return this.#type; }
    get Base() { return this.#base; }

    get Species() { return this.#species; }
    set Species(value) { this.#species = value; }

    get Character() { return this.#character; }
    set Character(value) { this.#character = value; }

    get Misc() { return this.#misc; }
    set Misc(value) { this.#misc = value; }

    get Advancement() { return this.#advancement; }
    set Advancement(value) { this.#advancement = value; }

    get Total() { return this.#total; }
    get CharacterPoints() { return this.#characterPoints; }

    calculateTotal(baseTotal) {
        this.#total = baseTotal + this.#species + this.#character + this.#misc + this.#advancement;
    }

    calculateCharacterPoints() {
        this.#characterPoints = 0;
    }

    toJSON() {
        return {
            Type: this.#type,
            Name: this.#name,
            Base: this.#base,
            Species: this.#species,
            Character: this.#character,
            Misc: this.#misc,
            Advancement: this.#advancement
        };
    }
}