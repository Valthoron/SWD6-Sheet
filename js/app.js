import { SheetController } from './controllers/SheetController.js';
import { Character } from './models/Character.js';
import { ModeHandler } from './utils/ModeHandler.js';

document.addEventListener("DOMContentLoaded", async () => {
    // Initialize the mode handler
    const modeHandler = new ModeHandler();
    modeHandler.initialize();

    try {
        const character = await Character.fromData('hecreus.json');
        const statView = document.getElementById('stat-view');
        const sheet = new SheetController(character, statView).initialize();
    } catch (error) {
        console.error('Failed to load character sheet:', error);
    }
});
