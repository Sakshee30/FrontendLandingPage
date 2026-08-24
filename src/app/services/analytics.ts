import { apiClient } from "../api/api-client";
import { ZiplinClick, ZiplinLink } from "./links";

export type AnalyticsFilters = {
  from?: string;
  to?: string;
  linkId?: string;
  country?: string;
  device?: string;
};

export type AnalyticsSummary = {
  stats: {
    totalClicks: number;
    uniqueVisitors: number;
    totalLinks: number;
    geolocatedClicks?: number;
    privateClicks?: number;
    topCountry: string;
    topDevice: string;
  };
  links: ZiplinLink[];
  clicks: ZiplinClick[];
  series: Array<{ date: string; clicks: number }>;
  breakdowns: {
    countries: Record<string, number>;
    devices: Record<string, number>;
    browsers: Record<string, number>;
    referrers: Record<string, number>;
  };
  locations: Array<{
    id: string;
    city?: string;
    country?: string;
    latitude: number | string;
    longitude: number | string;
    clickedAt: string;
    slug: string;
  }>;
};

export async function getAnalyticsSummary(
  filters: AnalyticsFilters = {},
): Promise<AnalyticsSummary> {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => Boolean(value)),
  );
  return apiClient.get<unknown, AnalyticsSummary>("/analytics/summary", {
    params,
  });
}

export async function resetLinkAnalytics(
  linkId: string,
): Promise<{ deletedClicks: number }> {
  return apiClient.delete<unknown, { deletedClicks: number }>(
    `/analytics/${linkId}/reset`,
  );
}
