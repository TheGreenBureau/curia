import { stringKeys } from "@common/dataUtils";
import { ipcMain } from "electron";

const attachHandle = <
  T extends { [k: string]: (...args: any[]) => Promise<any> },
  K extends keyof T & string
>(
  handles: T,
  key: K
) => {
  ipcMain.handle(
    key,
    async (_event, ...p: Parameters<T[K]>) => await handles[key].apply(null, p)
  );
};

export function attachHandles<
  T extends { [k: string]: (...args: any[]) => Promise<any> }
>(handles: T) {
  const handleKeys = stringKeys(handles);
  handleKeys.forEach((key) => attachHandle(handles, key));
}
