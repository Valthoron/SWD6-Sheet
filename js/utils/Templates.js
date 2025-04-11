export class Templates {
    static #instance = null;

    #templates = new Map();

    static #getInstance() {
        if (!Templates.#instance) {
            Templates.#instance = new Templates();
        }

        return Templates.#instance;
    }

    static register(name, template) {
        template.removeAttribute("id");
        template.remove();

        Templates.#getInstance().#templates.set(name, template);
    }

    static getNames() {
        return Array.from(getInstance().#templates.keys());
    }

    static instantiate(templateName) {
        const template = Templates.#getInstance().#templates.get(templateName);

        if (!template)
            throw new Error(`Template "${templateName}" not found`);

        const element = template.cloneNode(true);

        element.querySelectorAll("[id]").forEach(child => {
            child.removeAttribute("id");
        });

        return element;
    }

    static instantiateWithChildMap(templateName) {
        const template = Templates.#getInstance().#templates.get(templateName);

        if (!template)
            throw new Error(`Template "${templateName}" not found`);

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
