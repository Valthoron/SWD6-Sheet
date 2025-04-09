export class Templates {
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
        this.#addTemplate("statRow", "template-stat-row");
        this.#addTemplate("statModifierRow", "template-stat-modifier-row");
    }

    #addTemplate(templateName, elementId) {
        const template = document.getElementById(elementId);
        template.removeAttribute("id");
        template.remove();
        this.#templates.set(templateName, template);
    }

    get(templateName) {
        const template = this.#templates.get(templateName);

        if (!template) {
            throw new Error(`Template "${templateName}" not found`);
        }

        const element = template.cloneNode(true);

        element.querySelectorAll("[id]").forEach(child => {
            child.removeAttribute("id");
        });

        return element;
    }

    getWithChildMap(templateName) {
        const template = this.#templates.get(templateName);

        if (!template) {
            throw new Error(`Template "${templateName}" not found`);
        }

        const element = template.cloneNode(true);

        const childMap = new Map();

        element.querySelectorAll("[id]").forEach(child => {
            const id = child.getAttribute("id");
            childMap.set(id, child);
            child.removeAttribute("id");
        });

        return [element, childMap];
    }
}
