import { apiClient } from "../api/api-client";

export type FrontendConfig = {
  googleMapsBrowserKey: string;
  mapsProvider: "google" | "google-links";
  customDomainCnameTarget: string;
};

export type RedirectDomainOption = {
  domain: string;
  label: string;
  isDefault: boolean;
  source: "system" | "custom";
};

export async function getFrontendConfig(): Promise<FrontendConfig> {
  return apiClient.get<unknown, FrontendConfig>("/config");
}

export async function getAvailableRedirectDomains(): Promise<
  RedirectDomainOption[]
> {
  return apiClient.get<unknown, RedirectDomainOption[]>(
    "/config/redirect-domains",
  );
}
