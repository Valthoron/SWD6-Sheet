import { SheetController } from "./controllers/SheetController.js";
import { Character } from "./models/Character.js";
import { ModeHandler } from "./utils/ModeHandler.js";
import { Templates } from "./utils/Templates.js";

// TODO: These globals, sheet controller and sheet html are a mess right now
// Considering multiple sheets with tabs
let G_character = null;
let G_modeHandler = null;
let G_sheetController = null;
let G_navBar = null;
let G_statView = null;
let G_statusBar = null;

document.addEventListener("DOMContentLoaded", async () => {
    Templates.register("statRow", document.getElementById("template-stat-row"));
    Templates.register("statModifierRow", document.getElementById("template-stat-modifier-row"));

    G_modeHandler = new ModeHandler().initialize();

    G_navBar = document.getElementById("navbar");
    G_statView = document.getElementById("stat-view");
    G_statusBar = document.getElementById("status-bar");

    const newButton = document.getElementById("nav-action-new");
    newButton.addEventListener("click", () => newCharacter());

    const openButton = document.getElementById("nav-action-open");
    openButton.addEventListener("click", () => uploadCharacter());

    const saveButton = document.getElementById("nav-action-save");
    saveButton.addEventListener("click", () => downloadCharacter());

    if (window.electron)
        setupElectron();

    const characterData = await fetch("../data/hecreus.json").then(response => response.json())
    const character = Character.fromData(characterData);
    loadSheet(character);
});

function setupElectron() {
    // Menu item events
    window.electron.onMenuNewCharacter(() => {
        newCharacter();
    });

    window.electron.onMenuOpenCharacter(() => {
        openCharacter();
    });

    window.electron.onMenuSaveCharacter(() => {
        saveCharacter();
    });

    window.electron.onMenuSaveCharacterAs(() => {
        saveCharacterAs();
    });

    window.electron.onMenuSwitchMode((event, mode) => {
        G_modeHandler.switchMode(mode);
    });

    // Clean up event listeners when window is closed
    window.addEventListener("beforeunload", () => {
        window.electron.removeAllListeners();
    });
}

function loadSheet(character) {
    G_statView.innerHTML = "";
    G_character = character;
    G_sheetController = new SheetController(G_character, G_navBar, G_statView, G_statusBar).initialize();
    G_modeHandler.switchMode("view");
}

// ********************************************************************************
// Common handlers

// New character
function newCharacter() {
    const character = Character.createDefault();
    loadSheet(character);
}

// ********************************************************************************
// Web handlers

// Open character (web)
async function uploadCharacter() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    // Create a promise to handle the file selection
    const fileSelectedPromise = new Promise((resolve) => {
        fileInput.addEventListener("change", (event) => {
            if (event.target.files.length > 0)
                resolve(event.target.files[0]);
            else
                resolve(null);
        });

        fileInput.addEventListener("cancel", () => {
            resolve(null);
        });
    });

    fileInput.click();

    const file = await fileSelectedPromise;

    if (!file)
        return;

    const fileContent = await file.text();
    const characterData = JSON.parse(fileContent);
    const character = Character.fromData(characterData);
    loadSheet(character);
}

// Save character (web)
function downloadCharacter() {
    const characterData = G_character.getData();
    const blob = new Blob([characterData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const fileName = `${G_character.Name || "character"}.json`;
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ********************************************************************************
// Electron handlers

// New character (Electron)

// Open character (Electron)
async function openCharacter() {
    const result = await window.electron.openCharacter();

    if (!result)
        return;

    const characterData = JSON.parse(result.content);
    const character = await Character.fromData(characterData);
    loadSheet(character);
}

// Save character (Electron)
async function saveCharacter() {
    await saveCharacterAs(); // TODO
}

// Save character as (Electron)
async function saveCharacterAs() {
    const fileName = `${G_character.Name || "character"}.json`;
    const characterData = G_character.getData();
    await window.electron.saveCharacter(fileName, characterData);
}