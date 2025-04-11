import { Templates } from "./utils/Templates.js";
import { SheetController } from "./controllers/SheetController.js";
import { Character } from "./models/Character.js";
import { ModeHandler } from "./utils/ModeHandler.js";

document.addEventListener("DOMContentLoaded", async () => {
    Templates.register("statRow", document.getElementById("template-stat-row"));
    Templates.register("statModifierRow", document.getElementById("template-stat-modifier-row"));

    new ModeHandler().initialize();

    const nameLabel = document.getElementById("nav-name-label");

    const statView = document.getElementById("stat-view");
    const navBar = document.getElementById("nav-bar");
    const statusBar = document.getElementById("status-bar");

    const saveButton = document.getElementById("nav-action-save");

    try {
        const character = await Character.fromData("hecreus.json");
        saveButton.addEventListener("click", () => character.downloadAsJson());
        new SheetController(character, nameLabel, statView, statusBar).initialize();
    } catch (error) {
        console.error("Failed to load character sheet:", error);
    }
});
