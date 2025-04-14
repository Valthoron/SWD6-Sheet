const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    // Functions
    openCharacter: () => ipcRenderer.invoke("dialog:openCharacter"),
    saveCharacter: (fileName, characterData) => ipcRenderer.invoke("dialog:saveCharacter", fileName, characterData),

    removeAllListeners: () => ipcRenderer.removeAllListeners(),

    // Menu item events
    onMenuNewCharacter: (callback) => ipcRenderer.on("menu:newCharacter", callback),
    onMenuOpenCharacter: (callback) => ipcRenderer.on("menu:openCharacter", callback),
    onMenuSaveCharacter: (callback) => ipcRenderer.on("menu:saveCharacter", callback),
    onMenuSaveCharacterAs: (callback) => ipcRenderer.on("menu:saveCharacterAs", callback),
    onMenuSwitchMode: (callback) => ipcRenderer.on("menu:switchMode", callback)
});
