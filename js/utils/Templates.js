class Templates {
    static #instance = null;
    #templates = new Map();

    static getInstance() {
        if (!Templates.#instance) {
            Templates.#instance = new Templates();
            Templates.#instance.#initialize();
        }

        return Templates.#instance;
    }

    #initialize() {
        this.#templates.set('statRow', document.getElementById('template-stat-row'));
        this.#templates.set('statModifierRow', document.getElementById('template-stat-modifier-row'));
    }

    get(templateName) {
        const template = this.#templates.get(templateName);

        if (!template) {
            throw new Error(`Template '${templateName}' not found`);
        }

        return template;
    }
}
