import Papa from "papaparse";
import { normalizeUrl } from "./normalizeUrl";

export type ImportRow = {
  title: string;
  destinationUrl: string;
  slug?: string;
  shortDomain?: string;
  tags?: string[];
  folder?: string;
  notes?: string;
  clicks?: number;
  createdDate?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  valid: boolean;
  reason?: string;
};

export function parseImportRows(text: string): ImportRow[] {
  const result = Papa.parse<Record<string, string>>(text.trim(), {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().trim(),
  });

  // If we couldn't parse headers or it seems like a list of URLs
  if (!result.meta.fields || !result.meta.fields.some(f => ["title", "destination", "destination url", "url", "sourceurl", "source url", "sharingurl", "sharing url", "slug"].includes(f))) {
    // Fallback to simple line-by-line parsing if no headers match
    const rows = text.split(/\r?\n/).map((r) => r.trim()).filter(Boolean);
    return rows.map((row) => {
      // Split by comma manually for basic fallback
      const cells = row.split(",").map(c => c.trim().replace(/^"|"$/g, ''));
      const rawDest = cells[1] || cells[0];
      const finalUrl = normalizeUrl(rawDest || "");
      const valid = /^https?:\/\/[^.\s]+\.[^\s]+/i.test(finalUrl) || /^https?:\/\/localhost/i.test(finalUrl);
      return {
        title: cells[0] || finalUrl,
        destinationUrl: finalUrl,
        valid,
        reason: valid ? undefined : "Missing or invalid URL",
      };
    });
  }

  // Proper CSV parsing with headers
  return result.data.map((row) => {
    const rawDest = row["destination url"] || row["destination"] || row["url"] || row["sourceurl"] || row["source url"];
    const finalUrl = normalizeUrl(rawDest || "");
    const valid = /^https?:\/\/[^.\s]+\.[^\s]+/i.test(finalUrl) || /^https?:\/\/localhost/i.test(finalUrl);
    const sharingUrl = row["sharingurl"] || row["sharing url"] || row["short url"] || row["shorturl"] || "";
    const normalizedSharingUrl = sharingUrl ? normalizeUrl(sharingUrl) : "";
    let sourceDomain = row["domain"] || row["short domain"] || undefined;
    let sourceSlug = row["slug"] || undefined;
    if (normalizedSharingUrl) {
      try {
        const parsed = new URL(normalizedSharingUrl);
        sourceDomain = sourceDomain || parsed.hostname;
        sourceSlug = sourceSlug || parsed.pathname.replace(/^\/+/, "");
      } catch {
        // Keep explicit CSV values if the sharing URL is malformed.
      }
    }

    // Extract tags
    const rawTags = row["tags"] || "";
    const tags = rawTags.split(",").map(t => t.trim()).filter(Boolean);

    // UTM Params
    const utmSource = row["utm_source"] || row["utm source"];
    const utmMedium = row["utm_medium"] || row["utm medium"];
    const utmCampaign = row["utm_campaign"] || row["utm campaign"];
    const utmTerm = row["utm_term"] || row["utm term"];
    const utmContent = row["utm_content"] || row["utm content"];
    
    const utm = (utmSource || utmMedium || utmCampaign || utmTerm || utmContent) ? {
      source: utmSource || "",
      medium: utmMedium || "",
      campaign: utmCampaign || "",
      term: utmTerm || "",
      content: utmContent || "",
    } : undefined;

    return {
      title: row["title"] || finalUrl,
      destinationUrl: finalUrl,
      slug: sourceSlug,
      shortDomain: sourceDomain,
      tags: tags.length > 0 ? tags : undefined,
      folder: row["folder"] || undefined,
      notes: row["notes"] || row["note"] || row["description"] || undefined,
      clicks: Number.isFinite(Number(row["clicks"])) ? Number(row["clicks"]) : undefined,
      createdDate: row["createddate"] || row["created date"] || undefined,
      utm,
      valid,
      reason: valid ? undefined : "Missing or invalid destination URL",
    };
  });
}
