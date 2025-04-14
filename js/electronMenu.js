import { app } from "electron";

export function buildMenuTemplate(mainWindow) {
    return [
        {
            label: "Character",
            submenu: [
                {
                    label: "New",
                    accelerator: process.platform === "darwin" ? "Command+N" : "Ctrl+N",
                    click() {
                        mainWindow.webContents.send("menu:newCharacter");
                    }
                },
                {
                    label: "Open...",
                    accelerator: process.platform === "darwin" ? "Command+O" : "Ctrl+O",
                    click() {
                        mainWindow.webContents.send("menu:openCharacter");
                    }
                },
                {
                    label: "Save",
                    accelerator: process.platform === "darwin" ? "Command+S" : "Ctrl+S",
                    click() {
                        mainWindow.webContents.send("menu:saveCharacter");
                    }
                },
                {
                    label: "Save As...",
                    accelerator: process.platform === "darwin" ? "Command+Shift+S" : "Ctrl+Shift+S",
                    click() {
                        mainWindow.webContents.send("menu:saveCharacterAs");
                    }
                },
                {
                    type: "separator"
                },
                {
                    label: "Exit",
                    click() {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: "Mode",
            submenu: [
                {
                    label: "View",
                    accelerator: "F5",
                    click() {
                        mainWindow.webContents.send("menu:switchMode", "view");
                    }
                },
                {
                    label: "Create",
                    accelerator: "F6",
                    click() {
                        mainWindow.webContents.send("menu:switchMode", "create");
                    }
                },
                {
                    label: "Advance",
                    accelerator: "F7",
                    click() {
                        mainWindow.webContents.send("menu:switchMode", "advance");
                    }
                }
            ]
        },
        {
            label: "DevTools",
            role: "toggleDevTools"
        }
    ];
}
