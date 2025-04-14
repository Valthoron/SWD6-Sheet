import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { buildMenuTemplate } from "./electronMenu.js";

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 900,
        webPreferences: {
            preload: join(import.meta.dirname, "electronPreload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile("html/editor.html");

    const menuTemplate = buildMenuTemplate(mainWindow);
    const menu = Menu.buildFromTemplate(menuTemplate);

    Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
    createMainWindow();

    // macOS: Recreate main window when the dock icon is clicked and there are no other windows open
    if (process.platform === "darwin") {
        app.on("activate", function () {
            if (BrowserWindow.getAllWindows().length === 0)
                createMainWindow();
        });
    }
});

app.on("window-all-closed", function () {
    // macOS: Keep app running even when all windows are closed
    if (process.platform !== "darwin")
        app.quit();
});


// ********************************************************************************
// IPC Handlers

ipcMain.handle("dialog:openCharacter", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: [
            { name: "Character Files", extensions: ["json"] }
        ]
    });

    if (canceled)
        return null;

    return {
        filePath: filePaths[0],
        content: readFileSync(filePaths[0], "utf8")
    };
});

ipcMain.handle("dialog:saveCharacter", async (event, fileName, characterData) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        defaultPath: fileName,
        filters: [
            { name: "Character Files", extensions: ["json"] }
        ],
        properties: ["showOverwriteConfirmation"]
    });

    if (canceled)
        return;

    writeFileSync(filePath, characterData, "utf8");
});
