const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startProjects: () => ipcRenderer.invoke('start-projects'),
  openLink: (route) => ipcRenderer.send("open-link", route)
});
