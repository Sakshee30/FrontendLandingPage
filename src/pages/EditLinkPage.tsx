import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Link2, RefreshCw, ImageIcon, ChevronDown, Check, X, Loader2,
  Plus, Tag, Globe, Zap, Settings2, Folder, StickyNote, Code2,
  Link as LinkIcon, EyeOff, Hash, Shuffle, MapPin, Smartphone,
  Monitor, Clock, MousePointerClick, Lock, Image as ImageIco,
} from "lucide-react";
import { getLink, updateLink, checkSlug, type ZiplinLink } from "../app/services/links";
import { listSettings, type WorkspaceSetting } from "../app/services/settings";
import { getAvailableRedirectDomains, type RedirectDomainOption } from "../app/services/config";

// ── Shared primitives (mirrors CreateLinkPage) ────────────────────────────────

const INPUT: React.CSSProperties = {
  width: "100%", height: 38, padding: "0 10px",
  border: "1px solid rgba(145,158,171,0.3)", borderRadius: 8,
  fontSize: 13, color: "#1C252E", background: "#fff",
  fontFamily: "Inter, sans-serif", boxSizing: "border-box", outline: "none",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#637381", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
      {children}
    </label>
  );
}

function Card({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(145,158,171,0.2)", borderRadius: 12, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontWeight: 700, fontSize: 14, color: "#1C252E" }}>
        <Icon size={16} color="#637381" />{title}
      </div>
      {children}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)}
      style={{ width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer", background: on ? "#00A76F" : "rgba(145,158,171,0.3)", position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </button>
  );
}

function AdvCard({ icon: Icon, title, toggle, toggled, onToggle, children }: {
  icon: React.ElementType; title: string;
  toggle?: boolean; toggled?: boolean; onToggle?: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ border: "1px solid rgba(145,158,171,0.18)", borderRadius: 10, padding: 18, background: "#FAFAFA" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: children ? 12 : 0 }}>
        <Icon size={15} color="#637381" />
        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#1C252E" }}>{title}</span>
        {toggle && onToggle !== undefined && toggled !== undefined && <Toggle on={toggled} onChange={onToggle} />}
      </div>
      {children}
    </div>
  );
}

type SlugStatus = "idle" | "checking" | "available" | "taken" | "error";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EditLinkPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");

  // Basic
  const [url, setUrl]           = useState("");
  const [urlError, setUrlError] = useState("");
  const [title, setTitle]       = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Domain + slug
  const [domains, setDomains]   = useState<RedirectDomainOption[]>([]);
  const [shortDomain, setShortDomain] = useState("");
  const [slug, setSlug]         = useState("");
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");

  // Pixels
  const [pixels, setPixels]                 = useState<WorkspaceSetting[]>([]);
  const [selectedPixels, setSelectedPixels] = useState<string[]>([]);

  // UTM
  const [utm, setUtm] = useState({ campaign: "", medium: "", source: "", term: "", content: "" });
  const [utmTemplates, setUtmTemplates] = useState<WorkspaceSetting[]>([]);
  const [showUtmDrop, setShowUtmDrop]   = useState(false);

  // Advanced
  const [advOpen, setAdvOpen]   = useState(false);
  const [folders, setFolders]   = useState<WorkspaceSetting[]>([]);
  const [folder, setFolder]     = useState("");
  const [notes, setNotes]       = useState("");
  const [tags, setTags]         = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [embedEnabled, setEmbedEnabled]     = useState(false);
  const [deepLinkEnabled, setDeepLinkEnabled] = useState(false);
  const [cloakEnabled, setCloakEnabled]     = useState(false);
  const [abEnabled, setAbEnabled]           = useState(false);
  const [abVariants, setAbVariants]         = useState([{ url: "", weight: 100 }]);
  const [expireEnabled, setExpireEnabled]   = useState(false);
  const [expireAt, setExpireAt]             = useState("");
  const [clickLimitEnabled, setClickLimitEnabled] = useState(false);
  const [clickLimit, setClickLimit]         = useState("");
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword]             = useState("");
  const [favicon, setFavicon]               = useState("");

  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState("");

  // ── Load existing link ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    Promise.all([
      getLink(id),
      getAvailableRedirectDomains(),
      listSettings("pixel"),
      listSettings("utm"),
      listSettings("folder"),
    ]).then(([link, doms, pxs, utmTs, fols]) => {
      setDomains(doms);
      setPixels(pxs);
      setUtmTemplates(utmTs);
      setFolders(fols);
      hydrate(link, doms);
    }).catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  function hydrate(link: ZiplinLink, doms: RedirectDomainOption[] = []) {
    const s = link.settings ?? {};
    setUrl(link.destinationUrl ?? "");
    setTitle(link.title ?? "");
    setSlug(link.slug ?? "");
    setOriginalSlug(link.slug ?? "");
    // Restore saved shortDomain; if none, auto-select custom → system default
    if (link.shortDomain) {
      setShortDomain(link.shortDomain);
    } else {
      const custom = doms.find((d) => d.source === "custom");
      const def    = doms.find((d) => d.isDefault && d.source === "system");
      setShortDomain((custom ?? def)?.domain ?? "");
    }
    setDescription(s.socialPreview?.description ?? "");
    setImagePreview(s.socialPreview?.imageUrl ?? null);
    setNotes(s.notes ?? "");
    setTags(s.tags ?? []);
    setFolder(s.folder ?? "");
    setCloakEnabled(s.linkMode === "cloaked");
    setEmbedEnabled(s.embedWidget?.enabled ?? false);
    setDeepLinkEnabled(s.deepLinks?.enabled ?? false);
    setAbEnabled(s.abTesting?.enabled ?? false);
    setAbVariants(s.abTesting?.variants?.length ? s.abTesting.variants.map((v) => ({ url: v.url, weight: v.weight ?? 100 })) : [{ url: "", weight: 100 }]);
    setExpireEnabled(Boolean(s.expiresAt));
    setExpireAt(s.expiresAt ? new Date(s.expiresAt).toISOString().slice(0, 16) : "");
    setClickLimitEnabled(Boolean(s.clickLimit));
    setClickLimit(s.clickLimit ? String(s.clickLimit) : "");
    setPasswordEnabled(Boolean(s.password));
    setPassword(s.password ?? "");

    // Extract UTM from destination URL if present
    try {
      const u = new URL(link.destinationUrl ?? "");
      setUtm({
        campaign: u.searchParams.get("utm_campaign") ?? "",
        medium:   u.searchParams.get("utm_medium") ?? "",
        source:   u.searchParams.get("utm_source") ?? "",
        term:     u.searchParams.get("utm_term") ?? "",
        content:  u.searchParams.get("utm_content") ?? "",
      });
      // Remove UTM from the displayed URL
      ["utm_campaign","utm_medium","utm_source","utm_term","utm_content"].forEach((k) => u.searchParams.delete(k));
      const clean = u.toString();
      setUrl(clean);
    } catch { /* not a valid URL, leave as-is */ }

    // Selected pixels from stored IDs
    if (Array.isArray(s.pixels)) {
      setSelectedPixels(s.pixels.map((p: any) => p.id ?? p.pixelId ?? "").filter(Boolean));
    }
  }

  // ── Slug check (skip if unchanged) ─────────────────────────────────────────
  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runSlugCheck = useCallback((value: string) => {
    if (checkTimer.current) clearTimeout(checkTimer.current);
    if (!value.trim() || value.trim() === originalSlug) { setSlugStatus("idle"); return; }
    setSlugStatus("checking");
    checkTimer.current = setTimeout(async () => {
      try {
        const { available } = await checkSlug(value.trim());
        setSlugStatus(available ? "available" : "taken");
      } catch { setSlugStatus("error"); }
    }, 500);
  }, [originalSlug]);
  useEffect(() => { runSlugCheck(slug); }, [slug, runSlugCheck]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function validateUrl(v: string) {
    if (!v.trim()) return "Your link is required.";
    if (!/^https?:\/\//i.test(v.trim())) return "Must start with https:// or http://";
    return "";
  }
  function handleImageFile(file: File) {
    const r = new FileReader(); r.onload = (e) => setImagePreview(e.target?.result as string); r.readAsDataURL(file);
  }
  function applyUtmTemplate(t: WorkspaceSetting) {
    const c = t.config as Record<string, string>;
    setUtm({ campaign: c.campaign ?? "", medium: c.medium ?? "", source: c.source ?? "", term: c.term ?? "", content: c.content ?? "" });
    setShowUtmDrop(false);
  }
  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = tagInput.trim().replace(/,$/, "");
      if (v && !tags.includes(v)) setTags([...tags, v]);
      setTagInput("");
    }
  }

  function domainLabel(domain: string) {
    if (!domain) return domains.find((d) => d.isDefault)?.domain ?? "ziplin.io";
    return domain;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const uErr = validateUrl(url);
    if (uErr) { setUrlError(uErr); return; }
    if (!title.trim()) { setTitleError("A title is required."); return; }
    if (slugStatus === "taken") return;

    const utmParams = Object.entries(utm)
      .filter(([, v]) => v.trim())
      .map(([k, v]) => `utm_${k}=${encodeURIComponent(v.trim())}`)
      .join("&");
    const finalUrl = utmParams ? `${url.trim()}${url.includes("?") ? "&" : "?"}${utmParams}` : url.trim();

    setSaving(true); setSaveError("");
    try {
      await updateLink(id!, {
        title: title.trim(),
        destinationUrl: finalUrl,
        slug: slug.trim() || undefined,
        shortDomain: shortDomain || null,
        settings: {
          folder:       folder || undefined,
          notes:        notes.trim() || undefined,
          tags:         tags.length ? tags : undefined,
          linkMode:     cloakEnabled ? "cloaked" : undefined,
          password:     passwordEnabled && password ? password : undefined,
          expiresAt:    expireEnabled && expireAt ? expireAt : undefined,
          clickLimit:   clickLimitEnabled && clickLimit ? Number(clickLimit) : undefined,
          embedWidget:  embedEnabled ? { enabled: true } : undefined,
          deepLinks:    deepLinkEnabled ? { enabled: true } : undefined,
          abTesting:    abEnabled ? { enabled: true, variants: abVariants.filter((v) => v.url.trim()) } : undefined,
          socialPreview: {
            title:       title.trim(),
            description: description.trim() || undefined,
            imageUrl:    imagePreview ?? undefined,
          },
          pixels: selectedPixels.map((pid) => {
            const p = pixels.find((px) => px.id === pid);
            return { provider: (p?.config?.provider as string) ?? "custom", name: p?.name, pixelId: p?.config?.pixelId as string };
          }),
        },
      });
      navigate("/links");
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to save changes");
    } finally { setSaving(false); }
  }

  // ── Loading / error states ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", fontFamily: "Inter, sans-serif" }}>
        <Loader2 size={28} color="#00A76F" style={{ animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (notFound) {
    return (
      <div style={{ textAlign: "center", padding: 60, fontFamily: "Inter, sans-serif" }}>
        <p style={{ fontSize: 16, color: "#637381" }}>Link not found.</p>
        <button onClick={() => navigate("/links")} style={{ marginTop: 16, padding: "8px 20px", borderRadius: 8, border: "none", background: "#00A76F", color: "#fff", cursor: "pointer", fontWeight: 600 }}>Back to Links</button>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100%", background: "#F4F6F8", fontFamily: "Inter, Arial, sans-serif", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(145,158,171,0.2)", padding: "0 32px", height: 56, display: "flex", alignItems: "center", gap: 12 }}>
        <button type="button" onClick={() => navigate("/links")} style={{ display: "flex", alignItems: "center", gap: 6, border: "none", background: "transparent", cursor: "pointer", color: "#637381", fontSize: 13, fontWeight: 600, padding: "4px 8px", borderRadius: 6, fontFamily: "Inter, sans-serif" }}>
          ← Back to Links
        </button>
        <span style={{ color: "rgba(145,158,171,0.4)" }}>|</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#1C252E" }}>Edit Link</span>
        {originalSlug && (
          <span style={{ fontSize: 12, color: "#637381", background: "#F4F6F8", borderRadius: 6, padding: "3px 10px" }}>
            /{originalSlug}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* URL bar */}
        <div style={{ background: "#fff", border: `1px solid ${urlError ? "#FF5630" : "rgba(145,158,171,0.2)"}`, borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(145,158,171,0.3)", fontSize: 13, fontWeight: 700, color: "#1C252E", flexShrink: 0 }}>
              <Link2 size={14} color="#637381" />Link
            </div>
            <input value={url} onChange={(e) => { setUrl(e.target.value); setUrlError(validateUrl(e.target.value)); }} onBlur={(e) => setUrlError(validateUrl(e.target.value))}
              placeholder="https://yourlink.com"
              style={{ flex: 1, height: 38, padding: "0 12px", border: "none", fontSize: 14, color: "#1C252E", background: "#F4F6F8", borderRadius: 8, fontFamily: "Inter, sans-serif", outline: "none" }} />
            <button type="button" onClick={() => { setUrl(""); setUrlError(""); }} title="Clear"
              style={{ width: 34, height: 34, border: "1px solid rgba(145,158,171,0.3)", borderRadius: 8, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#637381" }}>
              <RefreshCw size={14} />
            </button>
          </div>
          {urlError && <p style={{ fontSize: 12, color: "#FF5630", marginTop: 8, fontWeight: 500 }}>{urlError}</p>}
        </div>

        {/* Two columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, alignItems: "start", marginBottom: 20 }}>

          {/* Left */}
          <Card icon={Plus} title="Link details">
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleImageFile(f); }}
              style={{ width: "100%", aspectRatio: "1200/630", borderRadius: 10, border: "2px dashed rgba(145,158,171,0.3)", background: imagePreview ? "transparent" : "#F0F7FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 16, overflow: "hidden", position: "relative" }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                    style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                    <X size={13} />
                  </button>
                </>
              ) : (
                <>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(0,122,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <ImageIcon size={24} color="#4A90D9" />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1C252E", margin: 0 }}>Upload a picture</p>
                  <p style={{ fontSize: 12, color: "#637381", margin: "4px 0 0" }}>1200 × 630 recommended</p>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <input value={title} onChange={(e) => { setTitle(e.target.value); if (e.target.value.trim()) setTitleError(""); }}
                placeholder="Title of your link *"
                style={{ ...INPUT, borderColor: titleError ? "#FF5630" : "rgba(145,158,171,0.3)" }} />
              {titleError && <p style={{ fontSize: 12, color: "#FF5630", marginTop: 4 }}>{titleError}</p>}
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={3}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid rgba(145,158,171,0.3)", borderRadius: 8, fontSize: 13, color: "#1C252E", background: "#fff", fontFamily: "Inter, sans-serif", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
          </Card>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <Card icon={Zap} title="Add Pixels ID">
              {pixels.length === 0 ? (
                <p style={{ fontSize: 13, color: "#9AA4AE", margin: 0 }}>No pixels configured.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {pixels.map((px) => {
                    const sel = selectedPixels.includes(px.id);
                    return (
                      <button key={px.id} type="button"
                        onClick={() => setSelectedPixels((p) => sel ? p.filter((i) => i !== px.id) : [...p, px.id])}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, cursor: "pointer", border: `1px solid ${sel ? "#00A76F" : "rgba(145,158,171,0.3)"}`, background: sel ? "rgba(0,167,111,0.06)" : "#fff", fontSize: 13, color: "#1C252E", fontFamily: "Inter, sans-serif" }}>
                        <span>{px.name}</span>{sel && <Check size={14} color="#00A76F" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card icon={Tag} title="Add UTM Tags">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                {(["campaign", "medium", "source", "term", "content"] as const).map((key) => (
                  <input key={key} value={utm[key]} onChange={(e) => setUtm((u) => ({ ...u, [key]: e.target.value }))}
                    placeholder={`UTM ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                    style={{ ...INPUT, gridColumn: key === "content" ? "span 2" : undefined }} />
                ))}
              </div>
              {utmTemplates.length > 0 && (
                <div style={{ position: "relative" }}>
                  <button type="button" onClick={() => setShowUtmDrop((v) => !v)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(145,158,171,0.3)", background: "#fff", fontSize: 12, fontWeight: 600, color: "#637381", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                    From template <ChevronDown size={12} />
                  </button>
                  {showUtmDrop && (
                    <div style={{ position: "absolute", top: 38, left: 0, zIndex: 30, minWidth: 200, background: "#fff", border: "1px solid rgba(145,158,171,0.2)", borderRadius: 10, boxShadow: "0 8px 20px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                      {utmTemplates.map((t) => (
                        <button key={t.id} type="button" onClick={() => applyUtmTemplate(t)}
                          style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", border: "none", background: "transparent", fontSize: 13, color: "#1C252E", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                          {t.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card icon={Globe} title="Domain & Slug">
              {domains.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <FieldLabel>Domain</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <select value={shortDomain} onChange={(e) => setShortDomain(e.target.value)}
                      style={{ ...INPUT, appearance: "none", paddingRight: 30, cursor: "pointer" }}>
                      {domains.map((d) => (
                        <option key={d.domain} value={d.domain}>
                          {d.domain}{d.source === "custom" ? " (your domain)" : d.isDefault ? " (default)" : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} color="#637381" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>
              )}
              <div>
                <FieldLabel>Slug</FieldLabel>
                <div style={{ display: "flex", alignItems: "center", border: `1px solid ${slugStatus === "taken" ? "#FF5630" : "rgba(145,158,171,0.3)"}`, borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                  <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug"
                    style={{ flex: 1, height: 38, padding: "0 10px", border: "none", fontSize: 13, color: "#1C252E", background: "transparent", fontFamily: "Inter, sans-serif", outline: "none" }} />
                  <div style={{ width: 32, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {slugStatus === "checking"  && <Loader2 size={14} color="#9AA4AE" style={{ animation: "spin 1s linear infinite" }} />}
                    {slugStatus === "available" && <Check size={14} color="#00A76F" />}
                    {slugStatus === "taken"     && <X size={14} color="#FF5630" />}
                  </div>
                </div>
                {slugStatus === "available" && <p style={{ fontSize: 11, color: "#00A76F", marginTop: 4 }}>Slug is available</p>}
                {slugStatus === "taken"     && <p style={{ fontSize: 11, color: "#FF5630", marginTop: 4 }}>This slug is already taken</p>}
                <p style={{ fontSize: 11, color: "#9AA4AE", marginTop: 8 }}>
                  <strong style={{ color: "#637381" }}>{domainLabel(shortDomain)}/{slug}</strong>
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Advanced accordion */}
        <div style={{ background: "#fff", border: "1px solid rgba(145,158,171,0.2)", borderRadius: 12, overflow: "hidden", marginBottom: 24 }}>
          <button type="button" onClick={() => setAdvOpen((v) => !v)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "18px 24px", background: "transparent", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            <Settings2 size={18} color="#637381" />
            <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: "#1C252E", textAlign: "left" }}>Advanced options</span>
            <ChevronDown size={18} color="#637381" style={{ transition: "transform 0.22s", transform: advOpen ? "rotate(180deg)" : "none" }} />
          </button>

          {advOpen && (
            <div style={{ padding: "0 20px 24px", borderTop: "1px solid rgba(145,158,171,0.12)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 20 }}>

                <AdvCard icon={Folder} title="Folder">
                  <div style={{ position: "relative" }}>
                    <select value={folder} onChange={(e) => setFolder(e.target.value)}
                      style={{ ...INPUT, appearance: "none", paddingRight: 30, cursor: "pointer", background: "#fff" }}>
                      <option value="">Select a folder</option>
                      {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <ChevronDown size={13} color="#9AA4AE" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </AdvCard>

                <AdvCard icon={StickyNote} title="Add Notes">
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes" rows={3}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid rgba(145,158,171,0.3)", borderRadius: 8, fontSize: 13, color: "#1C252E", background: "#fff", fontFamily: "Inter, sans-serif", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
                </AdvCard>

                <AdvCard icon={Code2} title="Embed Widget" toggle toggled={embedEnabled} onToggle={setEmbedEnabled}>
                  <p style={{ fontSize: 12, color: "#637381", margin: 0 }}>Activate this option to add embed script to your link</p>
                </AdvCard>

                <AdvCard icon={LinkIcon} title="Deep linking" toggle toggled={deepLinkEnabled} onToggle={setDeepLinkEnabled}>
                  <p style={{ fontSize: 12, color: "#637381", margin: 0 }}>Activate deep linking on your link.</p>
                </AdvCard>

                <AdvCard icon={EyeOff} title="Link cloaking" toggle toggled={cloakEnabled} onToggle={setCloakEnabled}>
                  <p style={{ fontSize: 12, color: "#637381", margin: 0 }}>Activate this option to cloak your link</p>
                </AdvCard>

                <AdvCard icon={Hash} title="Tags">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: tags.length ? 8 : 0 }}>
                    {tags.map((t) => (
                      <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", background: "rgba(0,167,111,0.1)", borderRadius: 20, fontSize: 12, color: "#00A76F", fontWeight: 600 }}>
                        {t}<button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex", color: "#00A76F" }}><X size={11} /></button>
                      </span>
                    ))}
                  </div>
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Add tags (press Enter)" style={INPUT} />
                </AdvCard>

                <AdvCard icon={Shuffle} title="Rotator — AB Testing" toggle toggled={abEnabled} onToggle={setAbEnabled}>
                  {abEnabled && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                      {abVariants.map((v, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <input value={v.url} onChange={(e) => setAbVariants((p) => p.map((x, j) => j === i ? { ...x, url: e.target.value } : x))} placeholder="Redirection link" style={{ ...INPUT, flex: 1 }} />
                          <input value={String(v.weight)} onChange={(e) => setAbVariants((p) => p.map((x, j) => j === i ? { ...x, weight: Number(e.target.value) || 0 } : x))} style={{ ...INPUT, width: 64 }} />
                          <span style={{ fontSize: 12, color: "#637381", flexShrink: 0 }}>%</span>
                          {abVariants.length > 1 && <button type="button" onClick={() => setAbVariants((p) => p.filter((_, j) => j !== i))} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#FF5630", padding: 4 }}><X size={14} /></button>}
                        </div>
                      ))}
                      <button type="button" onClick={() => setAbVariants((p) => [...p, { url: "", weight: 0 }])}
                        style={{ fontSize: 12, color: "#00A76F", fontWeight: 600, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0, fontFamily: "Inter, sans-serif" }}>
                        + Add a destination
                      </button>
                    </div>
                  )}
                </AdvCard>

                <AdvCard icon={MapPin} title="Geolocation">
                  <p style={{ fontSize: 12, color: "#9AA4AE", margin: 0 }}>Configure geo-targeting rules in Settings.</p>
                </AdvCard>

                <AdvCard icon={Smartphone} title="Devices">
                  <p style={{ fontSize: 12, color: "#9AA4AE", margin: 0 }}>Configure device-targeting rules in Settings.</p>
                </AdvCard>

                <AdvCard icon={Monitor} title="Operating System">
                  <p style={{ fontSize: 12, color: "#9AA4AE", margin: 0 }}>Configure OS-targeting rules in Settings.</p>
                </AdvCard>

                <AdvCard icon={Clock} title="Link Expiration" toggle toggled={expireEnabled} onToggle={setExpireEnabled}>
                  <p style={{ fontSize: 12, color: "#637381", margin: "0 0 8px" }}>Change destination after expiration date/time</p>
                  {expireEnabled && <input type="datetime-local" value={expireAt} onChange={(e) => setExpireAt(e.target.value)} style={INPUT} />}
                </AdvCard>

                <AdvCard icon={MousePointerClick} title="Clicks limit" toggle toggled={clickLimitEnabled} onToggle={setClickLimitEnabled}>
                  <p style={{ fontSize: 12, color: "#637381", margin: "0 0 8px" }}>Change destination after reaching limit of clicks</p>
                  {clickLimitEnabled && <input type="number" value={clickLimit} onChange={(e) => setClickLimit(e.target.value)} placeholder="e.g. 1000" style={INPUT} min={1} />}
                </AdvCard>

                <AdvCard icon={Lock} title="Password" toggle toggled={passwordEnabled} onToggle={setPasswordEnabled}>
                  <p style={{ fontSize: 12, color: "#637381", margin: "0 0 8px" }}>Protect your link with a password</p>
                  {passwordEnabled && <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set a password" style={INPUT} />}
                </AdvCard>

                <AdvCard icon={ImageIco} title="Favicon">
                  <input value={favicon} onChange={(e) => setFavicon(e.target.value)} placeholder="Favicon URL (16×16 - ico, gif, png, jpg)" style={INPUT} />
                </AdvCard>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "flex-end" }}>
          {saveError && <span style={{ fontSize: 13, color: "#FF5630", marginRight: "auto" }}>{saveError}</span>}
          <button type="button" onClick={() => navigate("/links")}
            style={{ height: 40, paddingInline: 20, borderRadius: 8, border: "1px solid rgba(145,158,171,0.3)", background: "#fff", fontSize: 14, fontWeight: 600, color: "#637381", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            Cancel
          </button>
          <button type="submit" disabled={saving || slugStatus === "taken"}
            style={{ height: 40, paddingInline: 24, borderRadius: 8, border: "none", background: saving || slugStatus === "taken" ? "#9AA4AE" : "#00A76F", color: "#fff", fontSize: 14, fontWeight: 700, cursor: saving || slugStatus === "taken" ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
            {saving && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
