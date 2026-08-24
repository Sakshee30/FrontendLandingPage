import { apiClient } from "../api/api-client";
import type { ImportRow } from "../../utils/helpers/parseImportRows";

export type LinkPixel = {
  provider:
    | "custom_image"
    | "meta"
    | "twitter"
    | "linkedin"
    | "tiktok"
    | "google_ads"
    | "snapchat"
    | "pinterest"
    | "quora"
    | "bing"
    | "google_analytics"
    | "gtm"
    | "adroll"
    | "vk";
  name?: string;
  url?: string;
  pixelId?: string;
  id?: string;
  event?: string;
  conversionId?: string;
  label?: string;
  partnerId?: string;
  enabled?: boolean;
};

export type ZiplinLink = {
  id: string;
  workspaceId: string;
  slug: string;
  title: string;
  destinationUrl: string;
  shortUrl: string;
  shortDomain?: string | null;
  clickCount: number;
  settings?: {
    folder?: string;
    tags?: string[];
    utm?: Record<string, string>;
    pixels?: Array<string | LinkPixel>;
    geoTargeting?: Record<string, unknown>;
    deviceTargeting?: Record<string, unknown>;
    deviceRules?: Array<{ device: string; url: string }>;
    deviceDefaultUrl?: string;
    languageRules?: Array<{ language: string; url: string }>;
    languageDefaultUrl?: string;
    advancedTargeting?: {
      rules?: Array<{
        countries?: string[];
        devices?: string[];
        languages?: string[];
        url: string;
      }>;
      defaultUrl?: string;
    };
    ipControl?: {
      whitelist?: string[];
      banlist?: string[];
      fallbackUrl?: string;
    };
    clickLimit?: number;
    redirectStatus?: 301 | 302 | 307;
    abTesting?: {
      enabled?: boolean;
      variants?: Array<{ label?: string; url: string; weight?: number }>;
    };
    deepLinks?: {
      enabled?: boolean;
      iosAppUrl?: string;
      iosStoreUrl?: string;
      androidAppUrl?: string;
      androidStoreUrl?: string;
      desktopUrl?: string;
      webFallbackUrl?: string;
    };
    socialPreview?: {
      title?: string;
      description?: string;
      imageUrl?: string;
    };
    linkMode?: "redirect" | "cloaked" | "cta_overlay" | "splash" | "promo";
    ctaOverlay?: Record<string, unknown>;
    splashPage?: Record<string, unknown>;
    promoPage?: Record<string, unknown>;
    embedWidget?: {
      enabled?: boolean;
      code?: string;
    };
    messenger?: {
      enabled?: boolean;
      provider?: "messenger" | "whatsapp" | "telegram";
      handle?: string;
    };
    vcard?: {
      enabled?: boolean;
      fullName?: string;
      phone?: string;
      email?: string;
      company?: string;
      website?: string;
      note?: string;
    };
    password?: string;
    expiresAt?: string;
    fallbackUrl?: string;
    notes?: string;
    health?: {
      status?: "ok" | "broken";
      statusCode?: number;
      checkedAt?: string;
      error?: string;
    };
  };
  createdAt: string;
  updatedAt: string;
};

export type ZiplinClick = {
  id: string;
  workspaceId: string;
  linkId: string;
  slug: string;
  destinationUrl: string;
  clickedAt: string;
  ip?: string;
  browser?: string;
  device?: string;
  referrer?: string;
  city?: string;
  region?: string;
  country?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
};

type LinksResponse = {
  links: ZiplinLink[];
  clicks?: ZiplinClick[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export async function getLinksOverview(page = 1, limit = 100): Promise<LinksResponse> {
  const data = await apiClient.get<unknown, LinksResponse>(`/links?page=${page}&limit=${limit}`);
  return {
    links: data.links ?? [],
    clicks: data.clicks ?? [],
    pagination: data.pagination,
  };
}

export async function getAllLinksOverview(): Promise<LinksResponse> {
  const firstPage = await getLinksOverview(1, 100);
  const links = [...firstPage.links];
  const clicks = firstPage.clicks ?? [];
  const totalPages = firstPage.pagination?.totalPages ?? 1;
  for (let page = 2; page <= totalPages; page += 1) {
    const nextPage = await getLinksOverview(page, 100);
    links.push(...nextPage.links);
  }
  return {
    links,
    clicks,
    pagination: firstPage.pagination
      ? { ...firstPage.pagination, page: 1, limit: links.length || firstPage.pagination.limit }
      : undefined,
  };
}

export async function listLinks(): Promise<ZiplinLink[]> {
  const data = await getAllLinksOverview();
  return data.links;
}

export async function getLink(id: string): Promise<ZiplinLink> {
  const data = await apiClient.get<unknown, { link: ZiplinLink }>(
    `/links/${id}`,
  );
  return data.link;
}

export async function createLink(payload: {
  title: string;
  destinationUrl: string;
  slug?: string;
  shortDomain?: string | null;
  settings?: ZiplinLink["settings"];
}): Promise<ZiplinLink> {
  const data = await apiClient.post<unknown, { link: ZiplinLink }>(
    "/links",
    payload,
  );
  return data.link;
}

export async function createPublicShortLink(
  destinationUrl: string,
): Promise<ZiplinLink> {
  const data = await apiClient.post<unknown, { link: ZiplinLink }>(
    "/links/public",
    { destinationUrl },
  );
  return data.link;
}

export async function updateLink(
  id: string,
  payload: {
    title: string;
    destinationUrl: string;
    slug?: string;
    shortDomain?: string | null;
    settings?: ZiplinLink["settings"];
  },
): Promise<ZiplinLink> {
  const data = await apiClient.put<unknown, { link: ZiplinLink }>(
    `/links/${id}`,
    payload,
  );
  return data.link;
}

export async function deleteLink(id: string): Promise<void> {
  await apiClient.delete(`/links/${id}`);
}

export async function checkLinkHealth(id: string): Promise<{
  link: ZiplinLink;
  health: NonNullable<ZiplinLink["settings"]>["health"];
}> {
  return apiClient.post<
    unknown,
    { link: ZiplinLink; health: NonNullable<ZiplinLink["settings"]>["health"] }
  >(`/links/${id}/check-health`, {});
}

export async function bulkUpdateLinks(
  ids: string[],
  patch: { folder?: string; tags?: string[] | string; notes?: string },
): Promise<ZiplinLink[]> {
  const data = await apiClient.post<unknown, { updated: ZiplinLink[] }>(
    "/links/bulk-update",
    { ids, patch },
  );
  return data.updated ?? [];
}

export async function bulkDeleteLinks(
  ids: string[],
): Promise<{ deleted: number }> {
  return apiClient.post<unknown, { deleted: number }>("/links/bulk-delete", {
    ids,
  });
}

export async function checkSlug(
  slug: string,
): Promise<{ slug: string; available: boolean }> {
  const data = await apiClient.get<
    unknown,
    { slug: string; available: boolean }
  >("/links/check-slug", {
    params: { slug },
  });
  return data;
}

export async function bulkImportLinks(
  links: ImportRow[]
): Promise<{ imported: number; errors: any[] }> {
  return apiClient.post<unknown, { imported: number; errors: any[] }>("/links/bulk-import", {
    links,
  });
}
