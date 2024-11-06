class StatRow {
    constructor(templateElement) {
        this.element = templateElement.cloneNode(true);
    }

    setText(text) {
        const paragraph = this.element.querySelector('p');
        if (paragraph) {
            paragraph.textContent = text;
        }
    }

    appendTo(parent) {
        parent.appendChild(this.element);
    }

    setId(id) {
        this.element.id = id;
    }
}

// Fill sheet after DOM loads
document.addEventListener("DOMContentLoaded", () => {
    const statView = document.getElementById('stat-view');
    const statRowTemplate = document.getElementById('template-stat-row');
    const statModifierRowTemplate = document.getElementById('template-stat-modifier-row');
    const statRow = new StatRow(statRowTemplate);
    statView.appendChild(statRow.element);
    const statRow2 = new StatRow(statRowTemplate);
    statView.appendChild(statRow2.element);
    statRow2.element.querySelector('.stat-row-name').textContent = 'Strength';
});