class View {
    constructor(element) {
        this.element = element;
    }

    appendChild(child) {
        this.element.appendChild(child.element);
    }
}

class StatRow extends View {
    constructor(templateElement) {
        super(templateElement.cloneNode(true));
        this.nameElement = this.element.querySelector('.stat-row-name');
    }

    setId(id) {
        this.element.id = id;
    }

    setName(name) {
        this.nameElement.textContent = name;
    }
}

class SkillRow extends StatRow {
    constructor(templateElement) {
        super(templateElement);
        this.nameElement.classList.add('stat-row-name-skill');
    }
}

class SpecRow extends StatRow {
    constructor(templateElement) {
        super(templateElement);
        this.nameElement.classList.add('stat-row-name-spec');
    }
}

function pipsToDice(totalPips) {
    let dice = Math.floor(totalPips / 3);
    let pips = totalPips % 3;

    if (pips === 0)
        return dice + "D";

    return dice + "D+" + pips;
}

function calculateStatTotals(character) {

}

// Fill sheet after DOM loads
document.addEventListener("DOMContentLoaded", () => {
    const statView = new View(document.getElementById('stat-view'));
    const statRowTemplate = document.getElementById('template-stat-row');
    const statModifierRowTemplate = document.getElementById('template-stat-modifier-row');

    fetch('hecreus.json')
        .then(response => { return response.json(); })
        .then(data => {
            let rows = [];

            data.Stats.forEach(element => {
                let row = null

                switch (element.Type) {
                    case "Attribute":
                        row = new StatRow(statRowTemplate);
                        row.setId("attribute-" + element.Name);
                        row.setName(element.Name);

                        statView.appendChild(row);

                        rows[element.Name] = row;
                        break;

                    case "Skill":
                        row = new SkillRow(statRowTemplate);
                        row.setId("skill-" + element.Name);
                        row.setName(element.Name);

                        let attributeRow = rows[element.Base];
                        attributeRow.appendChild(row);

                        rows[element.Name] = row;
                        break;

                    case "Specialization":
                        row = new SpecRow(statRowTemplate);
                        row.setId("spec-" + element.Name);
                        row.setName(element.Name);

                        let skillRow = rows[element.Base];
                        skillRow.appendChild(row);

                        rows[element.Name] = row;
                        break;
                }

                if (row !== null) {

                }
            });
        });
});