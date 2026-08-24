import { apiClient } from "../api/api-client";

export type SettingType =
  | "domain"
  | "pixel"
  | "utm"
  | "api_key"
  | "webhook"
  | "privacy"
  | "billing"
  | "channel"
  | "qr_template"
  | "folder";

export type WorkspaceSetting = {
  id: string;
  workspaceId: string;
  type: SettingType;
  name: string;
  status: string;
  config: Record<string, unknown>;
  secret?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WebhookDelivery = {
  id: string;
  webhookId: string;
  event: string;
  targetUrl: string;
  status: string;
  statusCode?: number | null;
  error?: string;
  payload?: Record<string, unknown>;
  createdAt: string;
};

export async function listSettings(
  type: SettingType,
): Promise<WorkspaceSetting[]> {
  const data = await apiClient.get<unknown, { settings: WorkspaceSetting[] }>(
    `/settings/${type}`,
  );
  return data.settings ?? [];
}

export async function createSetting(
  type: SettingType,
  payload: { name: string; status?: string; config?: Record<string, unknown> },
) {
  const data = await apiClient.post<unknown, { setting: WorkspaceSetting }>(
    `/settings/${type}`,
    payload,
  );
  return data.setting;
}

export async function updateSetting(
  id: string,
  payload: { name?: string; status?: string; config?: Record<string, unknown> },
) {
  const data = await apiClient.put<unknown, { setting: WorkspaceSetting }>(
    `/settings/items/${id}`,
    payload,
  );
  return data.setting;
}

export async function deleteSetting(id: string) {
  await apiClient.delete(`/settings/items/${id}`);
}

export async function verifyDomainSetting(id: string) {
  const data = await apiClient.post<
    unknown,
    {
      setting: WorkspaceSetting;
      verified: boolean;
      records: string[];
      expectedTarget: string;
      verificationToken?: string;
    }
  >(`/settings/items/${id}/verify-domain`);
  return data;
}

export async function listWebhookDeliveries(
  webhookId = "",
): Promise<WebhookDelivery[]> {
  const data = await apiClient.get<unknown, { deliveries: WebhookDelivery[] }>(
    "/settings/webhooks/deliveries/logs",
    { params: webhookId ? { webhookId } : {} },
  );
  return data.deliveries ?? [];
}

export async function getWebhookDelivery(id: string): Promise<WebhookDelivery> {
  const data = await apiClient.get<unknown, { delivery: WebhookDelivery }>(
    `/settings/webhooks/deliveries/${id}`,
  );
  return data.delivery;
}

export async function retryWebhookDelivery(
  id: string,
): Promise<WebhookDelivery> {
  const data = await apiClient.post<unknown, { delivery: WebhookDelivery }>(
    `/settings/webhooks/deliveries/${id}/retry`,
  );
  return data.delivery;
}

export async function testWebhook(id: string): Promise<WebhookDelivery> {
  const data = await apiClient.post<unknown, { delivery: WebhookDelivery }>(
    `/settings/webhooks/${id}/test`,
  );
  return data.delivery;
}
