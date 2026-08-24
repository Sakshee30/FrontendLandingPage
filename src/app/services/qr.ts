import { apiClient } from "../api/api-client";

export type QrCodeRecord = {
  id: string;
  workspaceId: string;
  linkId?: string | null;
  name: string;
  qrType: string;
  destinationUrl: string;
  qrUrl?: string;
  shortUrl?: string | null;
  dynamic: boolean;
  design: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export async function listQrCodes(): Promise<QrCodeRecord[]> {
  const data = await apiClient.get<unknown, { qrCodes: QrCodeRecord[] }>(
    "/qr",
  );
  return data.qrCodes ?? [];
}

export async function createQrCode(payload: {
  name: string;
  qrType: string;
  destinationUrl: string;
  dynamic: boolean;
  design?: Record<string, unknown>;
}) {
  const data = await apiClient.post<unknown, { qrCode: QrCodeRecord }>(
    "/qr",
    payload,
  );
  return data.qrCode;
}

export async function updateQrCode(
  id: string,
  payload: {
    name: string;
    qrType: string;
    destinationUrl: string;
    dynamic: boolean;
    design?: Record<string, unknown>;
  },
) {
  const data = await apiClient.put<unknown, { qrCode: QrCodeRecord }>(
    `/qr/${id}`,
    payload,
  );
  return data.qrCode;
}

export async function deleteQrCode(id: string) {
  await apiClient.delete(`/qr/${id}`);
}
