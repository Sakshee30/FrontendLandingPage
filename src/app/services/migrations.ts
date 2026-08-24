import { apiClient } from "../api/api-client";

export type MigrationProvider =
  | "bitly"
  | "rebrandly"
  | "shortio"
  | "switchy"
  | "csv"
  | "public_resolver"
  | "custom_domain";

export type MigrationMode =
  | "provider_api"
  | "csv"
  | "public_resolver"
  | "custom_domain";

export type MigrationJob = {
  id: string;
  workspaceId: string;
  provider: MigrationProvider;
  mode: MigrationMode;
  status: string;
  cutoverStatus: string;
  sourceAccount?: string;
  options?: Record<string, any>;
  totals?: Record<string, number>;
  errorSummary?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

export type MigrationItem = {
  id: string;
  sourceUrl?: string;
  sourceDomain?: string;
  sourceSlug?: string;
  targetUrl?: string;
  status: string;
  conflictStrategy?: string;
  error?: string;
  normalizedData?: {
    title?: string;
    destinationUrl?: string;
    slug?: string;
    shortDomain?: string | null;
    settings?: Record<string, any>;
  };
};

export type MigrationDomain = {
  id: string;
  domain: string;
  status: string;
  dnsTarget?: string;
  verificationToken?: string;
  error?: string;
};

export type MigrationDetails = {
  job: MigrationJob;
  items: MigrationItem[];
  domains: MigrationDomain[];
};

export type MigrationLinkInput = {
  shortUrl?: string;
  sourceUrl?: string;
  title?: string;
  destinationUrl?: string;
  slug?: string;
  shortDomain?: string | null;
  domain?: string;
  folder?: string;
  tags?: string[] | string;
  notes?: string;
  clicks?: number;
  createdDate?: string;
  utm?: Record<string, string>;
  redirectStatus?: 301 | 302 | 307;
};

export async function listMigrations(): Promise<MigrationJob[]> {
  const data = await apiClient.get<unknown, { jobs: MigrationJob[] }>("/migrations");
  return data.jobs ?? [];
}

export async function createMigration(payload: {
  provider: MigrationProvider;
  mode: MigrationMode;
  sourceAccount?: string;
  targetDomain?: string;
  credentials?: Record<string, unknown>;
  options?: Record<string, unknown>;
}): Promise<MigrationJob> {
  const data = await apiClient.post<unknown, { job: MigrationJob }>("/migrations", payload);
  return data.job;
}

export async function getMigration(id: string): Promise<MigrationDetails> {
  return apiClient.get<unknown, MigrationDetails>(`/migrations/${id}`);
}

export async function preflightMigration(
  id: string,
  payload: {
    sourceLinks?: string[];
    links?: MigrationLinkInput[];
    domain?: string;
    targetDomain?: string;
  },
): Promise<MigrationDetails> {
  return apiClient.post<unknown, MigrationDetails>(`/migrations/${id}/preflight`, payload, { timeout: 120000 });
}

export async function startMigration(id: string): Promise<MigrationDetails> {
  return apiClient.post<unknown, MigrationDetails>(`/migrations/${id}/start`, {}, { timeout: 120000 });
}

export async function resolveMigrationItems(
  id: string,
  resolutions: Array<{ itemId: string; action: "skip" | "rename" | "replace"; slug?: string }>,
): Promise<MigrationDetails> {
  return apiClient.post<unknown, MigrationDetails>(`/migrations/${id}/resolve`, { resolutions }, { timeout: 120000 });
}

export async function pauseMigration(id: string): Promise<{ job: MigrationJob }> {
  return apiClient.post<unknown, { job: MigrationJob }>(`/migrations/${id}/pause`, {});
}

export async function resumeMigration(id: string): Promise<MigrationDetails> {
  return apiClient.post<unknown, MigrationDetails>(`/migrations/${id}/resume`, {}, { timeout: 120000 });
}

export async function verifyCutover(id: string): Promise<{
  job: MigrationJob;
  missing: MigrationItem[];
  domains: MigrationDomain[];
}> {
  return apiClient.post<unknown, { job: MigrationJob; missing: MigrationItem[]; domains: MigrationDomain[] }>(
    `/migrations/${id}/cutover/verify`,
    {},
  );
}

export async function completeCutover(id: string): Promise<{
  job: MigrationJob;
  domains: MigrationDomain[];
}> {
  return apiClient.post<unknown, { job: MigrationJob; domains: MigrationDomain[] }>(
    `/migrations/${id}/cutover/complete`,
    {},
  );
}

export async function getMigrationReport(id: string): Promise<any> {
  const data = await apiClient.get<unknown, { report: any }>(`/migrations/${id}/report`);
  return data.report;
}
