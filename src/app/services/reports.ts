import { apiClient } from "../api/api-client";

export async function enablePublicReport(
  linkId: string,
  payload: { enabled?: boolean; password?: string; expiresAt?: string } = {},
): Promise<{ publicUrl: string; token: string; enabled: boolean }> {
  return apiClient.post<
    unknown,
    { publicUrl: string; token: string; enabled: boolean }
  >(`/reports/links/${linkId}/public-report`, {
    enabled: payload.enabled ?? true,
    password: payload.password || "",
    expiresAt: payload.expiresAt || "",
  });
}

export async function getLinkActivity(
  linkId: string,
): Promise<{ clicks: unknown[] }> {
  return apiClient.get<unknown, { clicks: unknown[] }>(
    `/reports/links/${linkId}/activity`,
  );
}
