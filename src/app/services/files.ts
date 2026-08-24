import { apiClient } from "../api/api-client";

export type FileAsset = {
  id: string;
  slug: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  description: string;
  settings: Record<string, unknown>;
  downloadCount: number;
  shortUrl: string;
  createdAt: string;
};

export type FileDownload = {
  id: string;
  downloadedAt: string;
  browser?: string;
  device?: string;
  referrer?: string;
  country?: string;
  city?: string;
};

export async function listFiles(): Promise<FileAsset[]> {
  const data = await apiClient.get<unknown, { files: FileAsset[] }>("/files");
  return data.files ?? [];
}

export async function uploadFile(payload: {
  originalName: string;
  mimeType: string;
  base64: string;
  description?: string;
  settings?: Record<string, unknown>;
}): Promise<FileAsset> {
  const data = await apiClient.post<unknown, { file: FileAsset }>(
    "/files",
    payload,
  );
  return data.file;
}

export async function deleteFile(id: string): Promise<void> {
  await apiClient.delete(`/files/${id}`);
}

export async function updateFile(
  id: string,
  payload: {
    originalName?: string;
    slug?: string;
    description?: string;
    settings?: Record<string, unknown>;
  },
): Promise<FileAsset> {
  const data = await apiClient.put<unknown, { file: FileAsset }>(
    `/files/${id}`,
    payload,
  );
  return data.file;
}

export async function getFileStats(
  id: string,
): Promise<{ file: FileAsset; downloads: FileDownload[] }> {
  return apiClient.get<unknown, { file: FileAsset; downloads: FileDownload[] }>(
    `/files/${id}/stats`,
  );
}
