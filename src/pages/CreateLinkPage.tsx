import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  Link2, RefreshCw, ImageIcon, ChevronDown, Check, X, Loader2,
  Plus, Tag, Globe, Zap, Settings2, Folder, StickyNote, Code2,
  Link as LinkIcon, EyeOff, Hash, Shuffle, MapPin, Smartphone,
  Monitor, Clock, MousePointerClick, Lock, Image as ImageIco,
  ArrowLeft, Copy, ExternalLink, Sparkles,
} from "lucide-react";
import { createLink, checkSlug } from "../app/services/links";
import { listSettings, type WorkspaceSetting } from "../app/services/settings";
import { getAvailableRedirectDomains, type RedirectDomainOption } from "../app/services/config";

// ── Primitives ────────────────────────────────────────────────────────────────

const INPUT: React.CSSProperties = {
  width: "100%", height: 40, padding: "0 12px",
  border: "1.5px solid #E2E8F0", borderRadius: 10,
  fontSize: 13, color: "#1C252E", background: "#fff",
  fontFamily: "Inter, sans-serif", boxSizing: "border-box", outline: "none",
  transition: "border-color 0.15s",
};

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!on)} style={{
      width: 40, height: 22, borderRadius: 11, border: "none", cursor: "pointer",
      background: on ? "#081C45" : "#CBD5E1",
      position: "relative", flexShrink: 0, transition: "background 0.2s",
      padding: 0,
    }}>
      <span style={{
        position: "absolute", top: 3, left: on ? 21 : 3, width: 16, height: 16,
        borderRadius: "50%", background: "#fff", transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

function SectionCard({ icon: Icon, title, accent = "#637381", children, badge }: {
  icon: React.ElementType; title: string; accent?: string;
  children: React.ReactNode; badge?: string;
}) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid #F1F5F9", background: "#FAFBFC" }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} color={accent} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 13, color: "#1C252E", flex: 1 }}>{title}</span>
        {badge && (
          <span style={{ background: "rgba(8,28,69,0.08)", color: "#081C45", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, letterSpacing: "0.04em" }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: "16px 18px" }}>{children}</div>
    </div>
  );
}

function AdvCard({ icon: Icon, title, toggle, toggled, onToggle, children, accent = "#637381" }: {
  icon: React.ElementType; title: string; accent?: string;
  toggle?: boolean; toggled?: boolean; onToggle?: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div style={{
      border: `1.5px solid ${toggled && toggle ? "rgba(8,28,69,0.2)" : "#E2E8F0"}`,
      borderRadius: 12, padding: "14px 16px",
      background: toggled && toggle ? "rgba(8,28,69,0.05)" : "#FAFBFC",
      transition: "all 0.15s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: children ? 10 : 0 }}>
        <Icon size={14} color={toggled && toggle ? "#081C45" : accent} />
        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#1C252E" }}>{title}</span>
        {toggle && onToggle !== undefined && toggled !== undefined && (
          <Toggle on={toggled} onChange={onToggle} />
        )}
      </div>
      {children}
    </div>
  );
}

type SlugStatus = "idle" | "checking" | "available" | "taken" | "error";

function cleanInitialUrl(value: string | null) {
  const trimmed = String(value || "").trim();
  return trimmed === "[object Object]" ? "" : trimmed;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CreateLinkPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [url, setUrl] = useState(cleanInitialUrl(searchParams.get("url")));
  const [urlError, setUrlError] = useState("");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [domains, setDomains] = useState<RedirectDomainOption[]>([]);
  const [shortDomain, setShortDomain] = useState("");
  const [slug, setSlug] = useState("");
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [copied, setCopied] = useState(false);

  const [pixels, setPixels] = useState<WorkspaceSetting[]>([]);
  const [selectedPixels, setSelectedPixels] = useState<string[]>([]);

  const [utm, setUtm] = useState({ campaign: "", medium: "", source: "", term: "", content: "" });
  const [utmTemplates, setUtmTemplates] = useState<WorkspaceSetting[]>([]);
  const [showUtmDrop, setShowUtmDrop] = useState(false);

  const [advOpen, setAdvOpen] = useState(false);
  const [folders, setFolders] = useState<WorkspaceSetting[]>([]);
  const [folder, setFolder] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [embedEnabled, setEmbedEnabled] = useState(false);
  const [deepLinkEnabled, setDeepLinkEnabled] = useState(false);
  const [cloakEnabled, setCloakEnabled] = useState(false);
  const [abEnabled, setAbEnabled] = useState(false);
  const [abVariants, setAbVariants] = useState([{ url: "", weight: 100 }]);
  const [expireEnabled, setExpireEnabled] = useState(false);
  const [expireAt, setExpireAt] = useState("");
  const [clickLimitEnabled, setClickLimitEnabled] = useState(false);
  const [clickLimit, setClickLimit] = useState("");
  const [passwordEnabled, setPasswordEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [favicon, setFavicon] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    getAvailableRedirectDomains().then((list) => {
      setDomains(list);
      const custom = list.find((d) => d.source === "custom");
      const def = list.find((d) => d.isDefault && d.source === "system");
      const auto = custom ?? def;
      if (auto) setShortDomain(auto.domain);
    }).catch(() => { });
    listSettings("pixel").then(setPixels).catch(() => { });
    listSettings("utm").then(setUtmTemplates).catch(() => { });
    listSettings("folder").then(setFolders).catch(() => { });
  }, []);

  const checkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runSlugCheck = useCallback((value: string) => {
    if (checkTimer.current) clearTimeout(checkTimer.current);
    if (!value.trim()) { setSlugStatus("idle"); return; }
    setSlugStatus("checking");
    checkTimer.current = setTimeout(async () => {
      try {
        const { available } = await checkSlug(value.trim());
        setSlugStatus(available ? "available" : "taken");
      } catch { setSlugStatus("error"); }
    }, 500);
  }, []);
  useEffect(() => { runSlugCheck(slug); }, [slug, runSlugCheck]);

  function validateUrl(v: string) {
    if (!v.trim()) return "Destination URL is required.";
    if (!/^https?:\/\//i.test(v.trim())) return "Must start with https:// or http://";
    return "";
  }

  function handleImageFile(file: File) {
    const r = new FileReader();
    r.onload = (e) => setImagePreview(e.target?.result as string);
    r.readAsDataURL(file);
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

  const shortUrlPreview = `${domainLabel(shortDomain)}/${slug.trim() || "auto"}`;

  function copyShortUrl() {
    navigator.clipboard.writeText(`https://${shortUrlPreview}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

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
      await createLink({
        title: title.trim(),
        destinationUrl: finalUrl,
        slug: slug.trim() || undefined,
        shortDomain: shortDomain || null,
        settings: {
          folder: folder || undefined,
          notes: notes.trim() || undefined,
          tags: tags.length ? tags : undefined,
          linkMode: cloakEnabled ? "cloaked" : undefined,
          password: passwordEnabled && password ? password : undefined,
          expiresAt: expireEnabled && expireAt ? expireAt : undefined,
          clickLimit: clickLimitEnabled && clickLimit ? Number(clickLimit) : undefined,
          embedWidget: embedEnabled ? { enabled: true } : undefined,
          deepLinks: deepLinkEnabled ? { enabled: true } : undefined,
          abTesting: abEnabled ? { enabled: true, variants: abVariants.filter((v) => v.url.trim()) } : undefined,
          socialPreview: { title: title.trim(), description: description.trim() || undefined, imageUrl: imagePreview ?? undefined },
          pixels: selectedPixels?.map((id) => {
            const p = pixels.find((px) => px.id === id);
            return { provider: (p?.config?.provider as string) ?? "custom", name: p?.name, pixelId: p?.config?.pixelId as string };
          }),
        },
      });
      navigate("/links");
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to create link");
    } finally { setSaving(false); }
  }

  const hasUtm = Object.values(utm).some((v) => v.trim());

  return (
    <div style={{ minHeight: "100%", background: "#F4F6F8", fontFamily: "Inter, Arial, sans-serif", paddingBottom: 48 }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .input-focus:focus { border-color: #081C45 !important; box-shadow: 0 0 0 3px rgba(8,28,69,0.1); }
        .hover-card:hover { border-color: #CBD5E1 !important; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 32px", height: 60, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 40 }}>
        <button type="button" onClick={() => navigate("/links")} style={{
          display: "flex", alignItems: "center", gap: 6, border: "none", background: "transparent",
          cursor: "pointer", color: "#637381", fontSize: 13, fontWeight: 600, padding: "6px 10px",
          borderRadius: 8, fontFamily: "Inter, sans-serif", transition: "background 0.15s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <ArrowLeft size={15} /> Back
        </button>
        <div style={{ width: 1, height: 24, background: "#E2E8F0" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, rgba(8,28,69,0.12), rgba(8,28,69,0.06))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Link2 size={14} color="#081C45" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#1C252E" }}>Create Short Link</span>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button type="button" onClick={() => navigate("/links")} style={{
            height: 36, paddingInline: 16, borderRadius: 8, border: "1.5px solid #E2E8F0",
            background: "#fff", fontSize: 13, fontWeight: 600, color: "#637381", cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || slugStatus === "taken"}
            style={{
              height: 36, paddingInline: 20, borderRadius: 8, border: "none",
              background: saving || slugStatus === "taken" ? "#CBD5E1" : "linear-gradient(135deg, #081C45, #0E2F73)",
              color: "#fff", fontSize: 13, fontWeight: 700, cursor: saving || slugStatus === "taken" ? "not-allowed" : "pointer",
              fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 7,
              boxShadow: saving || slugStatus === "taken" ? "none" : "0 2px 8px rgba(8,28,69,0.35)",
            }}
          >
            {saving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={14} />}
            {saving ? "Creating…" : "Create Link"}
          </button>
        </div>
      </div>

      <form
        className="p-6 max-w-[1600px] mx-auto"
        onSubmit={handleSubmit} >

        {/* URL input bar */}
        <div style={{
          background: "#fff",
          border: `1.5px solid ${urlError ? "#FF5630" : "#E2E8F0"}`,
          borderRadius: 14, padding: "4px 6px 4px 6px",
          marginBottom: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", height: 44, borderRadius: 9, background: "#F4F6F8", flexShrink: 0 }}>
            <Link2 size={14} color="#637381" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#637381" }}>URL</span>
          </div>
          <input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setUrlError(validateUrl(e.target.value)); }}
            onBlur={(e) => setUrlError(validateUrl(e.target.value))}
            placeholder="Paste your long URL here…"
            style={{ flex: 1, height: 44, padding: "0 12px", border: "none", fontSize: 14, color: "#1C252E", background: "transparent", fontFamily: "Inter, sans-serif", outline: "none" }}
          />
          {url && (
            <button type="button" onClick={() => { setUrl(""); setUrlError(""); }} style={{
              width: 32, height: 32, border: "none", borderRadius: 8, background: "#F4F6F8",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9AA4AE", flexShrink: 0,
            }}>
              <X size={13} />
            </button>
          )}
          {url && !urlError && (
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, border: "1.5px solid #E2E8F0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#9AA4AE", textDecoration: "none", flexShrink: 0 }}>
              <ExternalLink size={13} />
            </a>
          )}
        </div>
        {urlError && (
          <p style={{ fontSize: 12, color: "#FF5630", marginTop: -12, marginBottom: 16, fontWeight: 500 }}>⚠ {urlError}</p>
        )}

        {/* Short URL preview bar */}
        <div style={{
          background: "linear-gradient(135deg, rgba(8,28,69,0.05), rgba(8,28,69,0.02))",
          border: "1.5px solid rgba(8,28,69,0.18)",
          borderRadius: 12, padding: "10px 16px",
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 24,
        }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "#081C45", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Link2 size={12} color="#fff" />
          </div>
          <span style={{ fontSize: 13, color: "#0E2F73", fontWeight: 600, flex: 1 }}>
            Your short link: <strong style={{ color: "#3b0764" }}>https://{shortUrlPreview}</strong>
          </span>
          <button type="button" onClick={copyShortUrl} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7,
            border: "1px solid rgba(8,28,69,0.25)", background: copied ? "#081C45" : "#fff",
            color: copied ? "#fff" : "#081C45", fontSize: 12, fontWeight: 700, cursor: "pointer",
            transition: "all 0.15s", fontFamily: "Inter, sans-serif",
          }}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* Main two-column */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 18, alignItems: "start", marginBottom: 18 }}>

          {/* Left — social preview */}
          <SectionCard icon={ImageIco} title="Social Preview" accent="#081C45">
            {/* Image upload */}
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleImageFile(f); }}
              style={{
                width: "100%", aspectRatio: "1200/630", borderRadius: 12,
                border: `2px dashed ${isDragging ? "#081C45" : imagePreview ? "transparent" : "#CBD5E1"}`,
                background: isDragging ? "#EDE9FE" : imagePreview ? "transparent" : "#F8FAFC",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: "pointer", marginBottom: 16, overflow: "hidden", position: "relative",
                transition: "all 0.15s",
              }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0)")}
                  />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                    style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                    <X size={13} />
                  </button>
                  <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                    Click to change
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: isDragging ? "rgba(8,28,69,0.15)" : "rgba(8,28,69,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ImageIcon size={22} color={isDragging ? "#081C45" : "#164BB7"} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1C252E", margin: 0 }}>{isDragging ? "Drop to upload" : "Upload preview image"}</p>
                    <p style={{ fontSize: 11, color: "#94A3B8", margin: "3px 0 0" }}>1200 × 630 · PNG, JPG, WEBP</p>
                  </div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }} />
            </div>

            {/* Title */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#637381", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
                Link Title <span style={{ color: "#FF5630" }}>*</span>
              </label>
              <input
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (e.target.value.trim()) setTitleError(""); }}
                placeholder="Give your link a descriptive title"
                className="input-focus"
                style={{ ...INPUT, borderColor: titleError ? "#FF5630" : "#E2E8F0" }}
              />
              {titleError && <p style={{ fontSize: 11, color: "#FF5630", marginTop: 4 }}>{titleError}</p>}
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#637381", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description shown when link is shared"
                rows={3}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, color: "#1C252E", background: "#fff", fontFamily: "Inter, sans-serif", resize: "vertical", boxSizing: "border-box", outline: "none", transition: "border-color 0.15s" }}
                onFocus={(e) => (e.target.style.borderColor = "#081C45")}
                onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
              />
            </div>
          </SectionCard>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Domain & Slug */}
            <SectionCard icon={Globe} title="Short Link" accent="#081C45">
              {domains.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#637381", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Domain</label>
                  <div style={{ position: "relative" }}>
                    <select value={shortDomain} onChange={(e) => setShortDomain(e.target.value)}
                      style={{ ...INPUT, appearance: "none", paddingRight: 30, cursor: "pointer" }}>
                      {domains.map((d) => (
                        <option key={d.domain} value={d.domain}>
                          {d.domain}{d.source === "custom" ? " (yours)" : d.isDefault ? " (default)" : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} color="#637381" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#637381", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>
                  Custom Slug <span style={{ fontWeight: 500, textTransform: "none", fontSize: 10 }}>(optional)</span>
                </label>
                <div style={{
                  display: "flex", alignItems: "center",
                  border: `1.5px solid ${slugStatus === "taken" ? "#FF5630" : slugStatus === "available" ? "#10b981" : "#E2E8F0"}`,
                  borderRadius: 10, overflow: "hidden", background: "#fff",
                  transition: "border-color 0.15s",
                }}>
                  <span style={{ padding: "0 10px", fontSize: 12, color: "#94A3B8", fontWeight: 600, borderRight: "1px solid #F1F5F9", flexShrink: 0, lineHeight: "40px" }}>
                    /{" "}
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                    placeholder="my-custom-slug"
                    style={{ flex: 1, height: 40, padding: "0 10px", border: "none", fontSize: 13, color: "#1C252E", background: "transparent", fontFamily: "Inter, sans-serif", outline: "none" }}
                  />
                  <div style={{ width: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {slugStatus === "checking" && <Loader2 size={14} color="#9AA4AE" style={{ animation: "spin 1s linear infinite" }} />}
                    {slugStatus === "available" && <Check size={14} color="#10b981" />}
                    {slugStatus === "taken" && <X size={14} color="#FF5630" />}
                  </div>
                </div>
                {slugStatus === "available" && <p style={{ fontSize: 11, color: "#10b981", marginTop: 4, fontWeight: 600 }}>✓ Available</p>}
                {slugStatus === "taken" && <p style={{ fontSize: 11, color: "#FF5630", marginTop: 4, fontWeight: 600 }}>✗ Already taken</p>}

                <div style={{ marginTop: 10, padding: "8px 12px", background: "#F8FAFC", borderRadius: 8, border: "1px solid #F1F5F9" }}>
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: 0, fontFamily: "monospace" }}>
                    {domainLabel(shortDomain)}/{slug.trim() || <span style={{ fontStyle: "italic" }}>auto-generated</span>}
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Pixels */}
            {pixels.length > 0 && (
              <SectionCard icon={Zap} title="Tracking Pixels" accent="#F59E0B">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {pixels.map((px) => {
                    const sel = selectedPixels.includes(px.id);
                    return (
                      <button key={px.id} type="button"
                        onClick={() => setSelectedPixels((p) => sel ? p.filter((id) => id !== px.id) : [...p, px.id])}
                        style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                          borderRadius: 9, cursor: "pointer",
                          border: `1.5px solid ${sel ? "#081C45" : "#E2E8F0"}`,
                          background: sel ? "rgba(8,28,69,0.06)" : "#FAFBFC",
                          fontSize: 13, color: "#1C252E", fontFamily: "Inter, sans-serif",
                          transition: "all 0.15s",
                        }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: sel ? "#081C45" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                          {sel ? <Check size={12} color="#fff" /> : <Plus size={12} color="#9AA4AE" />}
                        </div>
                        <span style={{ flex: 1, fontWeight: 600 }}>{px.name}</span>
                        {sel && <span style={{ fontSize: 10, color: "#081C45", fontWeight: 700 }}>ACTIVE</span>}
                      </button>
                    );
                  })}
                </div>
              </SectionCard>
            )}

            {/* UTM */}
            <SectionCard icon={Tag} title="UTM Parameters" accent="#081C45" badge={hasUtm ? "Active" : undefined}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                {(["campaign", "medium", "source", "term", "content"] as const).map((key) => (
                  <div key={key} style={{ gridColumn: key === "content" ? "span 2" : undefined }}>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                      {key}
                    </label>
                    <input
                      value={utm[key]}
                      onChange={(e) => setUtm((u) => ({ ...u, [key]: e.target.value }))}
                      placeholder={`utm_${key}`}
                      className="input-focus"
                      style={{ ...INPUT, height: 36 }}
                    />
                  </div>
                ))}
              </div>
              {utmTemplates.length > 0 && (
                <div style={{ position: "relative" }}>
                  <button type="button" onClick={() => setShowUtmDrop((v) => !v)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 7, border: "1px solid #E2E8F0", background: "#fff", fontSize: 12, fontWeight: 600, color: "#637381", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                    <RefreshCw size={11} /> Use template <ChevronDown size={11} />
                  </button>
                  {showUtmDrop && (
                    <div style={{ position: "absolute", top: 36, left: 0, zIndex: 30, minWidth: 200, background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", overflow: "hidden", animation: "fadeIn 0.1s ease" }}>
                      {utmTemplates.map((t) => (
                        <button key={t.id} type="button" onClick={() => applyUtmTemplate(t)}
                          style={{ display: "block", width: "100%", padding: "10px 14px", textAlign: "left", border: "none", background: "transparent", fontSize: 13, color: "#1C252E", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#F8FAFC")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </SectionCard>

          </div>
        </div>

        {/* Advanced Options */}
        <div style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: 14, overflow: "hidden", marginBottom: 24 }}>
          <button type="button" onClick={() => setAdvOpen((v) => !v)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "16px 22px", background: advOpen ? "#FAFBFC" : "transparent", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", borderBottom: advOpen ? "1px solid #F1F5F9" : "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: advOpen ? "#F1F5F9" : "#F4F6F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Settings2 size={15} color="#637381" />
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1C252E" }}>Advanced Options</span>
              <span style={{ marginLeft: 10, fontSize: 12, color: "#94A3B8" }}>
                {advOpen ? "Collapse" : "Password, expiry, tracking, A/B testing…"}
              </span>
            </div>
            <ChevronDown size={16} color="#637381" style={{ transition: "transform 0.22s", transform: advOpen ? "rotate(180deg)" : "none" }} />
          </button>

          {advOpen && (
            <div style={{ padding: "20px 22px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                <AdvCard icon={Folder} title="Folder">
                  <div style={{ position: "relative" }}>
                    <select value={folder} onChange={(e) => setFolder(e.target.value)}
                      style={{ ...INPUT, height: 36, appearance: "none", paddingRight: 28, cursor: "pointer" }}>
                      <option value="">No folder</option>
                      {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <ChevronDown size={12} color="#9AA4AE" style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </AdvCard>

                <AdvCard icon={StickyNote} title="Notes">
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes about this link" rows={2}
                    style={{ width: "100%", padding: "8px 10px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 12, color: "#1C252E", background: "#fff", fontFamily: "Inter, sans-serif", resize: "none", boxSizing: "border-box", outline: "none" }} />
                </AdvCard>

                <AdvCard icon={Hash} title="Tags">
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: tags.length ? 8 : 0 }}>
                    {tags.map((t) => (
                      <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px 2px 10px", background: "rgba(8,28,69,0.08)", borderRadius: 20, fontSize: 11, color: "#081C45", fontWeight: 700 }}>
                        {t}
                        <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex", color: "#164BB7" }}>
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag}
                    placeholder="Type tag, press Enter" style={{ ...INPUT, height: 34 }} />
                </AdvCard>

                <AdvCard icon={Code2} title="Embed Widget" toggle toggled={embedEnabled} onToggle={setEmbedEnabled}>
                  <p style={{ fontSize: 11, color: "#637381", margin: 0, lineHeight: 1.5 }}>Adds an embed script to your link page</p>
                </AdvCard>

                <AdvCard icon={LinkIcon} title="Deep Linking" toggle toggled={deepLinkEnabled} onToggle={setDeepLinkEnabled}>
                  <p style={{ fontSize: 11, color: "#637381", margin: 0, lineHeight: 1.5 }}>Redirect to native app if installed</p>
                </AdvCard>

                <AdvCard icon={EyeOff} title="Link Cloaking" toggle toggled={cloakEnabled} onToggle={setCloakEnabled}>
                  <p style={{ fontSize: 11, color: "#637381", margin: 0, lineHeight: 1.5 }}>Hide destination URL from browser bar</p>
                </AdvCard>

                <AdvCard icon={Clock} title="Link Expiration" toggle toggled={expireEnabled} onToggle={setExpireEnabled} accent="#F59E0B">
                  {expireEnabled ? (
                    <input type="datetime-local" value={expireAt} onChange={(e) => setExpireAt(e.target.value)} style={{ ...INPUT, height: 36, marginTop: 4 }} />
                  ) : (
                    <p style={{ fontSize: 11, color: "#637381", margin: 0, lineHeight: 1.5 }}>Set an expiry date/time for this link</p>
                  )}
                </AdvCard>

                <AdvCard icon={MousePointerClick} title="Click Limit" toggle toggled={clickLimitEnabled} onToggle={setClickLimitEnabled} accent="#F59E0B">
                  {clickLimitEnabled ? (
                    <input type="number" value={clickLimit} onChange={(e) => setClickLimit(e.target.value)} placeholder="e.g. 1000" style={{ ...INPUT, height: 36, marginTop: 4 }} min={1} />
                  ) : (
                    <p style={{ fontSize: 11, color: "#637381", margin: 0, lineHeight: 1.5 }}>Disable link after N clicks</p>
                  )}
                </AdvCard>

                <AdvCard icon={Lock} title="Password Protection" toggle toggled={passwordEnabled} onToggle={setPasswordEnabled} accent="#EF4444">
                  {passwordEnabled ? (
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set a password" style={{ ...INPUT, height: 36, marginTop: 4 }} />
                  ) : (
                    <p style={{ fontSize: 11, color: "#637381", margin: 0, lineHeight: 1.5 }}>Require a password to visit this link</p>
                  )}
                </AdvCard>

                <AdvCard icon={Shuffle} title="A/B Testing" toggle toggled={abEnabled} onToggle={setAbEnabled} accent="#164BB7">
                  {abEnabled && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 6 }}>
                      {abVariants.map((v, i) => (
                        <div key={i} style={{ display: "flex", gap: 5, alignItems: "center" }}>
                          <input value={v.url} onChange={(e) => setAbVariants((prev) => prev.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
                            placeholder="URL" style={{ ...INPUT, height: 34, flex: 1 }} />
                          <input value={String(v.weight)} onChange={(e) => setAbVariants((prev) => prev.map((x, j) => j === i ? { ...x, weight: Number(e.target.value) || 0 } : x))}
                            style={{ ...INPUT, height: 34, width: 52 }} />
                          <span style={{ fontSize: 11, color: "#637381", flexShrink: 0 }}>%</span>
                          {abVariants.length > 1 && (
                            <button type="button" onClick={() => setAbVariants((prev) => prev.filter((_, j) => j !== i))}
                              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#FF5630", padding: 2 }}>
                              <X size={13} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => setAbVariants((prev) => [...prev, { url: "", weight: 0 }])}
                        style={{ fontSize: 12, color: "#164BB7", fontWeight: 700, background: "transparent", border: "none", cursor: "pointer", textAlign: "left", padding: 0, fontFamily: "Inter, sans-serif" }}>
                        + Add variant
                      </button>
                    </div>
                  )}
                </AdvCard>

                <AdvCard icon={ImageIco} title="Favicon URL">
                  <input value={favicon} onChange={(e) => setFavicon(e.target.value)} placeholder="https://…/favicon.ico" style={{ ...INPUT, height: 34 }} />
                </AdvCard>

                <AdvCard icon={MapPin} title="Geo-targeting" accent="#94a3b8">
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>Configure in Settings → Targeting</p>
                </AdvCard>

                <AdvCard icon={Smartphone} title="Device targeting" accent="#94a3b8">
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>Configure in Settings → Targeting</p>
                </AdvCard>

                <AdvCard icon={Monitor} title="OS targeting" accent="#94a3b8">
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: 0 }}>Configure in Settings → Targeting</p>
                </AdvCard>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {saveError && (
          <div style={{ background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 16, color: "#B91C1C", fontWeight: 600, fontSize: 13 }}>
            ⚠ {saveError}
          </div>
        )}
      </form>
    </div>
  );
}

