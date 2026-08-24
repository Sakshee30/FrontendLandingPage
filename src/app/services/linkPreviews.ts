import { apiClient } from "../api/api-client";

export type LinkPreviewSite = {
  id: string;
  domain: string;
  scriptKey: string;
  placement: string;
  status: string;
  createdAt: string;
};

export async function listPreviewSites(): Promise<LinkPreviewSite[]> {
  const data = await apiClient.get<unknown, { sites: LinkPreviewSite[] }>(
    "/link-previews",
  );
  return data.sites ?? [];
}

export async function createPreviewSite(payload: {
  domain: string;
  placement?: string;
}): Promise<LinkPreviewSite> {
  const data = await apiClient.post<unknown, { site: LinkPreviewSite }>(
    "/link-previews",
    payload,
  );
  return data.site;
}

export async function deletePreviewSite(id: string): Promise<void> {
  await apiClient.delete(`/link-previews/${id}`);
}
