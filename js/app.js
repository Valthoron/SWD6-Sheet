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

    // Helper function to create and configure a row
    function createStatRow(statElement, rowClass) {
        const row = new rowClass(statRowTemplate);
        row.setId(statElement.Type.toLowerCase() + "-" + statElement.Name);
        row.setName(statElement.Name);

        // Add modifier rows with references to their stat
        const modTypes = ["Species", "Character", "Misc"];
        modTypes.forEach(modType => {
            const modRow = row.addModifierRow(modType, modifierRowTemplate, statElement.Name);
            modRow.setValue(statElement[modType]);
            modRow.setupEventListeners(character);
        });

        rows[statElement.Name] = row;
        return row;
    }

    character.stats.forEach(element => {
        let row = null;

        switch (element.Type) {
            case "Attribute":
                row = createStatRow(element, StatRow);
                statView.appendChild(row);
                break;

            case "Skill":
                row = createStatRow(element, SkillRow);
                let attributeRow = rows[element.Base];
                attributeRow.appendChild(row);
                break;

            case "Specialization":
                row = createStatRow(element, SpecRow);
                let skillRow = rows[element.Base];
                skillRow.appendChild(row);
                break;
        }
    });

    // Store rows globally for updates
    statRowsMap = rows;
    return rows;
}

// Fill sheet after DOM loads
document.addEventListener("DOMContentLoaded", async () => {
    Templates.getInstance().initialize();

    // Initialize the mode handler
    const modeHandler = new ModeHandler();
    modeHandler.initialize();

    const statView = new View(document.getElementById('stat-view'));

    try {
        const character = await loadCharacterData('hecreus.json');
        const rows = processCharacterStats(character, statView);
        calculateStatTotals(character, rows);
    } catch (error) {
        console.error('Failed to load character sheet:', error);
    }
});
