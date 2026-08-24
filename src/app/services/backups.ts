import { apiClient } from "../api/api-client";

export type BackupStatus = {
  backupDir: string;
  remoteBackupDir: string;
  retentionDays: number;
  encrypted: boolean;
  scheduled: boolean;
  scheduleTime: string;
};

export type BackupFile = {
  name: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  encrypted: boolean;
  kind: "postgres" | "json";
};

export async function getBackupStatus(): Promise<BackupStatus> {
  const data = await apiClient.get<unknown, { status: BackupStatus }>(
    "/backups/status",
  );
  return data.status;
}

export async function listBackups(): Promise<BackupFile[]> {
  const data = await apiClient.get<unknown, { backups: BackupFile[] }>(
    "/backups",
  );
  return data.backups ?? [];
}

export async function createBackup(): Promise<BackupFile[]> {
  const data = await apiClient.post<unknown, { backups: BackupFile[] }>(
    "/backups",
  );
  return data.backups ?? [];
}

export async function restoreBackup(name: string): Promise<void> {
  await apiClient.post(`/backups/${encodeURIComponent(name)}/restore`);
}
