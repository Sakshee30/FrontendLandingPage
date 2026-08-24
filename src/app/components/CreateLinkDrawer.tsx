import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createLink, ZiplinLink, LinkPixel, updateLink } from "../services/links";
import { listSettings, WorkspaceSetting } from "../services/settings";
import { getAvailableRedirectDomains, RedirectDomainOption } from "../services/config";
import { HelpButton } from "./HelpButton";

interface CreateLinkDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  initialUrl?: string;
  editingLink?: ZiplinLink | null;
}

const advancedSections = [
  "Link Appearance",
  "UTM Parameters",
  "Retargeting Pixels",
  "Tags & Folders",
  "A/B Testing",
  "Deep Links",
  "Geo Targeting",
  "Device Targeting",
  "Language Targeting",
  "Advanced Targeting",
  "IP Control",
  "Embed / Cloak",
  "Messenger Links",
  "vCard Link",
  "Password / Expiry",
  "Notes",
];

const sectionHelpTopic: Record<string, string> = {
  "Link Appearance": "link-appearance",
  "UTM Parameters": "utm-parameters",
  "Retargeting Pixels": "retargeting-pixels",
  "Tags & Folders": "tags-folders",
  "A/B Testing": "ab-testing",
  "Deep Links": "deep-links",
  "Geo Targeting": "geo-targeting",
  "Device Targeting": "device-targeting",
  "Language Targeting": "language-targeting",
  "Advanced Targeting": "advanced-targeting",
  "IP Control": "ip-control",
  "Embed / Cloak": "embed-cloak",
  "Messenger Links": "messenger-links",
  "vCard Link": "vcard-link",
  "Password / Expiry": "password-expiry",
  "Notes": "internal-notes",
};

function helpTopicForSection(section: string) {
  return sectionHelpTopic[section] || "create-link";
}

function helpTopicForField(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes("destination")) return "destination-url";
  if (normalized.includes("title") || normalized.includes("preview")) return "link-appearance";
  if (normalized.includes("slug")) return "custom-slug";
  if (normalized.includes("folder") || normalized.includes("tag")) return "tags-folders";
  if (["source", "medium", "campaign"].includes(normalized)) return "utm-parameters";
  if (normalized.includes("pixel") || normalized.includes("conversion") || normalized.includes("partner") || normalized.includes("event") || normalized.includes("label")) return "retargeting-pixels";
  if (normalized.includes("ios") || normalized.includes("android") || normalized.includes("store") || normalized.includes("desktop") || normalized.includes("web fallback")) return "deep-links";
  if (normalized.includes("country")) return "geo-targeting";
  if (normalized.includes("device")) return "device-targeting";
  if (normalized.includes("language")) return "language-targeting";
  if (normalized.includes("advanced targeting")) return "advanced-targeting";
  if (normalized.includes("ip")) return "ip-control";
  if (normalized.includes("cta") || normalized.includes("splash") || normalized.includes("coupon") || normalized.includes("widget") || normalized.includes("redirect mode")) return "embed-cloak";
  if (normalized.includes("messenger") || normalized.includes("platform") || normalized.includes("handle")) return "messenger-links";
  if (normalized.includes("vcard") || normalized.includes("full name") || normalized.includes("phone") || normalized.includes("email") || normalized.includes("company") || normalized.includes("website")) return "vcard-link";
  if (normalized.includes("password") || normalized.includes("expires") || normalized.includes("click limit") || normalized.includes("redirect status") || normalized.includes("fallback")) return "password-expiry";
  if (normalized.includes("notes")) return "internal-notes";
  return "create-link";
}

type LinkForm = {
  url: string;
  title: string;
  slug: string;
  folder: string;
  tags: string;
  previewTitle: string;
  previewDescription: string;
  previewImageUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  pixelsJson: string;
  pixelProvider: LinkPixel["provider"];
  pixelName: string;
  pixelUrl: string;
  metaPixelId: string;
  metaEvent: string;
  googleConversionId: string;
  googleLabel: string;
  linkedinPartnerId: string;
  genericPixelId: string;
  genericEvent: string;
  genericLabel: string;
  abEnabled: string;
  abVariants: string;
  deepLinksEnabled: string;
  iosAppUrl: string;
  iosStoreUrl: string;
  androidAppUrl: string;
  androidStoreUrl: string;
  desktopUrl: string;
  webFallbackUrl: string;
  geoCountries: string;
  deviceRules: string;
  deviceRouteRules: string;
  deviceDefaultUrl: string;
  languageRules: string;
  languageDefaultUrl: string;
  advancedTargetRules: string;
  advancedTargetDefaultUrl: string;
  ipWhitelist: string;
  ipBanlist: string;
  ipFallbackUrl: string;
  clickLimit: string;
  redirectStatus: string;
  linkMode: string;
  ctaHeadline: string;
  ctaBody: string;
  ctaButtonLabel: string;
  ctaButtonUrl: string;
  ctaCouponCode: string;
  splashHeadline: string;
  splashBody: string;
  splashButtonLabel: string;
  splashCountdownSeconds: string;
  embedWidgetEnabled: string;
  embedWidgetCode: string;
  messengerEnabled: string;
  messengerProvider: string;
  messengerHandle: string;
  vcardEnabled: string;
  vcardFullName: string;
  vcardPhone: string;
  vcardEmail: string;
  vcardCompany: string;
  vcardWebsite: string;
  vcardNote: string;
  password: string;
  expiresAt: string;
  fallbackUrl: string;
  notes: string;
  shortDomain: string;
};

type AutoFillField = "title" | "slug" | "folder" | "tags" | "utmSource" | "utmMedium" | "utmCampaign";

const autoFillFields: AutoFillField[] = ["title", "slug", "folder", "tags", "utmSource", "utmMedium", "utmCampaign"];

function emptyForm(initialUrl = ""): LinkForm {
  return {
    url: initialUrl,
    title: "",
    slug: "",
    folder: "Default",
    tags: "",
    previewTitle: "",
    previewDescription: "",
    previewImageUrl: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    pixelsJson: "[]",
    pixelProvider: "meta",
    pixelName: "",
    pixelUrl: "",
    metaPixelId: "",
    metaEvent: "PageView",
    googleConversionId: "",
    googleLabel: "",
    linkedinPartnerId: "",
    genericPixelId: "",
    genericEvent: "PageView",
    genericLabel: "",
    abEnabled: "false",
    abVariants: "",
    deepLinksEnabled: "false",
    iosAppUrl: "",
    iosStoreUrl: "",
    androidAppUrl: "",
    androidStoreUrl: "",
    desktopUrl: "",
    webFallbackUrl: "",
    geoCountries: "",
    deviceRules: "",
    deviceRouteRules: "",
    deviceDefaultUrl: "",
    languageRules: "",
    languageDefaultUrl: "",
    advancedTargetRules: "",
    advancedTargetDefaultUrl: "",
    ipWhitelist: "",
    ipBanlist: "",
    ipFallbackUrl: "",
    clickLimit: "",
    redirectStatus: "302",
    linkMode: "redirect",
    ctaHeadline: "",
    ctaBody: "",
    ctaButtonLabel: "Continue",
    ctaButtonUrl: "",
    ctaCouponCode: "",
    splashHeadline: "",
    splashBody: "",
    splashButtonLabel: "Continue",
    splashCountdownSeconds: "",
    embedWidgetEnabled: "false",
    embedWidgetCode: "",
    messengerEnabled: "false",
    messengerProvider: "messenger",
    messengerHandle: "",
    vcardEnabled: "false",
    vcardFullName: "",
    vcardPhone: "",
    vcardEmail: "",
    vcardCompany: "",
    vcardWebsite: "",
    vcardNote: "",
    password: "",
    expiresAt: "",
    fallbackUrl: "",
    notes: "",
    shortDomain: "",
  };
}

function titleCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

function parseUrl(value: string) {
  const clean = value.trim();
  if (!clean) return null;
  try {
    return new URL(clean);
  } catch {
    try {
      return new URL(`https://${clean}`);
    } catch {
      return null;
    }
  }
}

function inferFolder(hostname: string, path: string) {
  const combined = `${hostname} ${path}`.toLowerCase();
  if (combined.includes("youtube") || combined.includes("youtu.be")) return "YouTube Links";
  if (combined.includes("zoom")) return "Zoom Links";
  if (combined.includes("blog") || combined.includes("article") || combined.includes("post")) return "Blog Links";
  return "Website Links";
}

function inferLinkFields(value: string): Partial<Pick<LinkForm, AutoFillField>> {
  const parsed = parseUrl(value);
  if (!parsed) return {};
  const hostname = parsed.hostname.replace(/^www\./i, "");
  const domainName = hostname.split(".")[0] || "link";
  const pathParts = parsed.pathname
    .split("/")
    .map((part) => part.replace(/\.[a-z0-9]+$/i, ""))
    .filter(Boolean);
  const primaryKeyword = pathParts[pathParts.length - 1] || domainName;
  const readableTitle = titleCase(primaryKeyword || domainName) || "New Link";
  const generatedSlug = slugify(primaryKeyword || domainName) || slugify(domainName) || "link";
  const tagParts = Array.from(new Set([domainName, ...pathParts.join("-").split(/[-_]/)].filter((part) => part && part.length > 2))).slice(0, 6);

  return {
    title: readableTitle,
    slug: generatedSlug,
    folder: inferFolder(hostname, parsed.pathname),
    tags: tagParts.join(", "),
    utmSource: parsed.searchParams.get("utm_source") || domainName,
    utmMedium: parsed.searchParams.get("utm_medium") || "website",
    utmCampaign: parsed.searchParams.get("utm_campaign") || generatedSlug,
  };
}

function withUrlAutofill(current: LinkForm, value: string, touched: AutoFillField[]) {
  const inferred = inferLinkFields(value);
  const next = { ...current, url: value };
  autoFillFields.forEach((field) => {
    if (!touched.includes(field) && inferred[field]) {
      next[field] = inferred[field] || "";
    }
  });
  return next;
}

function parsePixels(value: string): LinkPixel[] {
  try {
    const parsed = JSON.parse(value || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((pixel) => typeof pixel === "string" ? { provider: "custom_image", name: "Custom pixel", url: pixel } : pixel)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function savePixels(pixels: Array<string | LinkPixel> = []) {
  return JSON.stringify(pixels, null, 2);
}

function parseAbVariants(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url = "", weight = "1", label = ""] = line.split(",").map((part) => part.trim());
      return { url, weight: Math.max(1, Number(weight) || 1), label };
    })
    .filter((variant) => /^https?:\/\//i.test(variant.url));
}

function saveAbVariants(variants: Array<{ label?: string; url: string; weight?: number }> = []) {
  return variants.map((variant) => [variant.url, variant.weight || 1, variant.label || ""].join(", ")).join("\n");
}

function parseKeyUrlRules(value: string, key: "device" | "language") {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [matchValue = "", url = ""] = line.split(",").map((part) => part.trim());
      return { [key]: matchValue, url };
    })
    .filter((rule) => rule[key] && /^https?:\/\//i.test(rule.url));
}

function saveKeyUrlRules(rules: Array<Record<string, string>> = [], key: "device" | "language") {
  return rules.map((rule) => [rule[key] || "", rule.url || ""].join(", ")).join("\n");
}

function parseAdvancedTargetRules(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [countries = "", devices = "", languages = "", url = ""] = line.split(",").map((part) => part.trim());
      return {
        countries: countries.split("|").map((item) => item.trim()).filter(Boolean),
        devices: devices.split("|").map((item) => item.trim()).filter(Boolean),
        languages: languages.split("|").map((item) => item.trim()).filter(Boolean),
        url,
      };
    })
    .filter((rule) => /^https?:\/\//i.test(rule.url) && (rule.countries.length || rule.devices.length || rule.languages.length));
}

function saveAdvancedTargetRules(rules: Array<{ countries?: string[]; devices?: string[]; languages?: string[]; url?: string }> = []) {
  return rules
    .map((rule) => [
      (rule.countries || []).join("|"),
      (rule.devices || []).join("|"),
      (rule.languages || []).join("|"),
      rule.url || "",
    ].join(", "))
    .join("\n");
}

export function CreateLinkDrawer({ open, onClose, onCreated, initialUrl = "", editingLink = null }: CreateLinkDrawerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedPixels, setSavedPixels] = useState<WorkspaceSetting[]>([]);
  const [form, setForm] = useState<LinkForm>(emptyForm());
  const [touchedAutoFields, setTouchedAutoFields] = useState<AutoFillField[]>([]);
  const [redirectDomains, setRedirectDomains] = useState<RedirectDomainOption[]>([]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    listSettings("pixel").then(setSavedPixels).catch(() => setSavedPixels([]));
    getAvailableRedirectDomains().then((domains) => {
      setRedirectDomains(domains);
      // For new links only: auto-select user's custom domain if they have one,
      // otherwise the system default. Editing keeps the link's existing shortDomain.
      if (!editingLink) {
        const customDomain = domains.find((d) => d.source === "custom");
        const systemDefault = domains.find((d) => d.isDefault && d.source === "system");
        const autoSelected = customDomain ?? systemDefault;
        if (autoSelected) {
          setForm((f) => ({ ...f, shortDomain: autoSelected.domain }));
        }
      }
    }).catch(() => setRedirectDomains([]));
    if (editingLink) {
      setTouchedAutoFields([...autoFillFields]);
      setForm({
        url: editingLink.destinationUrl,
        title: editingLink.title,
        slug: editingLink.slug,
        folder: editingLink.settings?.folder || "Default",
        tags: editingLink.settings?.tags?.join(", ") || "",
        previewTitle: editingLink.settings?.socialPreview?.title || "",
        previewDescription: editingLink.settings?.socialPreview?.description || "",
        previewImageUrl: editingLink.settings?.socialPreview?.imageUrl || "",
        utmSource: editingLink.settings?.utm?.source || "",
        utmMedium: editingLink.settings?.utm?.medium || "",
        utmCampaign: editingLink.settings?.utm?.campaign || "",
        pixelsJson: savePixels(editingLink.settings?.pixels || []),
        pixelProvider: "meta",
        pixelName: "",
        pixelUrl: "",
        metaPixelId: "",
        metaEvent: "PageView",
        googleConversionId: "",
        googleLabel: "",
        linkedinPartnerId: "",
        genericPixelId: "",
        genericEvent: "PageView",
        genericLabel: "",
        abEnabled: editingLink.settings?.abTesting?.enabled ? "true" : "false",
        abVariants: saveAbVariants(editingLink.settings?.abTesting?.variants || []),
        deepLinksEnabled: editingLink.settings?.deepLinks?.enabled ? "true" : "false",
        iosAppUrl: editingLink.settings?.deepLinks?.iosAppUrl || "",
        iosStoreUrl: editingLink.settings?.deepLinks?.iosStoreUrl || "",
        androidAppUrl: editingLink.settings?.deepLinks?.androidAppUrl || "",
        androidStoreUrl: editingLink.settings?.deepLinks?.androidStoreUrl || "",
        desktopUrl: editingLink.settings?.deepLinks?.desktopUrl || "",
        webFallbackUrl: editingLink.settings?.deepLinks?.webFallbackUrl || "",
        geoCountries: String(editingLink.settings?.geoTargeting?.countries || ""),
        deviceRules: String(editingLink.settings?.deviceTargeting?.devices || ""),
        deviceRouteRules: saveKeyUrlRules(editingLink.settings?.deviceRules || [], "device"),
        deviceDefaultUrl: editingLink.settings?.deviceDefaultUrl || "",
        languageRules: saveKeyUrlRules(editingLink.settings?.languageRules || [], "language"),
        languageDefaultUrl: editingLink.settings?.languageDefaultUrl || "",
        advancedTargetRules: saveAdvancedTargetRules(editingLink.settings?.advancedTargeting?.rules || []),
        advancedTargetDefaultUrl: editingLink.settings?.advancedTargeting?.defaultUrl || "",
        ipWhitelist: editingLink.settings?.ipControl?.whitelist?.join(", ") || "",
        ipBanlist: editingLink.settings?.ipControl?.banlist?.join(", ") || "",
        ipFallbackUrl: editingLink.settings?.ipControl?.fallbackUrl || "",
        clickLimit: editingLink.settings?.clickLimit ? String(editingLink.settings.clickLimit) : "",
        redirectStatus: String(editingLink.settings?.redirectStatus || 302),
        linkMode: editingLink.settings?.linkMode || "redirect",
        ctaHeadline: String(editingLink.settings?.ctaOverlay?.headline || ""),
        ctaBody: String(editingLink.settings?.ctaOverlay?.body || ""),
        ctaButtonLabel: String(editingLink.settings?.ctaOverlay?.buttonLabel || "Continue"),
        ctaButtonUrl: String(editingLink.settings?.ctaOverlay?.buttonUrl || ""),
        ctaCouponCode: String(editingLink.settings?.ctaOverlay?.couponCode || ""),
        splashHeadline: String(editingLink.settings?.splashPage?.headline || editingLink.settings?.promoPage?.headline || ""),
        splashBody: String(editingLink.settings?.splashPage?.body || editingLink.settings?.promoPage?.body || ""),
        splashButtonLabel: String(editingLink.settings?.splashPage?.buttonLabel || editingLink.settings?.promoPage?.buttonLabel || "Continue"),
        splashCountdownSeconds: String(editingLink.settings?.splashPage?.countdownSeconds || editingLink.settings?.promoPage?.timerSeconds || ""),
        embedWidgetEnabled: editingLink.settings?.embedWidget?.enabled ? "true" : "false",
        embedWidgetCode: editingLink.settings?.embedWidget?.code || "",
        messengerEnabled: editingLink.settings?.messenger?.enabled ? "true" : "false",
        messengerProvider: editingLink.settings?.messenger?.provider || "messenger",
        messengerHandle: editingLink.settings?.messenger?.handle || "",
        vcardEnabled: editingLink.settings?.vcard?.enabled ? "true" : "false",
        vcardFullName: editingLink.settings?.vcard?.fullName || "",
        vcardPhone: editingLink.settings?.vcard?.phone || "",
        vcardEmail: editingLink.settings?.vcard?.email || "",
        vcardCompany: editingLink.settings?.vcard?.company || "",
        vcardWebsite: editingLink.settings?.vcard?.website || "",
        vcardNote: editingLink.settings?.vcard?.note || "",
        password: editingLink.settings?.password || "",
        expiresAt: editingLink.settings?.expiresAt ? editingLink.settings.expiresAt.slice(0, 16) : "",
        fallbackUrl: editingLink.settings?.fallbackUrl || "",
        notes: editingLink.settings?.notes || "",
        shortDomain: editingLink.shortDomain || "",
      });
      return;
    }
    setTouchedAutoFields([]);
    const nextForm = emptyForm(initialUrl);
    setForm(initialUrl ? withUrlAutofill(nextForm, initialUrl, []) : nextForm);
  }, [open, initialUrl, editingLink]);

  if (!open) return null;

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        destinationUrl: form.url.trim(),
        title: form.title.trim() || form.url.trim(),
        slug: form.slug.trim() || undefined,
        shortDomain: form.shortDomain || null,
        settings: {
          folder: form.folder.trim() || "Default",
          tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          utm: {
            source: form.utmSource.trim(),
            medium: form.utmMedium.trim(),
            campaign: form.utmCampaign.trim(),
          },
          socialPreview: {
            title: form.previewTitle.trim(),
            description: form.previewDescription.trim(),
            imageUrl: form.previewImageUrl.trim(),
          },
          pixels: parsePixels(form.pixelsJson),
          geoTargeting: {
            countries: form.geoCountries.split(",").map((country) => country.trim()).filter(Boolean),
          },
          deviceTargeting: {
            devices: form.deviceRules.split(",").map((device) => device.trim()).filter(Boolean),
          },
          deviceRules: parseKeyUrlRules(form.deviceRouteRules, "device"),
          deviceDefaultUrl: form.deviceDefaultUrl.trim(),
          languageRules: parseKeyUrlRules(form.languageRules, "language"),
          languageDefaultUrl: form.languageDefaultUrl.trim(),
          advancedTargeting: {
            rules: parseAdvancedTargetRules(form.advancedTargetRules),
            defaultUrl: form.advancedTargetDefaultUrl.trim(),
          },
          ipControl: {
            whitelist: form.ipWhitelist.split(",").map((ip) => ip.trim()).filter(Boolean),
            banlist: form.ipBanlist.split(",").map((ip) => ip.trim()).filter(Boolean),
            fallbackUrl: form.ipFallbackUrl.trim(),
          },
          clickLimit: Math.max(0, Number(form.clickLimit) || 0),
          redirectStatus: Number(form.redirectStatus) as 301 | 302 | 307,
          abTesting: {
            enabled: form.abEnabled === "true",
            variants: parseAbVariants(form.abVariants),
          },
          deepLinks: {
            enabled: form.deepLinksEnabled === "true",
            iosAppUrl: form.iosAppUrl.trim(),
            iosStoreUrl: form.iosStoreUrl.trim(),
            androidAppUrl: form.androidAppUrl.trim(),
            androidStoreUrl: form.androidStoreUrl.trim(),
            desktopUrl: form.desktopUrl.trim(),
            webFallbackUrl: form.webFallbackUrl.trim(),
          },
          linkMode: ["cloaked", "cta_overlay", "splash", "promo"].includes(form.linkMode) ? form.linkMode as "cloaked" | "cta_overlay" | "splash" | "promo" : "redirect",
          ctaOverlay: {
            type: form.ctaCouponCode.trim() ? "coupon" : "newsletter",
            headline: form.ctaHeadline.trim(),
            body: form.ctaBody.trim(),
            buttonLabel: form.ctaButtonLabel.trim(),
            buttonUrl: form.ctaButtonUrl.trim(),
            couponCode: form.ctaCouponCode.trim(),
            position: "bottom",
          },
          splashPage: {
            headline: form.splashHeadline.trim(),
            body: form.splashBody.trim(),
            buttonLabel: form.splashButtonLabel.trim(),
            countdownSeconds: Number(form.splashCountdownSeconds) || 0,
            showSkip: true,
          },
          promoPage: {
            template: "product",
            headline: form.splashHeadline.trim(),
            body: form.splashBody.trim(),
            buttonLabel: form.splashButtonLabel.trim(),
            timerSeconds: Number(form.splashCountdownSeconds) || 0,
          },
          embedWidget: {
            enabled: form.embedWidgetEnabled === "true",
            code: form.embedWidgetCode,
          },
          messenger: {
            enabled: form.messengerEnabled === "true",
            provider: form.messengerProvider as "messenger" | "whatsapp" | "telegram",
            handle: form.messengerHandle.trim(),
          },
          vcard: {
            enabled: form.vcardEnabled === "true",
            fullName: form.vcardFullName.trim(),
            phone: form.vcardPhone.trim(),
            email: form.vcardEmail.trim(),
            company: form.vcardCompany.trim(),
            website: form.vcardWebsite.trim(),
            note: form.vcardNote.trim(),
          },
          password: form.password.trim(),
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : "",
          fallbackUrl: form.fallbackUrl.trim(),
          notes: form.notes.trim(),
        },
      };
      if (editingLink) {
        await updateLink(editingLink.id, payload);
      } else {
        await createLink(payload);
      }
      setForm(emptyForm());
      onCreated?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create link");
    } finally {
      setSaving(false);
    }
  }

  function updateField(key: keyof LinkForm, value: string) {
    if (key === "url" && !editingLink) {
      setForm((current) => withUrlAutofill(current, value, touchedAutoFields));
      return;
    }

    if (autoFillFields.includes(key as AutoFillField)) {
      setTouchedAutoFields((current) => current.includes(key as AutoFillField) ? current : [...current, key as AutoFillField]);
    }
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(28,36,51,0.25)", zIndex: 40 }} />
      <div style={{ position: "fixed", top: 0, right: 0, width: "min(1120px, calc(100vw - 24px))", height: "100vh", background: "#fff", borderLeft: "1px solid #D9E2EC", zIndex: 50, display: "flex", flexDirection: "column", fontFamily: "Inter, sans-serif" }}>
        <div style={{ padding: "24px 28px 16px", borderBottom: "1px solid #D9E2EC", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h2 style={{ color: "#1C2433", fontSize: 22, fontWeight: 700, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>{editingLink ? "Edit Link" : "Create Link"} <HelpButton topicId="create-link" label="Create Link" /></h2>
            <p style={{ color: "#667085", fontSize: 13, margin: "4px 0 0" }}>Add destination, slug, preview and tracking.</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#667085", padding: 4, marginTop: 2 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "22px 30px", background: "#F4F7FB" }}>
          {error && <div style={{ background: "#FEF3F2", border: "1px solid #FDA29B", color: "#B42318", borderRadius: 10, padding: 12, marginBottom: 14, fontWeight: 700 }}>{error}</div>}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(360px, 1fr) 340px", gap: 22, alignItems: "start" }}>
            <section style={createCardStyle}>
              <h3 style={{ color: "#1C2433", fontSize: 18, fontWeight: 800, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>Create a new link <HelpButton topicId="create-link" label="Create a new link" /></h3>
              {[
                { label: "Destination URL", key: "url", placeholder: "https://example.com", required: true },
                { label: "Link title", key: "title", placeholder: "My Campaign" },
                { label: "Custom slug", key: "slug", placeholder: "my-slug" },
              ].map(({ label, key, placeholder, required }) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#667085", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}{required ? " *" : ""}<HelpButton topicId={helpTopicForField(label)} label={label} /></label>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(event) => updateField(key as keyof LinkForm, event.target.value)}
                    placeholder={placeholder}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #D9E2EC", fontSize: 14, color: "#1C2433", outline: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif" }}
                  />
                </div>
              ))}
              {redirectDomains.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#667085", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                    Short domain
                  </label>
                  <select
                    value={form.shortDomain}
                    onChange={(e) => updateField("shortDomain", e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #D9E2EC", fontSize: 14, color: "#1C2433", outline: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif", background: "#fff", cursor: "pointer" }}
                  >
                    <option value="">Platform default</option>
                    {redirectDomains.map((d) => (
                      <option key={d.domain} value={d.domain}>
                        {d.domain}{d.source === "custom" ? " (your domain)" : d.isDefault ? " (default)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {!editingLink && form.url.trim() ? (
                <div style={{ background: "#F4F7FB", border: "1px solid #D9E2EC", color: "#475467", borderRadius: 10, padding: "10px 12px", margin: "-4px 0 16px", fontSize: 12, lineHeight: 1.5 }}>
                  Auto-filled from the destination URL. You can still edit title, slug, folder, tags, and UTM fields.
                </div>
              ) : null}
              <h3 style={{ color: "#1C2433", fontSize: 16, fontWeight: 800, margin: "20px 0 10px" }}>Advanced options</h3>
              <div className="space-y-2">
                {advancedSections.map((section) => (
                  <div key={section}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => setExpanded(expanded === section ? null : section)} style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "#F8FAFC", border: "1px solid #D9E2EC", borderRadius: 9, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1C2433" }}>{section}</span>
                        {expanded === section ? <Minus size={15} color="#2F80ED" /> : <Plus size={15} color="#2F80ED" />}
                      </button>
                      <HelpButton topicId={helpTopicForSection(section)} label={section} />
                    </div>
                    {expanded === section && <AdvancedSection section={section} form={form} setForm={setForm} savedPixels={savedPixels} />}
                  </div>
                ))}
              </div>
            </section>
            <aside style={createCardStyle}>
              <h3 style={{ color: "#1C2433", fontSize: 16, fontWeight: 900, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>Link preview <HelpButton topicId="link-preview" label="Link preview" /></h3>
              <div style={{ border: "1px solid #D9E2EC", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
                <div style={{ height: 150, background: form.previewImageUrl ? `url(${form.previewImageUrl}) center/cover` : "linear-gradient(135deg,#EAF6EF,#EEF4FF)" }} />
                <div style={{ padding: 14 }}>
                  <div style={{ color: "#1C2433", fontWeight: 900, fontSize: 15 }}>{form.previewTitle || form.title || "Your link title"}</div>
                  <div style={{ color: "#667085", fontSize: 12, lineHeight: 1.45, marginTop: 5 }}>{form.previewDescription || "Customize how this link looks when shared."}</div>
                  <div style={{ color: "#2F80ED", fontSize: 12, fontWeight: 800, marginTop: 10 }}>/r/{form.slug || "custom-slug"}</div>
                </div>
              </div>
              <div style={{ display: "grid", gap: 9, marginTop: 14, color: "#667085", fontSize: 12 }}>
                <span><strong>Mode:</strong> {form.linkMode === "cloaked" ? "Cloaked / masked" : "Direct redirect"}</span>
                <span><strong>Folder:</strong> {form.folder || "Default"}</span>
                <span><strong>Tags:</strong> {form.tags || "No tags"}</span>
                <span><strong>Deep links:</strong> {form.deepLinksEnabled === "true" ? "Enabled" : "Off"}</span>
                <span><strong>A/B testing:</strong> {form.abEnabled === "true" ? "Enabled" : "Off"}</span>
                <span><strong>vCard:</strong> {form.vcardEnabled === "true" ? "Enabled" : "Off"}</span>
              </div>
            </aside>
          </div>
        </div>

        <div style={{ padding: "16px 28px", borderTop: "1px solid #D9E2EC", display: "flex", gap: 12 }}>
          <button onClick={onClose} disabled={saving} style={{ flex: 1, padding: "12px 0", borderRadius: 8, border: "1.4px solid #2F80ED", background: "#fff", color: "#2F80ED", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ flex: 1.5, padding: "12px 0", borderRadius: 8, border: "none", background: saving ? "#98A2B3" : "#2F80ED", color: "#fff", fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif" }}>
            {saving ? "Saving..." : editingLink ? "Update Link" : "Save Link"}
          </button>
        </div>
      </div>
    </>
  );
}

function AdvancedSection({ section, form, setForm, savedPixels }: { section: string; form: LinkForm; setForm: (value: LinkForm) => void; savedPixels: WorkspaceSetting[] }) {
  if (section === "Link Appearance") {
    return <div style={advancedPanelStyle}>
      <MiniInput label="Preview title" value={form.previewTitle} onChange={(value) => setForm({ ...form, previewTitle: value })} placeholder="A better title for social previews" />
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Preview description
        <textarea value={form.previewDescription} onChange={(event) => setForm({ ...form, previewDescription: event.target.value })} placeholder="Short description shown when the link is shared." style={{ ...miniInputStyle, minHeight: 78, resize: "vertical" }} />
      </label>
      <MiniInput label="Preview image URL" value={form.previewImageUrl} onChange={(value) => setForm({ ...form, previewImageUrl: value })} placeholder="https://example.com/preview.jpg" />
    </div>;
  }
  if (section === "Tags & Folders") {
    return <div style={advancedPanelStyle}>
      <MiniInput label="Folder" value={form.folder} onChange={(value) => setForm({ ...form, folder: value })} placeholder="Default" />
      <MiniInput label="Tags" value={form.tags} onChange={(value) => setForm({ ...form, tags: value })} placeholder="client, launch, newsletter" />
      <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>Use folders for organization and tags for filtering/reporting.</p>
    </div>;
  }
  if (section === "UTM Parameters") {
    return <div style={advancedPanelStyle}>
      <MiniInput label="Source" value={form.utmSource} onChange={(value) => setForm({ ...form, utmSource: value })} placeholder="newsletter" />
      <MiniInput label="Medium" value={form.utmMedium} onChange={(value) => setForm({ ...form, utmMedium: value })} placeholder="email" />
      <MiniInput label="Campaign" value={form.utmCampaign} onChange={(value) => setForm({ ...form, utmCampaign: value })} placeholder="launch" />
    </div>;
  }
  if (section === "Retargeting Pixels") {
    const pixels = parsePixels(form.pixelsJson);
    const draft = buildDraftPixel(form);
    return <div style={advancedPanelStyle}>
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Provider
        <select
          value={form.pixelProvider}
          onChange={(event) => setForm({ ...form, pixelProvider: event.target.value as LinkPixel["provider"] })}
          style={miniInputStyle}
        >
          <option value="meta">Meta Pixel</option>
          <option value="twitter">Twitter/X Pixel</option>
          <option value="google_ads">Google Ads</option>
          <option value="linkedin">LinkedIn Insight</option>
          <option value="tiktok">TikTok Pixel</option>
          <option value="snapchat">Snapchat Pixel</option>
          <option value="pinterest">Pinterest Tag</option>
          <option value="quora">Quora Pixel</option>
          <option value="bing">Bing UET</option>
          <option value="google_analytics">Google Analytics</option>
          <option value="gtm">Google Tag Manager</option>
          <option value="adroll">AdRoll</option>
          <option value="vk">VK Pixel</option>
          <option value="custom_image">Custom image URL</option>
        </select>
      </label>
      <MiniInput label="Pixel name" value={form.pixelName} onChange={(value) => setForm({ ...form, pixelName: value })} placeholder="Main remarketing pixel" />
      {form.pixelProvider === "meta" && <>
        <MiniInput label="Meta pixel ID" value={form.metaPixelId} onChange={(value) => setForm({ ...form, metaPixelId: value })} placeholder="1234567890" />
        <MiniInput label="Event name" value={form.metaEvent} onChange={(value) => setForm({ ...form, metaEvent: value })} placeholder="PageView" />
      </>}
      {form.pixelProvider === "google_ads" && <>
        <MiniInput label="Conversion ID" value={form.googleConversionId} onChange={(value) => setForm({ ...form, googleConversionId: value })} placeholder="AW-123456789" />
        <MiniInput label="Conversion label" value={form.googleLabel} onChange={(value) => setForm({ ...form, googleLabel: value })} placeholder="Optional label" />
      </>}
      {form.pixelProvider === "linkedin" && <MiniInput label="Partner ID" value={form.linkedinPartnerId} onChange={(value) => setForm({ ...form, linkedinPartnerId: value })} placeholder="123456" />}
      {isGenericPixelProvider(form.pixelProvider) && <>
        <MiniInput label="Pixel / tag ID" value={form.genericPixelId} onChange={(value) => setForm({ ...form, genericPixelId: value })} placeholder="Pixel or tag ID" />
        <MiniInput label="Event" value={form.genericEvent} onChange={(value) => setForm({ ...form, genericEvent: value })} placeholder="PageView" />
        <MiniInput label="Label" value={form.genericLabel} onChange={(value) => setForm({ ...form, genericLabel: value })} placeholder="Optional label" />
      </>}
      {form.pixelProvider === "custom_image" && <MiniInput label="Pixel image URL" value={form.pixelUrl} onChange={(value) => setForm({ ...form, pixelUrl: value })} placeholder="https://pixel.example.com/track.gif" />}
      <button
        type="button"
        disabled={!draft}
        onClick={() => draft && setForm(resetPixelDraft({ ...form, pixelsJson: savePixels([...pixels, draft]) }))}
        style={{ ...miniButtonStyle, opacity: draft ? 1 : 0.55, cursor: draft ? "pointer" : "not-allowed", justifySelf: "start" }}
      >
        Add pixel to this link
      </button>
      {savedPixels.length > 0 && <div style={{ display: "grid", gap: 8 }}>
        <p style={{ margin: 0, color: "#667085", fontSize: 12, fontWeight: 700 }}>Saved workspace pixels</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {savedPixels.map((setting) => (
            <button
              key={setting.id}
              type="button"
              onClick={() => {
                const pixel = settingToPixel(setting);
                if (pixel) setForm({ ...form, pixelsJson: savePixels([...pixels, pixel]) });
              }}
              style={miniButtonStyle}
            >
              Add {setting.name}
            </button>
          ))}
        </div>
      </div>}
      <div style={{ display: "grid", gap: 8 }}>
        {pixels.length === 0 ? <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>No pixels added yet. Add Meta, Google Ads, LinkedIn, or a custom image pixel.</p> : pixels.map((pixel, index) => (
          <div key={`${pixel.provider}-${index}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: "1px solid #D9E2EC", borderRadius: 10, padding: "9px 10px", background: "#F8FAFC" }}>
            <div>
              <div style={{ color: "#1C2433", fontSize: 13, fontWeight: 800 }}>{pixelLabel(pixel)}</div>
              <div style={{ color: "#667085", fontSize: 12 }}>{pixelDetail(pixel)}</div>
            </div>
            <button
              type="button"
              aria-label="Remove pixel"
              onClick={() => setForm({ ...form, pixelsJson: savePixels(pixels.filter((_, itemIndex) => itemIndex !== index)) })}
              style={{ border: "none", background: "transparent", color: "#F04438", cursor: "pointer", padding: 4 }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
      <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>Pixels fire on the short-link redirect bridge before the visitor is sent to the destination.</p>
    </div>;
  }
  if (section === "A/B Testing") {
    return <div style={advancedPanelStyle}>
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Enable A/B testing
        <select value={form.abEnabled} onChange={(event) => setForm({ ...form, abEnabled: event.target.value })} style={miniInputStyle}>
          <option value="false">Off</option>
          <option value="true">On</option>
        </select>
      </label>
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Variants
        <textarea
          value={form.abVariants}
          onChange={(event) => setForm({ ...form, abVariants: event.target.value })}
          placeholder={"https://example.com/version-b, 1, Version B\nhttps://example.com/version-c, 2, Version C"}
          style={{ ...miniInputStyle, minHeight: 92, resize: "vertical" }}
        />
      </label>
      <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>One variant per line: URL, weight, label. The original destination remains in the rotation with weight 1.</p>
    </div>;
  }
  if (section === "Deep Links") {
    return <div style={advancedPanelStyle}>
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Enable deep links
        <select value={form.deepLinksEnabled} onChange={(event) => setForm({ ...form, deepLinksEnabled: event.target.value })} style={miniInputStyle}>
          <option value="false">Off</option>
          <option value="true">On</option>
        </select>
      </label>
      <MiniInput label="iOS app URL" value={form.iosAppUrl} onChange={(value) => setForm({ ...form, iosAppUrl: value })} placeholder="yourapp://product/123" />
      <MiniInput label="iOS App Store fallback" value={form.iosStoreUrl} onChange={(value) => setForm({ ...form, iosStoreUrl: value })} placeholder="https://apps.apple.com/app/..." />
      <MiniInput label="Android app URL" value={form.androidAppUrl} onChange={(value) => setForm({ ...form, androidAppUrl: value })} placeholder="yourapp://product/123" />
      <MiniInput label="Google Play fallback" value={form.androidStoreUrl} onChange={(value) => setForm({ ...form, androidStoreUrl: value })} placeholder="https://play.google.com/store/apps/details?id=..." />
      <MiniInput label="Desktop URL" value={form.desktopUrl} onChange={(value) => setForm({ ...form, desktopUrl: value })} placeholder="https://example.com/desktop-page" />
      <MiniInput label="Web fallback URL" value={form.webFallbackUrl} onChange={(value) => setForm({ ...form, webFallbackUrl: value })} placeholder="https://example.com/mobile-fallback" />
      <p style={{ margin: 0, color: "#667085", fontSize: 12, lineHeight: 1.5 }}>
        iOS and Android visitors get an app-opening bridge first. If the app is not installed, they are sent to the store or web fallback. Desktop visitors use the desktop URL or destination URL.
      </p>
    </div>;
  }
  if (section === "Geo Targeting") {
    return <div style={advancedPanelStyle}>
      <MiniInput label="Allowed countries" value={form.geoCountries} onChange={(value) => setForm({ ...form, geoCountries: value })} placeholder="India, United States" />
      <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>Visitors outside these countries use the fallback URL if one is set.</p>
    </div>;
  }
  if (section === "Device Targeting") {
    return <div style={advancedPanelStyle}>
      <MiniInput label="Allowed device types" value={form.deviceRules} onChange={(value) => setForm({ ...form, deviceRules: value })} placeholder="Mobile, Desktop" />
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Device routing rules
        <textarea
          value={form.deviceRouteRules}
          onChange={(event) => setForm({ ...form, deviceRouteRules: event.target.value })}
          placeholder={"Mobile, https://m.example.com\nDesktop, https://example.com\nAndroid, https://play.example.com"}
          style={{ ...miniInputStyle, minHeight: 92, resize: "vertical" }}
        />
      </label>
      <MiniInput label="Device default URL" value={form.deviceDefaultUrl} onChange={(value) => setForm({ ...form, deviceDefaultUrl: value })} placeholder="https://example.com/device-fallback" />
      <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>Supported matches: Mobile, Tablet, Desktop, iOS, Android, Windows, macOS.</p>
    </div>;
  }
  if (section === "Language Targeting") {
    return <div style={advancedPanelStyle}>
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Language routing rules
        <textarea
          value={form.languageRules}
          onChange={(event) => setForm({ ...form, languageRules: event.target.value })}
          placeholder={"en, https://example.com/en\nhi, https://example.com/hi\nfr, https://example.com/fr"}
          style={{ ...miniInputStyle, minHeight: 92, resize: "vertical" }}
        />
      </label>
      <MiniInput label="Language default URL" value={form.languageDefaultUrl} onChange={(value) => setForm({ ...form, languageDefaultUrl: value })} placeholder="https://example.com/global" />
      <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>Uses the browser Accept-Language header. Add one rule per line: language code, URL.</p>
    </div>;
  }
  if (section === "Advanced Targeting") {
    return <div style={advancedPanelStyle}>
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Combined targeting rules
        <textarea
          value={form.advancedTargetRules}
          onChange={(event) => setForm({ ...form, advancedTargetRules: event.target.value })}
          placeholder={"India|United States, Mobile|iOS, en|hi, https://example.com/in-mobile\nGermany, Desktop, de, https://example.com/de-desktop"}
          style={{ ...miniInputStyle, minHeight: 110, resize: "vertical" }}
        />
      </label>
      <MiniInput label="Advanced targeting default URL" value={form.advancedTargetDefaultUrl} onChange={(value) => setForm({ ...form, advancedTargetDefaultUrl: value })} placeholder="https://example.com/global-default" />
      <p style={{ margin: 0, color: "#667085", fontSize: 12, lineHeight: 1.5 }}>Format: countries, devices, languages, URL. Use | for multiple values in a column. First full match wins.</p>
    </div>;
  }
  if (section === "IP Control") {
    return <div style={advancedPanelStyle}>
      <MiniInput label="Allowed IPs" value={form.ipWhitelist} onChange={(value) => setForm({ ...form, ipWhitelist: value })} placeholder="203.0.113.10, 198.51.100.8" />
      <MiniInput label="Blocked IPs" value={form.ipBanlist} onChange={(value) => setForm({ ...form, ipBanlist: value })} placeholder="192.0.2.44, 198.51.100.99" />
      <MiniInput label="IP fallback URL" value={form.ipFallbackUrl} onChange={(value) => setForm({ ...form, ipFallbackUrl: value })} placeholder="https://example.com/not-allowed" />
      <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>Exact IP matching is active now. CIDR ranges can be added later if needed.</p>
    </div>;
  }
  if (section === "Embed / Cloak") {
    return <div style={advancedPanelStyle}>
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Redirect mode
        <select value={form.linkMode} onChange={(event) => setForm({ ...form, linkMode: event.target.value })} style={miniInputStyle}>
          <option value="redirect">Direct redirect</option>
          <option value="cloaked">Mask/cloak inside Ziplin page</option>
          <option value="cta_overlay">CTA overlay</option>
          <option value="splash">Custom splash page</option>
          <option value="promo">Promo interstitial</option>
        </select>
      </label>
      {form.linkMode === "cta_overlay" && <>
        <MiniInput label="CTA headline" value={form.ctaHeadline} onChange={(value) => setForm({ ...form, ctaHeadline: value })} placeholder="Grab this offer" />
        <MiniInput label="CTA body" value={form.ctaBody} onChange={(value) => setForm({ ...form, ctaBody: value })} placeholder="Short message shown over the destination page" />
        <MiniInput label="CTA button label" value={form.ctaButtonLabel} onChange={(value) => setForm({ ...form, ctaButtonLabel: value })} placeholder="Claim now" />
        <MiniInput label="CTA button URL" value={form.ctaButtonUrl} onChange={(value) => setForm({ ...form, ctaButtonUrl: value })} placeholder="https://example.com/offer" />
        <MiniInput label="Coupon code" value={form.ctaCouponCode} onChange={(value) => setForm({ ...form, ctaCouponCode: value })} placeholder="SAVE20" />
      </>}
      {(form.linkMode === "splash" || form.linkMode === "promo") && <>
        <MiniInput label="Page headline" value={form.splashHeadline} onChange={(value) => setForm({ ...form, splashHeadline: value })} placeholder="Before you continue..." />
        <MiniInput label="Page body" value={form.splashBody} onChange={(value) => setForm({ ...form, splashBody: value })} placeholder="Promotional or branded message" />
        <MiniInput label="Button label" value={form.splashButtonLabel} onChange={(value) => setForm({ ...form, splashButtonLabel: value })} placeholder="Continue" />
        <MiniInput label="Auto-redirect seconds" type="number" value={form.splashCountdownSeconds} onChange={(value) => setForm({ ...form, splashCountdownSeconds: value })} placeholder="5" />
      </>}
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Embed widget
        <select value={form.embedWidgetEnabled} onChange={(event) => setForm({ ...form, embedWidgetEnabled: event.target.value })} style={miniInputStyle}>
          <option value="false">Off</option>
          <option value="true">On</option>
        </select>
      </label>
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Widget HTML
        <textarea value={form.embedWidgetCode} onChange={(event) => setForm({ ...form, embedWidgetCode: event.target.value })} placeholder={"<div>Your banner, chat widget, or CTA</div>"} style={{ ...miniInputStyle, minHeight: 96, resize: "vertical" }} />
      </label>
      <p style={{ margin: 0, color: "#667085", fontSize: 12 }}>Some sites block iframe masking. In that case users can still open the original link from the top bar.</p>
    </div>;
  }
  if (section === "Messenger Links") {
    return <div style={advancedPanelStyle}>
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Enable messenger destination
        <select value={form.messengerEnabled} onChange={(event) => setForm({ ...form, messengerEnabled: event.target.value })} style={miniInputStyle}>
          <option value="false">Off</option>
          <option value="true">On</option>
        </select>
      </label>
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Platform
        <select value={form.messengerProvider} onChange={(event) => setForm({ ...form, messengerProvider: event.target.value })} style={miniInputStyle}>
          <option value="messenger">Facebook Messenger</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="telegram">Telegram</option>
        </select>
      </label>
      <MiniInput label="Handle / phone" value={form.messengerHandle} onChange={(value) => setForm({ ...form, messengerHandle: value })} placeholder="page-name, +919876543210, or telegram_user" />
    </div>;
  }
  if (section === "vCard Link") {
    return <div style={advancedPanelStyle}>
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Enable vCard download
        <select value={form.vcardEnabled} onChange={(event) => setForm({ ...form, vcardEnabled: event.target.value })} style={miniInputStyle}>
          <option value="false">Off</option>
          <option value="true">On</option>
        </select>
      </label>
      <MiniInput label="Full name" value={form.vcardFullName} onChange={(value) => setForm({ ...form, vcardFullName: value })} placeholder="Jane Doe" />
      <MiniInput label="Phone" value={form.vcardPhone} onChange={(value) => setForm({ ...form, vcardPhone: value })} placeholder="+91 9876543210" />
      <MiniInput label="Email" value={form.vcardEmail} onChange={(value) => setForm({ ...form, vcardEmail: value })} placeholder="jane@example.com" />
      <MiniInput label="Company" value={form.vcardCompany} onChange={(value) => setForm({ ...form, vcardCompany: value })} placeholder="Company name" />
      <MiniInput label="Website" value={form.vcardWebsite} onChange={(value) => setForm({ ...form, vcardWebsite: value })} placeholder="https://example.com" />
      <MiniInput label="Note" value={form.vcardNote} onChange={(value) => setForm({ ...form, vcardNote: value })} placeholder="Optional note" />
    </div>;
  }
  return <div style={advancedPanelStyle}>
    {section === "Notes" ? (
      <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
        Internal notes
        <textarea
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
          placeholder="Add campaign notes, client context, or publishing reminders."
          style={{ ...miniInputStyle, minHeight: 110, resize: "vertical" }}
        />
      </label>
    ) : <>
    <MiniInput label="Password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} placeholder="Optional password" />
    <MiniInput label="Expires at" type="datetime-local" value={form.expiresAt} onChange={(value) => setForm({ ...form, expiresAt: value })} placeholder="" />
    <MiniInput label="Click limit" type="number" value={form.clickLimit} onChange={(value) => setForm({ ...form, clickLimit: value })} placeholder="1000" />
    <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
      Redirect status
      <select value={form.redirectStatus} onChange={(event) => setForm({ ...form, redirectStatus: event.target.value })} style={miniInputStyle}>
        <option value="302">302 temporary</option>
        <option value="301">301 permanent</option>
        <option value="307">307 temporary, preserve method</option>
      </select>
    </label>
    <MiniInput label="Fallback URL" value={form.fallbackUrl} onChange={(value) => setForm({ ...form, fallbackUrl: value })} placeholder="https://example.com/expired" />
    </>}
  </div>;
}

function isGenericPixelProvider(provider: LinkPixel["provider"]) {
  return !["custom_image", "meta", "google_ads", "linkedin"].includes(provider);
}

function buildDraftPixel(form: LinkForm): LinkPixel | null {
  const name = form.pixelName.trim() || undefined;
  if (form.pixelProvider === "custom_image") {
    const url = form.pixelUrl.trim();
    return /^https?:\/\//i.test(url) ? { provider: "custom_image", name, url } : null;
  }
  if (form.pixelProvider === "meta") {
    const pixelId = form.metaPixelId.trim();
    if (!pixelId) return null;
    return { provider: "meta", name, pixelId, event: form.metaEvent.trim() || "PageView" };
  }
  if (form.pixelProvider === "google_ads") {
    const conversionId = form.googleConversionId.trim();
    if (!conversionId) return null;
    return { provider: "google_ads", name, conversionId, label: form.googleLabel.trim() || undefined };
  }
  if (isGenericPixelProvider(form.pixelProvider)) {
    const pixelId = form.genericPixelId.trim();
    if (!pixelId) return null;
    return {
      provider: form.pixelProvider,
      name,
      pixelId,
      event: form.genericEvent.trim() || undefined,
      label: form.genericLabel.trim() || undefined,
    };
  }
  const partnerId = form.linkedinPartnerId.trim();
  return partnerId ? { provider: "linkedin", name, partnerId } : null;
}

function resetPixelDraft(form: LinkForm): LinkForm {
  return {
    ...form,
    pixelName: "",
    pixelUrl: "",
    metaPixelId: "",
    metaEvent: "PageView",
    googleConversionId: "",
    googleLabel: "",
    linkedinPartnerId: "",
    genericPixelId: "",
    genericEvent: "PageView",
    genericLabel: "",
  };
}

function settingToPixel(setting: WorkspaceSetting): LinkPixel | null {
  const config = setting.config || {};
  const provider = String(config.provider || "").toLowerCase();
  if (provider.includes("meta")) {
    const pixelId = String(config.pixelId || config.id || "").trim();
    return pixelId ? { provider: "meta", name: setting.name, pixelId, event: String(config.event || "PageView") } : null;
  }
  if (provider.includes("google")) {
    const conversionId = String(config.conversionId || config.pixelId || config.id || "").trim();
    return conversionId ? { provider: "google_ads", name: setting.name, conversionId, label: String(config.label || "") || undefined } : null;
  }
  if (provider.includes("linkedin")) {
    const partnerId = String(config.partnerId || config.pixelId || config.id || "").trim();
    return partnerId ? { provider: "linkedin", name: setting.name, partnerId } : null;
  }
  const genericProviders: LinkPixel["provider"][] = ["twitter", "tiktok", "snapchat", "pinterest", "quora", "bing", "google_analytics", "gtm", "adroll", "vk"];
  const genericProvider = genericProviders.find((item) => provider.includes(item.replace("_", "")) || provider.includes(item));
  if (genericProvider) {
    const pixelId = String(config.pixelId || config.id || config.partnerId || "").trim();
    return pixelId ? { provider: genericProvider, name: setting.name, pixelId, event: String(config.event || "") || undefined, label: String(config.label || "") || undefined } : null;
  }
  const url = String(config.url || config.pixelUrl || "").trim();
  return /^https?:\/\//i.test(url) ? { provider: "custom_image", name: setting.name, url } : null;
}

function pixelLabel(pixel: LinkPixel) {
  if (pixel.name) return pixel.name;
  if (pixel.provider === "meta") return "Meta Pixel";
  if (pixel.provider === "twitter") return "Twitter/X Pixel";
  if (pixel.provider === "google_ads") return "Google Ads Pixel";
  if (pixel.provider === "linkedin") return "LinkedIn Insight";
  if (pixel.provider === "tiktok") return "TikTok Pixel";
  if (pixel.provider === "snapchat") return "Snapchat Pixel";
  if (pixel.provider === "pinterest") return "Pinterest Tag";
  if (pixel.provider === "quora") return "Quora Pixel";
  if (pixel.provider === "bing") return "Bing UET";
  if (pixel.provider === "google_analytics") return "Google Analytics";
  if (pixel.provider === "gtm") return "Google Tag Manager";
  if (pixel.provider === "adroll") return "AdRoll Pixel";
  if (pixel.provider === "vk") return "VK Pixel";
  return "Custom pixel";
}

function pixelDetail(pixel: LinkPixel) {
  if (pixel.provider === "meta") return `${pixel.pixelId || "Meta ID"} / ${pixel.event || "PageView"}`;
  if (pixel.provider === "google_ads") return [pixel.conversionId, pixel.label].filter(Boolean).join(" / ") || "Google conversion";
  if (pixel.provider === "linkedin") return pixel.partnerId || "LinkedIn partner ID";
  if (isGenericPixelProvider(pixel.provider)) return [pixel.pixelId || pixel.id, pixel.event, pixel.label].filter(Boolean).join(" / ") || "Pixel ID";
  return pixel.url || "Custom image URL";
}

function MiniInput({ label, value, onChange, placeholder, type = "text", topicId }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; topicId?: string }) {
  return <label style={{ display: "grid", gap: 5, color: "#667085", fontSize: 12, fontWeight: 700 }}>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>{label}<HelpButton topicId={topicId || helpTopicForField(label)} label={label} /></span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid #D9E2EC", color: "#1C2433", fontSize: 13, fontFamily: "Inter, sans-serif" }} />
  </label>;
}

const createCardStyle = { background: "#FFFFFF", border: "1px solid #D9E2EC", borderRadius: 16, padding: 20, boxShadow: "0 12px 34px rgba(28,36,51,0.06)" };
const advancedPanelStyle = { display: "grid", gap: 10, padding: "12px 14px", background: "#FFFFFF", border: "1px solid #D9E2EC", borderTop: "none", borderRadius: "0 0 8px 8px", marginTop: -2, marginBottom: 8 };
const miniInputStyle = { width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid #D9E2EC", color: "#1C2433", fontSize: 13, fontFamily: "Inter, sans-serif", background: "#FFFFFF" };
const miniButtonStyle = { border: "1px solid #D9E2EC", background: "#F8FAFC", color: "#2F80ED", borderRadius: 8, padding: "7px 9px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "Inter, sans-serif" };
