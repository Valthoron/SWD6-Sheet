import { SheetController } from "./controllers/SheetController.js";
import { Character } from "./models/Character.js";
import { ModeHandler } from "./utils/ModeHandler.js";

document.addEventListener("DOMContentLoaded", async () => {
    new ModeHandler().initialize();

    try {
        const character = await Character.fromData("hecreus.json");

        const statView = document.getElementById("stat-view");
        const navBar = document.getElementById("nav-bar");
        const statusBar = document.getElementById("status-bar");

        new SheetController(character, statView, navBar, statusBar).initialize();

        const saveButton = document.getElementById("nav-action-save");
        saveButton.addEventListener("click", () => character.downloadAsJson());
    } catch (error) {
        console.error("Failed to load character sheet:", error);
    }
});
