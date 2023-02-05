export interface IElectronAPI {
  send(arg0: string, path: any): unknown;
  on(arg0: string, arg1: (path: any) => void): unknown;
  showOpenDialog: () => Promise<{ canceled: boolean; filePaths: string[] }>;
  openFile: () => Promise<{ canceled: boolean; filePaths: string[] }>;

  loadPreferences: () => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
