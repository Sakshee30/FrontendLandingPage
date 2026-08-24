import { createSetting, deleteSetting, listSettings, updateSetting, WorkspaceSetting } from "./settings";

export type LinkFolder = WorkspaceSetting & { type: "folder" };

export async function listFolders(): Promise<LinkFolder[]> {
  const settings = await listSettings("folder");
  return settings as LinkFolder[];
}

export async function createFolderSetting(name: string): Promise<LinkFolder> {
  return createSetting("folder", { name, config: { color: "#2F80ED" } }) as Promise<LinkFolder>;
}

export async function renameFolderSetting(id: string, name: string, config: Record<string, unknown> = {}): Promise<LinkFolder> {
  return updateSetting(id, { name, config }) as Promise<LinkFolder>;
}

export async function deleteFolderSetting(id: string): Promise<void> {
  await deleteSetting(id);
}
