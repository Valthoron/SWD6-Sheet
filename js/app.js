let currentCharacter = null;
let statRowsMap = {};

// Update only the affected stats when a modifier changes
function updateAffectedStats(character, changedStatName) {
    // Find the stat that changed
    const changedStat = character.getStat(changedStatName);
    if (!changedStat) return;

    // Update the changed stat
    const changedRow = statRowsMap[changedStatName];
    if (changedRow) {
        changedRow.updateValue(pipsToDice(character.getStatTotal(changedStat)));
    }

    // Find and update any stats that depend on this one
    character.stats.forEach(stat => {
        if (stat.Base === changedStatName) {
            const row = statRowsMap[stat.Name];
            if (row) {
                row.updateValue(pipsToDice(character.getStatTotal(stat)));

                // Recursively update any stats that depend on this one
                updateAffectedStats(character, stat.Name);
            }
        }
    });
}

function calculateStatTotals(character, rows) {
    character.stats.forEach(stat => {
        const total = character.getStatTotal(stat);
        const row = rows[stat.Name];

        if (row) {
            // Update the main stat value
            row.updateValue(pipsToDice(total));

            // Update the modifier row displays
            for (const modType of ["Species", "Character", "Misc"]) {
                const modRow = row.modifierRows[modType];
                if (modRow) {
                    modRow.setValue(stat[modType]);
                }
            }
        }
    });
}

async function loadCharacterData(url) {
    try {
        const response = await fetch('data/' + url);
        const data = await response.json();
        currentCharacter = new Character(data);
        return currentCharacter;
    } catch (error) {
        console.error('Error loading character data:', error);
        throw error;
    }
}

function processCharacterStats(character, statView) {
    const templates = Templates.getInstance();
    const statRowTemplate = templates.get('statRow');
    const modifierRowTemplate = templates.get('statModifierRow');
    const rows = {};

    character.stats.forEach(element => {
        let row = null;

        switch (element.Type) {
            case "Attribute":
                row = new StatRow(statRowTemplate);
                row.setId("attribute-" + element.Name);
                row.setName(element.Name);

                // Add modifier rows with references to their stat
                const speciesRow = row.addModifierRow("Species", modifierRowTemplate, element.Name);
                speciesRow.setValue(element.Species);
                speciesRow.setupEventListeners(character);

                const characterRow = row.addModifierRow("Character", modifierRowTemplate, element.Name);
                characterRow.setValue(element.Character);
                characterRow.setupEventListeners(character);

                const miscRow = row.addModifierRow("Misc", modifierRowTemplate, element.Name);
                miscRow.setValue(element.Misc);
                miscRow.setupEventListeners(character);

                statView.appendChild(row);
                rows[element.Name] = row;
                break;

            case "Skill":
                row = new SkillRow(statRowTemplate);
                row.setId("skill-" + element.Name);
                row.setName(element.Name);

                // Add modifier rows with references to their stat
                const skillSpeciesRow = row.addModifierRow("Species", modifierRowTemplate, element.Name);
                skillSpeciesRow.setValue(element.Species);
                skillSpeciesRow.setupEventListeners(character);

                const skillCharacterRow = row.addModifierRow("Character", modifierRowTemplate, element.Name);
                skillCharacterRow.setValue(element.Character);
                skillCharacterRow.setupEventListeners(character);

                const skillMiscRow = row.addModifierRow("Misc", modifierRowTemplate, element.Name);
                skillMiscRow.setValue(element.Misc);
                skillMiscRow.setupEventListeners(character);

                let attributeRow = rows[element.Base];
                attributeRow.appendChild(row);
                rows[element.Name] = row;
                break;

            case "Specialization":
                row = new SpecRow(statRowTemplate);
                row.setId("spec-" + element.Name);
                row.setName(element.Name);

                // Add modifier rows with references to their stat
                const specSpeciesRow = row.addModifierRow("Species", modifierRowTemplate, element.Name);
                specSpeciesRow.setValue(element.Species);
                specSpeciesRow.setupEventListeners(character);

                const specCharacterRow = row.addModifierRow("Character", modifierRowTemplate, element.Name);
                specCharacterRow.setValue(element.Character);
                specCharacterRow.setupEventListeners(character);

                const specMiscRow = row.addModifierRow("Misc", modifierRowTemplate, element.Name);
                specMiscRow.setValue(element.Misc);
                specMiscRow.setupEventListeners(character);

                let skillRow = rows[element.Base];
                skillRow.appendChild(row);
                rows[element.Name] = row;
                break;
        }
    });

    // Store rows globally for updates
    statRowsMap = rows;
    return rows;
}

// Fill sheet after DOM loads
document.addEventListener("DOMContentLoaded", async () => {
    const statView = new View(document.getElementById('stat-view'));
    Templates.getInstance().initialize();

    try {
        const character = await loadCharacterData('hecreus.json');
        const rows = processCharacterStats(character, statView);
        calculateStatTotals(character, rows);
    } catch (error) {
        console.error('Failed to load character sheet:', error);
    }
});
