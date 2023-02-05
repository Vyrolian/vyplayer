import { channel } from "diagnostics_channel";
import { contextBridge, ipcRenderer, dialog } from "electron";

/*contextBridge.exposeInMainWorld("electronAPI", {
  showOpenDialog: () => ipcRenderer.invoke("dialog:openFile"),
});*/
contextBridge.exposeInMainWorld("electronAPI", {
  showOpenDialog: () => {
    ipcRenderer.send("dialog:openFile"); // adjust naming for your project
  },
  // Provide an easier way to listen to events
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  },
});
