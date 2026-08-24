import { apiClient } from "../api/api-client";

export type Campaign = {
  id: string;
  workspaceId: string;
  name: string;
  source: string;
  medium: string;
  status: "active" | "paused" | "draft";
  goal: number;
  clicks: number;
  links: number;
  createdAt: string;
  updatedAt: string;
};

export type CampaignPayload = {
  name: string;
  source: string;
  medium: string;
  status: Campaign["status"];
  goal: number;
  selectedLinkIds?: string[];
};

export async function listCampaigns(): Promise<Campaign[]> {
  const data = await apiClient.get<unknown, { campaigns: Campaign[] }>(
    "/campaigns",
  );
  return data.campaigns ?? [];
}

export async function createCampaign(
  payload: CampaignPayload,
): Promise<Campaign> {
  const data = await apiClient.post<unknown, { campaign: Campaign }>(
    "/campaigns",
    payload,
  );
  return data.campaign;
}

export async function updateCampaign(
  id: string,
  payload: CampaignPayload,
): Promise<Campaign> {
  const data = await apiClient.put<unknown, { campaign: Campaign }>(
    `/campaigns/${id}`,
    payload,
  );
  return data.campaign;
}

export async function deleteCampaign(id: string): Promise<void> {
  await apiClient.delete(`/campaigns/${id}`);
}
