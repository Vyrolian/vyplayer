import { dialog, ipcMain, OpenDialogOptions } from "electron";

const selectFolder = async (): Promise<string[] | undefined> => {
  const options: OpenDialogOptions = {
    title: "Select a folder",
    properties: ["openDirectory"],
  };
  const selectedPaths = await dialog.showOpenDialog(options);

  if (selectedPaths) {
    console.log(`Selected folder: ${selectedPaths.filePaths[0]}`);
    ipcMain.on("select-folder", (event: any) => {
      event.sender.send("selected-folder", selectedPaths.filePaths);
    });
    return selectedPaths.filePaths;
  }
  return undefined;
};

export { selectFolder };
