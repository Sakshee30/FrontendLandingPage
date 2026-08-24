import { apiClient } from "../api/api-client";

export type BioWidget = {
  type: "link" | "text" | "social" | string;
  label?: string;
  url?: string;
  color?: string;
  textColor?: string;
  content?: string;
};

export type BioPage = {
  id: string;
  workspaceId: string;
  slug: string;
  title: string;
  bio: string;
  theme: string;
  avatarUrl?: string | null;
  customDomain?: string | null;
  widgets: BioWidget[];
  settings: Record<string, unknown>;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BioPagePayload = {
  slug?: string;
  title: string;
  bio: string;
  theme: string;
  avatarUrl?: string | null;
  customDomain?: string | null;
  widgets: BioWidget[];
  settings?: Record<string, unknown>;
  published?: boolean;
};

export async function listBioPages(): Promise<BioPage[]> {
  const data = await apiClient.get<unknown, { bioPages: BioPage[] }>(
    "/bio-pages",
  );
  return data.bioPages ?? [];
}

export async function createBioPage(payload: BioPagePayload): Promise<BioPage> {
  const data = await apiClient.post<unknown, { bioPage: BioPage }>(
    "/bio-pages",
    payload,
  );
  return data.bioPage;
}

export async function updateBioPage(
  id: string,
  payload: BioPagePayload,
): Promise<BioPage> {
  const data = await apiClient.put<unknown, { bioPage: BioPage }>(
    `/bio-pages/${id}`,
    payload,
  );
  return data.bioPage;
}

export async function deleteBioPage(id: string): Promise<void> {
  await apiClient.delete(`/bio-pages/${id}`);
}

export type DomainCheckResult = {
  status: "verified" | "wrong" | "no_cname" | "not_found" | "none";
  domain?: string;
  cname?: string;
  addresses?: string[];
  cnameTarget?: string;
  message: string;
};

export async function checkBioDomain(id: string): Promise<DomainCheckResult> {
  return apiClient.get<unknown, DomainCheckResult>(`/bio-pages/${id}/check-domain`);
}
