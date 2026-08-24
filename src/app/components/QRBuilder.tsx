import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Download, Pencil, Trash2, Plus, Check, Loader2, RefreshCw,
  Link,
  Wifi,
  User,
  Mail,
  MessageSquare,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Bitcoin,
  Smartphone,
  Share2,
  FileText,
  File,
  Barcode as BarcodeIcon,
  BarChart3,
  Copy,
  Eye,
  ExternalLink,
  Palette,
  QrCode,
  Search,
  Upload,

} from "lucide-react";
import { createQrCode, deleteQrCode, listQrCodes, QrCodeRecord, updateQrCode } from "../services/qr";

// ── QR type metadata ──────────────────────────────────────────────────────────

const QR_TYPES = [
  { id: "Barcode", icon: BarcodeIcon, label: "Barcode" },
  { id: "URL", icon: Link, label: "URL" },
  { id: "WiFi", icon: Wifi, label: "WiFi" },
  { id: "vCard", icon: User, label: "vCard" },
  { id: "Email", icon: Mail, label: "Email" },
  { id: "SMS", icon: MessageSquare, label: "SMS" },
  { id: "Phone", icon: Phone, label: "Phone" },
  { id: "WhatsApp", icon: MessageCircle, label: "WhatsApp" },
  { id: "Location", icon: MapPin, label: "Location" },
  { id: "Event", icon: Calendar, label: "Event" },
  { id: "Crypto", icon: Bitcoin, label: "Crypto" },
  { id: "App Store", icon: Smartphone, label: "App Store" },
  { id: "Social Profile", icon: Share2, label: "Social" },
  { id: "Text", icon: FileText, label: "Text" },
  { id: "File", icon: File, label: "File" },
];
const DYNAMIC_QR_TYPES = new Set(["URL"]);
// ── Color presets ─────────────────────────────────────────────────────────────

const PREVIOUS_DEFAULT_QR_FG = "#081C45";
const PREVIOUS_DEFAULT_QR_BG = "#FFF6CC";
const DEFAULT_QR_FG = "#F4B400";
const DEFAULT_QR_BG = "#081C45";
const DEFAULT_QR_GRADIENT = "solid";
const FG_PRESETS = ["#F4B400", "#FFC60A", "#081C45", "#0E2F73", "#164BB7", "#000000"];
const BG_PRESETS = ["#081C45", "#0E2F73", "#164BB7", "#FFFFFF", "#FFF6CC", "#FFF7D6"];

function qrDesignColor(design: Record<string, unknown> | undefined, key: "fgColor" | "bgColor") {
  const fg = String(design?.fgColor || "");
  const bg = String(design?.bgColor || "");
  const isPreviousDefault = fg === PREVIOUS_DEFAULT_QR_FG && bg === PREVIOUS_DEFAULT_QR_BG;
  if (isPreviousDefault) return key === "fgColor" ? DEFAULT_QR_FG : DEFAULT_QR_BG;
  const value = String(design?.[key] || "");
  return value || (key === "fgColor" ? DEFAULT_QR_FG : DEFAULT_QR_BG);
}

// ── QR Preview SVG ────────────────────────────────────────────────────────────

function QRPreview({ value, fgColor, bgColor, margin, size, errorCorrectionLevel, matrixStyle, eyeFrameStyle, gradientMode, logoDataUrl = "", logoSize = 18 }: {
  value: string; fgColor: string; bgColor: string; margin: number; size: number;
  errorCorrectionLevel: string; matrixStyle: string; eyeFrameStyle: string; gradientMode: string; logoDataUrl?: string; logoSize?: number;
}) {
  const qr = useMemo(() => {
    try { return QRCode.create(value || "https://example.com", { errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H" }); }
    catch { return null; }
  }, [errorCorrectionLevel, value]);

  if (!qr) return <div style={{ width: size, height: size, display: "grid", placeItems: "center", color: "#667085" }}>Generating…</div>;

  const moduleCount = qr.modules.size;
  const viewSize = moduleCount + margin * 2;
  const cells = Array.from(qr.modules.data);
  const moduleFill = gradientMode === "solid" ? fgColor : "url(#qg)";
  const radius = matrixStyle === "rounded" ? 0.28 : 0;
  const finderOrigins = [{ row: 0, col: 0 }, { row: 0, col: moduleCount - 7 }, { row: moduleCount - 7, col: 0 }];
  const isFinder = (row: number, col: number) => finderOrigins.some((o) => row >= o.row && row < o.row + 7 && col >= o.col && col < o.col + 7);
  const safeLogoSize = Math.max(10, Math.min(logoSize, 30));
  const logoBox = Math.max(5, Math.round((moduleCount * safeLogoSize) / 100));
  const logoX = margin + (moduleCount - logoBox) / 2;
  const logoY = margin + (moduleCount - logoBox) / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${viewSize} ${viewSize}`} role="img" aria-label="QR code preview">
      <defs>
        <linearGradient id="qg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={fgColor} />
          <stop offset="100%" stopColor="#164BB7" />
        </linearGradient>
        <radialGradient id="qgr">
          <stop offset="0%" stopColor="#164BB7" />
          <stop offset="100%" stopColor={fgColor} />
        </radialGradient>
      </defs>
      <rect width={viewSize} height={viewSize} fill={bgColor} />
      {cells.map((enabled, index) => {
        if (!enabled) return null;
        const row = Math.floor(index / moduleCount), col = index % moduleCount;
        if (isFinder(row, col)) return null;
        const x = col + margin, y = row + margin;
        const fill = gradientMode === "radial" ? "url(#qgr)" : moduleFill;
        if (matrixStyle === "dots") return <circle key={index} cx={x + 0.5} cy={y + 0.5} r={0.38} fill={fill} />;
        return <rect key={index} x={x + 0.06} y={y + 0.06} width={0.88} height={0.88} rx={radius} fill={fill} />;
      })}
      {finderOrigins.map((origin) => {
        const x = origin.col + margin, y = origin.row + margin;
        const fill = gradientMode === "radial" ? "url(#qgr)" : moduleFill;
        const outerR = eyeFrameStyle === "circle" ? 3.5 : eyeFrameStyle === "rounded" ? 1.2 : 0;
        const innerR = eyeFrameStyle === "circle" ? 1.5 : eyeFrameStyle === "rounded" ? 0.6 : 0;
        if (eyeFrameStyle === "circle") return (
          <g key={`${origin.row}-${origin.col}`}>
            <circle cx={x + 3.5} cy={y + 3.5} r={3.45} fill={fill} />
            <circle cx={x + 3.5} cy={y + 3.5} r={2.25} fill={bgColor} />
            <circle cx={x + 3.5} cy={y + 3.5} r={1.35} fill={fill} />
          </g>
        );
        return (
          <g key={`${origin.row}-${origin.col}`}>
            <rect x={x} y={y} width={7} height={7} rx={outerR} fill={fill} />
            <rect x={x + 1} y={y + 1} width={5} height={5} rx={innerR} fill={bgColor} />
            <rect x={x + 2} y={y + 2} width={3} height={3} rx={innerR} fill={fill} />
          </g>
        );
      })}
      {logoDataUrl && (
        <g>
          <rect x={logoX - 0.8} y={logoY - 0.8} width={logoBox + 1.6} height={logoBox + 1.6} rx={1.2} fill={bgColor} />
          <image href={logoDataUrl} x={logoX} y={logoY} width={logoBox} height={logoBox} preserveAspectRatio="xMidYMid meet" />
        </g>
      )}
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const EAN13_LEFT_ODD: Record<string, string> = {
  0: "0001101", 1: "0011001", 2: "0010011", 3: "0111101", 4: "0100011",
  5: "0110001", 6: "0101111", 7: "0111011", 8: "0110111", 9: "0001011",
};
const EAN13_LEFT_EVEN: Record<string, string> = {
  0: "0100111", 1: "0110011", 2: "0011011", 3: "0100001", 4: "0011101",
  5: "0111001", 6: "0000101", 7: "0010001", 8: "0001001", 9: "0010111",
};
const EAN13_RIGHT: Record<string, string> = {
  0: "1110010", 1: "1100110", 2: "1101100", 3: "1000010", 4: "1011100",
  5: "1001110", 6: "1010000", 7: "1000100", 8: "1001000", 9: "1110100",
};
const EAN13_PARITY: Record<string, string> = {
  0: "OOOOOO", 1: "OOEOEE", 2: "OOEEOE", 3: "OOEEEO", 4: "OEOOEE",
  5: "OEEOOE", 6: "OEEEOO", 7: "OEOEOE", 8: "OEOEEO", 9: "OEEOEO",
};

function ean13Checksum(first12: string) {
  const sum = first12.split("").reduce((total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 1 : 3), 0);
  return String((10 - (sum % 10)) % 10);
}

function normalizeEan13(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  const base = digits.padEnd(12, "0").slice(0, 12);
  if (digits.length >= 13 && digits[12] === ean13Checksum(base)) return `${base}${digits[12]}`;
  return `${base}${ean13Checksum(base)}`;
}

function BarcodePreview({ value, fgColor, bgColor, size }: { value: string; fgColor: string; bgColor: string; size: number }) {
  const digits = normalizeEan13(value || "890123456789");
  const parity = EAN13_PARITY[digits[0]] || EAN13_PARITY[0];
  let modules = "000000000";
  modules += "101";
  for (let i = 1; i <= 6; i += 1) {
    modules += parity[i - 1] === "E" ? EAN13_LEFT_EVEN[digits[i]] : EAN13_LEFT_ODD[digits[i]];
  }
  modules += "01010";
  for (let i = 7; i <= 12; i += 1) modules += EAN13_RIGHT[digits[i]];
  modules += "101";
  modules += "000000000";

  const width = 113;
  const height = 70;
  const barHeight = 48;
  const guardIndexes = new Set([9, 11, 55, 57, 59, 101, 103]);

  return (
    <svg width={size} height={Math.round(size * 0.55)} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="EAN-13 barcode preview">
      <rect width={width} height={height} fill={bgColor} />
      {modules.split("").map((bar, index) => {
        if (bar !== "1") return null;
        const isGuard = guardIndexes.has(index);
        return <rect key={index} x={index} y={8} width={1} height={isGuard ? barHeight + 7 : barHeight} fill={fgColor} />;
      })}
      <text x={7} y={65} fill={fgColor} fontFamily="Arial, sans-serif" fontSize="8">{digits[0]}</text>
      <text x={33} y={65} textAnchor="middle" fill={fgColor} fontFamily="Arial, sans-serif" fontSize="8">{digits.slice(1, 7)}</text>
      <text x={80} y={65} textAnchor="middle" fill={fgColor} fontFamily="Arial, sans-serif" fontSize="8">{digits.slice(7)}</text>
    </svg>
  );
}

function defaultQrValue(type: string) {
  const map: Record<string, string> = {
    Barcode: "890123456789",
    URL: "https://example.com", vCard: "Jane Doe", Text: "Hello from Ziplin",
    Email: "hello@example.com", Phone: "+10000000000", WiFi: "My WiFi",
    SMS: "+10000000000", WhatsApp: "+10000000000", Location: "28.6139,77.2090",
    Event: "Launch Event", Crypto: "bitcoin:wallet-address",
    "App Store": "https://apps.apple.com/app/example",
    "Social Profile": "https://instagram.com/example", File: "https://example.com/file.pdf",
  };
  return map[type] ?? "https://example.com";
}

function inputLabelFor(type: string) {
  const map: Record<string, string> = {
    Barcode: "Product code (EAN-13 / UPC digits)",
    vCard: "Full name", Text: "Text content", Email: "Email address",
    Phone: "Phone number", SMS: "Phone number", WhatsApp: "WhatsApp phone",
    Location: "Latitude,longitude or maps URL", Event: "Event name",
    Crypto: "Wallet/payment URI", "App Store": "App Store URL",
    "Social Profile": "Social profile URL", File: "File download URL", WiFi: "Network name",
  };
  return map[type] ?? "Destination URL";
}

function escapeWifi(v: string) { return v.replace(/([\\;,":])/g, "\\$1"); }

function buildQrContent(type: string, value: string, extra: { emailSubject: string; emailBody: string; wifiPassword: string; wifiEncryption: string; company: string }) {
  const text = value.trim();
  if (type === "Barcode") return normalizeEan13(text);
  if (type === "vCard") return `BEGIN:VCARD\nVERSION:3.0\nFN:${text || "Contact"}\nORG:${extra.company.trim()}\nEND:VCARD`;
  if (type === "Email") {
    const p = new URLSearchParams();
    if (extra.emailSubject.trim()) p.set("subject", extra.emailSubject.trim());
    if (extra.emailBody.trim()) p.set("body", extra.emailBody.trim());
    return `mailto:${text}${p.toString() ? `?${p.toString()}` : ""}`;
  }
  if (type === "SMS") return `SMSTO:${text}:${extra.emailBody.trim()}`;
  if (type === "Phone") return `tel:${text}`;
  if (type === "WhatsApp") return `https://wa.me/${text.replace(/[^\d]/g, "")}${extra.emailBody.trim() ? `?text=${encodeURIComponent(extra.emailBody.trim())}` : ""}`;
  if (type === "WiFi") return `WIFI:T:${escapeWifi(extra.wifiEncryption)};S:${escapeWifi(text)};P:${escapeWifi(extra.wifiPassword)};;`;
  if (type === "Location") return text.includes("http") ? text : `geo:${text}`;
  if (type === "Event") return `BEGIN:VEVENT\nSUMMARY:${text}\nDESCRIPTION:${extra.emailBody.trim()}\nEND:VEVENT`;
  return text || defaultQrValue(type);
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read logo image."));
    reader.readAsDataURL(file);
  });
}

async function fileToLogoDataUrl(file: File) {
  const original = await fileToDataUrl(file);
  if (file.type === "image/svg+xml") {
    if (original.length > 450000) throw new Error("SVG logo is too large. Use a smaller SVG or PNG.");
    return original;
  }

  const image = new Image();
  image.src = original;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Could not load logo image."));
  });

  const maxSize = 180;
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process logo image.");
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  let quality = 0.86;
  let dataUrl = canvas.toDataURL("image/png");
  while (dataUrl.length > 450000 && quality > 0.45) {
    dataUrl = canvas.toDataURL("image/jpeg", quality);
    quality -= 0.12;
  }
  if (dataUrl.length > 450000) throw new Error("Logo is too large after compression. Use a smaller image.");
  return dataUrl;
}

function escapeSvgText(v: string) { return v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" }[c] || c)); }

function wrapQrSvgWithFrame(source: string, frame: string, frameText: string, fgColor: string, bgColor: string) {
  if (frame === "none") return source;
  const showTop = ["top-text", "banner", "badge"].includes(frame);
  const showBottom = ["scan-me", "bottom-text", "ticket", "coupon"].includes(frame);
  const topSpace = showTop ? 34 : 16;
  const bottomSpace = showBottom ? 38 : 16;
  const width = 260, height = 230 + topSpace + bottomSpace;
  const radius = frame === "circle" ? 48 : frame === "ticket" ? 24 : frame === "rounded" ? 22 : 12;
  const safeText = escapeSvgText(frameText || "Scan me");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect x="6" y="6" width="${width - 12}" height="${height - 12}" rx="${radius}" fill="${bgColor}" stroke="${fgColor}" stroke-width="6"/>
    ${showTop ? `<text x="${width / 2}" y="32" text-anchor="middle" fill="${fgColor}" font-family="Arial, sans-serif" font-size="15" font-weight="700">${safeText}</text>` : ""}
    <svg x="35" y="${topSpace}" width="190" height="190">${source}</svg>
    ${showBottom ? `<text x="${width / 2}" y="${height - 22}" text-anchor="middle" fill="${fgColor}" font-family="Arial, sans-serif" font-size="15" font-weight="700">${safeText}</text>` : ""}
  </svg>`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#637381", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{children}</label>;
}

function Field({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 14 }}>{children}</div>;
}

const INPUT_STYLE: React.CSSProperties = {
  width: "100%", padding: "10px 12px",
  border: "1.5px solid #E2E8F0", borderRadius: 10,
  fontSize: 13, color: "#1C252E",
  fontFamily: "Inter, sans-serif",
  outline: "none", boxSizing: "border-box",
  transition: "border-color 0.15s",
};

function OptionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flexShrink: 0 }}>{label}</span>
      {children}
    </div>
  );
}

function VisualSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)} style={{
          padding: "4px 10px", borderRadius: 6,
          border: `1.5px solid ${value === o ? "#081C45" : "#E2E8F0"}`,
          background: value === o ? "#FFF6CC" : "#FAFBFC",
          color: value === o ? "#081C45" : "#637381",
          fontSize: 11, fontWeight: 700, cursor: "pointer",
          fontFamily: "Inter, sans-serif", transition: "all 0.12s",
        }}>
          {o}
        </button>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function QRBuilder({ initialType = "URL" }: { initialType?: string }) {
  const normalizedInitialType = QR_TYPES.some((type) => type.id === initialType) ? initialType : "URL";
  const [qrType, setQrType] = useState(normalizedInitialType);
  const [url, setUrl] = useState(defaultQrValue(normalizedInitialType));
  const [qrExtra, setQrExtra] = useState({ emailSubject: "", emailBody: "", wifiPassword: "", wifiEncryption: "WPA", company: "" });
  const [name, setName] = useState("My QR Code");
  const [isDynamic, setIsDynamic] = useState(DYNAMIC_QR_TYPES.has(normalizedInitialType));
  const [fgColor, setFgColor] = useState(DEFAULT_QR_FG);
  const [bgColor, setBgColor] = useState(DEFAULT_QR_BG);
  const [margin, setMargin] = useState(2);
  const [ecLevel, setEcLevel] = useState("M");
  const [matrixStyle, setMatrixStyle] = useState("square");
  const [eyeFrameStyle, setEyeFrameStyle] = useState("square");
  const [gradientMode, setGradientMode] = useState(DEFAULT_QR_GRADIENT);
  const [frame, setFrame] = useState("none");
  const [frameText, setFrameText] = useState("Scan me");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [logoSize, setLogoSize] = useState(18);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null);
  const [records, setRecords] = useState<QrCodeRecord[]>([]);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<"list" | "builder" | "success" | "detail">("list");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "dynamic" | "static">("all");
  const [selectedId, setSelectedId] = useState("");
  const [lastSaved, setLastSaved] = useState<QrCodeRecord | null>(null);

  const previewRef = useRef<HTMLDivElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const editingRecord = records.find((r) => r.id === editingId);
  const qrContent = buildQrContent(qrType, url, qrExtra);
  const qrValue = editingRecord?.dynamic && editingRecord.qrUrl ? editingRecord.qrUrl : qrContent;
  const encodedLabel = qrValue.length > 80 ? `${qrValue.slice(0, 80)}…` : qrValue;
  const activeRecord = records.find((r) => r.id === selectedId) || lastSaved || records[0] || null;
  const filteredRecords = records.filter((record) => {
    const text = `${record.name} ${record.qrType} ${record.destinationUrl} ${record.shortUrl || ""}`.toLowerCase();
    const matchesSearch = text.includes(query.trim().toLowerCase());
    const matchesFilter = filter === "all" || (filter === "dynamic" ? record.dynamic : !record.dynamic);
    return matchesSearch && matchesFilter;
  });
  const dynamicCount = records.filter((record) => record.dynamic).length;
  const staticCount = records.length - dynamicCount;
  const totalScans = records.reduce((total, record) => total + Number((record.design as any)?.scans || 0), 0);

  async function loadQrCodes(silent = false) {
    if (!silent) setLoading(true);
    try { setRecords(await listQrCodes()); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    const rawPrefill = localStorage.getItem("ziplin-qr-prefill");
    if (rawPrefill) {
      try {
        const p = JSON.parse(rawPrefill) as { name?: string; destinationUrl?: string; qrType?: string };
        if (p.name) setName(p.name);
        if (p.qrType && QR_TYPES.some((type) => type.id === p.qrType)) {
          setQrType(p.qrType);
          setIsDynamic(DYNAMIC_QR_TYPES.has(p.qrType));
        }
        if (p.destinationUrl) setUrl(p.destinationUrl);
      } catch { /* ignore */ } finally { localStorage.removeItem("ziplin-qr-prefill"); }
    }
    loadQrCodes();
  }, []);

  useEffect(() => {
    const fn = () => { if (document.visibilityState === "visible" && !editingId) loadQrCodes(true); };
    const interval = window.setInterval(fn, 5000);
    window.addEventListener("focus", fn);
    document.addEventListener("visibilitychange", fn);
    return () => { clearInterval(interval); window.removeEventListener("focus", fn); document.removeEventListener("visibilitychange", fn); };
  }, [editingId]);

  function downloadSvg() {
    const svg = previewRef.current?.querySelector("svg");
    if (!svg) return;
    const source = new XMLSerializer().serializeToString(svg);
    const framed = qrType === "Barcode" ? source : wrapQrSvgWithFrame(source, frame, frameText, fgColor, bgColor);
    const blob = new Blob([framed], { type: "image/svg+xml;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = `${name || "qr"}.svg`; a.click();
    URL.revokeObjectURL(a.href);
  }

  async function downloadPng() {
    const svg = previewRef.current?.querySelector("svg");
    if (!svg) return;
    const source = new XMLSerializer().serializeToString(svg);
    const framed = qrType === "Barcode" ? source : wrapQrSvgWithFrame(source, frame, frameText, fgColor, bgColor);
    const blob = new Blob([framed], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024; canvas.height = Math.max(1024, Math.round((img.height / img.width) * 1024));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png"); a.download = `${name || "qr"}.png`; a.click();
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => URL.revokeObjectURL(objectUrl);
    img.src = objectUrl;
  }

  async function saveQrLink() {
    setSaving(true);
    try {
      const payload = {
        name: name || url, qrType, destinationUrl: qrContent,
        dynamic: DYNAMIC_QR_TYPES.has(qrType) ? isDynamic : false,
        design: { fgColor, bgColor, margin, errorCorrectionLevel: ecLevel, matrixStyle, eyeFrameStyle, gradientMode, frame, frameText, logoDataUrl, logoSize },
      };
      const qr = editingId ? await updateQrCode(editingId, payload) : await createQrCode(payload);
      setRecords((c) => editingId ? c.map((r) => r.id === qr.id ? qr : r) : [qr, ...c]);
      setEditingId("");
      setLastSaved(qr);
      setSelectedId(qr.id);
      setScreen("success");
      setStatus({ msg: `${editingId ? "Updated" : "Saved"}: ${qr.name}`, ok: true });
    } catch (err) {
      setStatus({ msg: err instanceof Error ? err.message : "Could not save QR", ok: false });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  }

  function editQr(record: QrCodeRecord) {
    setEditingId(record.id); setName(record.name); setQrType(record.qrType); setUrl(record.destinationUrl);
    setQrExtra({ emailSubject: "", emailBody: "", wifiPassword: "", wifiEncryption: "WPA", company: "" });
    setIsDynamic(Boolean(record.dynamic));
    setFgColor(qrDesignColor(record.design, "fgColor")); setBgColor(qrDesignColor(record.design, "bgColor"));
    setMargin(Number(record.design?.margin ?? 2)); setEcLevel(String(record.design?.errorCorrectionLevel || "M"));
    setMatrixStyle(String(record.design?.matrixStyle || "square")); setEyeFrameStyle(String(record.design?.eyeFrameStyle || "square"));
    setGradientMode(String(record.design?.gradientMode || DEFAULT_QR_GRADIENT)); setFrame(String(record.design?.frame || "none"));
    setFrameText(String(record.design?.frameText || "Scan me"));
    setLogoDataUrl(String(record.design?.logoDataUrl || ""));
    setLogoSize(Number(record.design?.logoSize ?? 18));
    setSelectedId(record.id);
    setScreen("builder");
  }

  function resetForm() {
    setEditingId(""); setName("My QR Code"); setQrType("URL"); setUrl("https://example.com"); setIsDynamic(true);
    setQrExtra({ emailSubject: "", emailBody: "", wifiPassword: "", wifiEncryption: "WPA", company: "" });
    setFgColor(DEFAULT_QR_FG); setBgColor(DEFAULT_QR_BG); setMargin(2); setEcLevel("M");
    setMatrixStyle("square"); setEyeFrameStyle("square"); setGradientMode(DEFAULT_QR_GRADIENT);
    setFrame("none"); setFrameText("Scan me"); setLogoDataUrl(""); setLogoSize(18); setStatus(null);
  }

  async function removeQr(id: string) {
    if (!confirm("Delete this QR code?")) return;
    await deleteQrCode(id);
    setRecords((c) => c.filter((r) => r.id !== id));
  }

  function startNewQr() {
    resetForm();
    setScreen("builder");
  }

  function showDetail(record: QrCodeRecord) {
    setSelectedId(record.id);
    setScreen("detail");
  }

  async function handleLogoFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus({ msg: "Please upload an image file.", ok: false });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setStatus({ msg: "Logo must be smaller than 2MB.", ok: false });
      return;
    }
    try {
      const dataUrl = await fileToLogoDataUrl(file);
      setLogoDataUrl(dataUrl);
      setEcLevel("H");
      setLogoSize((current) => Math.min(current, 20));
      setStatus({ msg: "Center image added to QR preview.", ok: true });
    } catch (err) {
      setStatus({ msg: err instanceof Error ? err.message : "Could not read logo image.", ok: false });
    }
  }

  return (
    <div style={{ minHeight: "100%", background: "#DCE7F5", fontFamily: "Inter, Arial, sans-serif", color: "#081C45" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .qr-input:focus { border-color: #0E2F73 !important; box-shadow: 0 0 0 3px rgba(10,54,117,0.1); }
        .qr-type-btn:hover { border-color: #F4B400 !important; background: #FFF7DE !important; }
      `}</style>

      {screen === "list" && (
        <div style={{ padding: "26px clamp(18px, 3vw, 44px)", maxWidth: 1320 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "center", marginBottom: 28 }}>
            <div>
              <h1 style={pageTitle}>QR Code Management</h1>
              <p style={pageSubtitle}>Create and customize dynamic QR codes for your links and offline engagement.</p>
            </div>
            <button onClick={startNewQr} style={primaryButton}><Plus size={16} /> Create new QR Code</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(150px, 1fr))", gap: 22, marginBottom: 28 }}>
            <StatCard icon={<BarChart3 size={22} />} label="Total Scans" value={totalScans.toLocaleString()} badge="+12%" />
            <StatCard icon={<Link size={22} />} label="Active QRs" value={records.length.toLocaleString()} badge="Active" muted />
            <StatCard icon={<QrCode size={22} />} label="Dynamic QRs" value={dynamicCount.toLocaleString()} badge="+08%" />
            <StatCard icon={<BarcodeIcon size={22} />} label="Static / Barcode" value={staticCount.toLocaleString()} badge="Active" muted />
          </div>

          <div style={filterBar}>
            <QrCode size={22} />
            <div style={{ minWidth: 185 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Filter QR Codes</h2>
              <p style={{ margin: "3px 0 0", color: "#667085", fontSize: 12 }}>Use filters to find specific codes</p>
            </div>
            <div style={searchBox}><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search QR Codes" style={searchInput} /></div>
            <select value={filter} onChange={(e) => setFilter(e.target.value as "all" | "dynamic" | "static")} style={selectInput}>
              <option value="all">All codes</option>
              <option value="dynamic">Dynamic</option>
              <option value="static">Static / Barcode</option>
            </select>
          </div>

          <div style={tableCard}>
            <div style={tableToolbar}>
              <Segment value={filter} onChange={setFilter} />
              <span style={{ color: "#40516A", fontSize: 12 }}>Showing {filteredRecords.length} of {records.length}</span>
            </div>
            <div style={qrTableHead}>
              <span><input type="checkbox" /></span><span>QR Code</span><span>Destination</span><span>Type</span><span>Date</span><span>Actions</span>
            </div>
            {loading ? (
              <div style={emptyState}><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading QR codes...</div>
            ) : filteredRecords.length ? filteredRecords.map((record) => (
              <div key={record.id} style={qrTableRow}>
                <span><input type="checkbox" /></span>
                <span style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <MiniPreview record={record} />
                  <span style={{ minWidth: 0 }}>
                    <strong style={{ display: "block", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{record.name}</strong>
                    <small style={{ display: "block", color: "#667085", fontSize: 11 }}>{record.dynamic ? "Dynamic QR" : "Static QR"}</small>
                  </span>
                </span>
                <span style={truncateCell}>{record.shortUrl || record.qrUrl || record.destinationUrl}</span>
                <span><Badge>{record.qrType}</Badge></span>
                <span style={{ color: "#40516A" }}>{new Date(record.createdAt).toLocaleDateString()}</span>
                <span style={{ display: "flex", gap: 8 }}>
                  <IconButton title="View" onClick={() => showDetail(record)}><Eye size={14} /></IconButton>
                  <IconButton title="Edit" onClick={() => editQr(record)}><Pencil size={14} /></IconButton>
                  <IconButton title="Delete" danger onClick={() => removeQr(record.id)}><Trash2 size={14} /></IconButton>
                </span>
              </div>
            )) : (
              <div style={emptyState}>No QR codes found. Create your first QR code.</div>
            )}
          </div>
        </div>
      )}

      {screen === "builder" && (
        <div style={{ padding: "18px clamp(16px, 2vw, 32px)", maxWidth: 1420, boxSizing: "border-box" }}>
          <div style={builderTopbar}>
            <button onClick={() => setScreen("list")} style={secondaryButton}>Back</button>
            <div style={{ flex: 1, textAlign: "center" }}>
              <h1 style={{ ...pageTitle, fontSize: 22 }}>{editingId ? "Edit QR Code" : "Create a new Code"}</h1>
              {editingId && <p style={pageSubtitle}>Editing {editingRecord?.name}</p>}
            </div>
            <button onClick={saveQrLink} disabled={saving} style={primaryButton}>
              {saving ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={15} />}
              {saving ? "Saving..." : editingId ? "Update QR Code" : "Save QR Code"}
            </button>
          </div>

          <section style={typePanel}>
            <FieldLabel>QR Type</FieldLabel>
            <div style={typeGrid}>
              {QR_TYPES.map((t) => {
                const Icon = t.icon;
                const active = qrType === t.id;
                return (
                  <button key={t.id} type="button" className="qr-type-btn" onClick={() => { setQrType(t.id); setIsDynamic(DYNAMIC_QR_TYPES.has(t.id)); setUrl(defaultQrValue(t.id)); }} style={typeButton(active)}>
                    <Icon size={15} /><span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div style={builderGrid}>
            <section>
              <div style={formPanel}>
                <h2 style={sectionTitle}>Content</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field>
                    <FieldLabel>{inputLabelFor(qrType)}</FieldLabel>
                    {qrType === "Text" ? (
                      <textarea value={url} onChange={(e) => setUrl(e.target.value)} className="qr-input" style={{ ...INPUT_STYLE, minHeight: 92, resize: "vertical" }} />
                    ) : (
                      <input value={url} onChange={(e) => setUrl(e.target.value)} className="qr-input" style={INPUT_STYLE} />
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>QR Name</FieldLabel>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="qr-input" style={INPUT_STYLE} />
                  </Field>
                </div>

                {qrType === "vCard" && <Field><FieldLabel>Company</FieldLabel><input value={qrExtra.company} onChange={(e) => setQrExtra({ ...qrExtra, company: e.target.value })} className="qr-input" style={INPUT_STYLE} /></Field>}
                {qrType === "Email" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><Field><FieldLabel>Subject</FieldLabel><input value={qrExtra.emailSubject} onChange={(e) => setQrExtra({ ...qrExtra, emailSubject: e.target.value })} className="qr-input" style={INPUT_STYLE} /></Field><Field><FieldLabel>Body / Message</FieldLabel><input value={qrExtra.emailBody} onChange={(e) => setQrExtra({ ...qrExtra, emailBody: e.target.value })} className="qr-input" style={INPUT_STYLE} /></Field></div>}
                {["SMS", "WhatsApp", "Event"].includes(qrType) && <Field><FieldLabel>Message / Description</FieldLabel><input value={qrExtra.emailBody} onChange={(e) => setQrExtra({ ...qrExtra, emailBody: e.target.value })} className="qr-input" style={INPUT_STYLE} /></Field>}
                {qrType === "WiFi" && <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 14 }}><Field><FieldLabel>Password</FieldLabel><input value={qrExtra.wifiPassword} onChange={(e) => setQrExtra({ ...qrExtra, wifiPassword: e.target.value })} className="qr-input" style={INPUT_STYLE} /></Field><Field><FieldLabel>Encryption</FieldLabel><select value={qrExtra.wifiEncryption} onChange={(e) => setQrExtra({ ...qrExtra, wifiEncryption: e.target.value })} className="qr-input" style={INPUT_STYLE}><option>WPA</option><option>WEP</option><option>nopass</option></select></Field></div>}

                <div style={dynamicNotice}>
                  <button type="button" onClick={() => DYNAMIC_QR_TYPES.has(qrType) && setIsDynamic(!isDynamic)} disabled={!DYNAMIC_QR_TYPES.has(qrType)} style={toggleStyle(isDynamic && DYNAMIC_QR_TYPES.has(qrType))}><span style={toggleKnob} /></button>
                  <div><strong>Dynamic QR</strong><p style={{ margin: "4px 0 0", color: "#40516A" }}>{!DYNAMIC_QR_TYPES.has(qrType) ? "Only URL QR codes can be dynamic." : "Update the destination after printing without changing the QR image."}</p></div>
                </div>
              </div>

              <div style={formPanel}>
                <h2 style={sectionTitle}><Palette size={16} /> Brand & Design</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <ColorPicker label="Brand colors" value={fgColor} onChange={setFgColor} colors={FG_PRESETS} />
                  <ColorPicker label="Background" value={bgColor} onChange={setBgColor} colors={BG_PRESETS} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  <Control label="Dots style"><VisualSelect options={["square", "dots", "rounded"]} value={matrixStyle} onChange={setMatrixStyle} /></Control>
                  <Control label="Corner style"><VisualSelect options={["square", "circle", "rounded"]} value={eyeFrameStyle} onChange={setEyeFrameStyle} /></Control>
                  <Control label="Gradient"><VisualSelect options={["solid", "linear", "radial"]} value={gradientMode} onChange={setGradientMode} /></Control>
                  <Control label="Error correction"><VisualSelect options={["L", "M", "Q", "H"]} value={ecLevel} onChange={setEcLevel} /></Control>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Control label={`Margin: ${margin}`}><input type="range" min={0} max={8} value={margin} onChange={(e) => setMargin(Number(e.target.value))} style={{ width: "100%", accentColor: "#0E2F73" }} /></Control>
                  <Control label="Frame">
                    <select value={frame} onChange={(e) => setFrame(e.target.value)} className="qr-input" style={INPUT_STYLE}>
                      {["none", "scan-me", "bottom-text", "top-text", "rounded", "circle", "ticket", "coupon", "badge", "banner"].map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </Control>
                </div>
                {frame !== "none" && <Field><FieldLabel>Frame text</FieldLabel><input value={frameText} onChange={(e) => setFrameText(e.target.value)} className="qr-input" style={INPUT_STYLE} /></Field>}
              </div>
            </section>

            <aside style={previewPanel}>
              <h2 style={sectionTitle}>Live Preview</h2>
              <PreviewCanvas previewRef={previewRef} qrType={qrType} qrValue={qrValue} fgColor={fgColor} bgColor={bgColor} margin={margin} ecLevel={ecLevel} matrixStyle={matrixStyle} eyeFrameStyle={eyeFrameStyle} gradientMode={gradientMode} frame={frame} frameText={frameText} logoDataUrl={logoDataUrl} logoSize={logoSize} />
              <p style={previewUrl}>{encodedLabel}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button onClick={downloadSvg} style={secondaryButton}><Download size={14} /> SVG</button>
                <button onClick={downloadPng} style={secondaryButton}><Download size={14} /> PNG</button>
              </div>
              <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" style={{ display: "none" }} onChange={(event) => handleLogoFile(event.target.files?.[0])} />
              <button type="button" style={uploadBox} onClick={() => logoInputRef.current?.click()}><Upload size={17} /> {logoDataUrl ? "Change center image" : "Click to upload center image"}</button>
              {logoDataUrl && (
                <div style={{ marginTop: 12 }}>
                  <Control label={`Center image size: ${logoSize}%`}><input type="range" min={10} max={30} value={logoSize} onChange={(event) => setLogoSize(Number(event.target.value))} style={{ width: "100%", accentColor: "#0E2F73" }} /></Control>
                  <div style={scanSafetyNote}>High error correction is enabled for center images. Keep the logo at 20% or less and scan-test before printing.</div>
                  <button type="button" onClick={() => setLogoDataUrl("")} style={{ ...secondaryButton, width: "100%" }}><Trash2 size={14} /> Remove center image</button>
                </div>
              )}
              {status && <div style={{ ...statusBox, background: status.ok ? "#ECFDF3" : "#FEF2F2", color: status.ok ? "#027A48" : "#B42318" }}>{status.msg}</div>}
            </aside>
          </div>
        </div>
      )}

      {screen === "success" && lastSaved && (
        <div style={{ padding: "40px clamp(18px, 4vw, 64px)", maxWidth: 1180 }}>
          <section style={successPanel}>
            <div style={successCheck}><Check size={24} /></div>
            <h1 style={pageTitle}>QR Code saved successfully!</h1>
            <p style={pageSubtitle}>Your dynamic QR code is active and ready to use.</p>
            <div style={successGrid}>
              <PreviewCanvas previewRef={previewRef} qrType={lastSaved.qrType} qrValue={lastSaved.qrUrl || lastSaved.destinationUrl} fgColor={qrDesignColor(lastSaved.design, "fgColor")} bgColor={qrDesignColor(lastSaved.design, "bgColor")} margin={Number(lastSaved.design?.margin ?? 2)} ecLevel={String(lastSaved.design?.errorCorrectionLevel || "M")} matrixStyle={String(lastSaved.design?.matrixStyle || "square")} eyeFrameStyle={String(lastSaved.design?.eyeFrameStyle || "square")} gradientMode={String(lastSaved.design?.gradientMode || DEFAULT_QR_GRADIENT)} frame={String(lastSaved.design?.frame || "none")} frameText={String(lastSaved.design?.frameText || "Scan me")} logoDataUrl={String(lastSaved.design?.logoDataUrl || "")} logoSize={Number(lastSaved.design?.logoSize ?? 18)} compact />
              <div>
                <FieldLabel>QR Details</FieldLabel>
                <div style={detailLine}><span>Name</span><strong>{lastSaved.name}</strong></div>
                <div style={detailLine}><span>Destination</span><strong>{lastSaved.shortUrl || lastSaved.qrUrl || lastSaved.destinationUrl}</strong></div>
                <div style={detailLine}><span>Type</span><strong>{lastSaved.qrType}</strong></div>
                <div style={detailLine}><span>Status</span><Badge>{lastSaved.dynamic ? "Dynamic" : "Static"}</Badge></div>
                <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                  <button onClick={startNewQr} style={secondaryButton}><Plus size={14} /> Create Another</button>
                  <button onClick={() => setScreen("detail")} style={primaryButton}><BarChart3 size={14} /> View Analytics</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {screen === "detail" && activeRecord && (
        <div style={{ padding: "26px clamp(18px, 3vw, 44px)", maxWidth: 1320 }}>
          <div style={builderTopbar}>
            <button onClick={() => setScreen("list")} style={secondaryButton}>Back</button>
            <div><p style={pageSubtitle}>QR Codes / {activeRecord.name}</p><h1 style={pageTitle}>{activeRecord.name}</h1></div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => editQr(activeRecord)} style={secondaryButton}><Pencil size={14} /> Edit</button>
              <button onClick={downloadPng} style={primaryButton}><Download size={14} /> Download PNG</button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 22 }}>
            <aside style={previewPanel}>
              <PreviewCanvas previewRef={previewRef} qrType={activeRecord.qrType} qrValue={activeRecord.qrUrl || activeRecord.destinationUrl} fgColor={qrDesignColor(activeRecord.design, "fgColor")} bgColor={qrDesignColor(activeRecord.design, "bgColor")} margin={Number(activeRecord.design?.margin ?? 2)} ecLevel={String(activeRecord.design?.errorCorrectionLevel || "M")} matrixStyle={String(activeRecord.design?.matrixStyle || "square")} eyeFrameStyle={String(activeRecord.design?.eyeFrameStyle || "square")} gradientMode={String(activeRecord.design?.gradientMode || DEFAULT_QR_GRADIENT)} frame={String(activeRecord.design?.frame || "none")} frameText={String(activeRecord.design?.frameText || "Scan me")} logoDataUrl={String(activeRecord.design?.logoDataUrl || "")} logoSize={Number(activeRecord.design?.logoSize ?? 18)} compact />
              <button style={secondaryButton} onClick={() => navigator.clipboard.writeText(activeRecord.shortUrl || activeRecord.qrUrl || activeRecord.destinationUrl)}><Copy size={14} /> Copy short link</button>
            </aside>
            <section style={widePanel}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 22 }}>
                <StatCard icon={<BarChart3 size={20} />} label="Total Scans" value={String((activeRecord.design as any)?.scans || 0)} badge="No change" />
                <StatCard icon={<User size={20} />} label="Unique Scans" value="0" badge="No change" muted />
                <StatCard icon={<ExternalLink size={20} />} label="Last Scanned" value="Never" badge="Active" muted />
              </div>
              <h2 style={sectionTitle}>Scan Analytics</h2>
              <div style={analyticsMock}><span style={{ height: "16%" }} /><span style={{ height: "32%" }} /><span style={{ height: "28%" }} /><span style={{ height: "54%" }} /><span style={{ height: "42%" }} /><span style={{ height: "70%" }} /><span style={{ height: "62%" }} /></div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, badge, muted = false }: { icon: React.ReactNode; label: string; value: string; badge: string; muted?: boolean }) {
  return (
    <div style={statCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#0B1020" }}>{icon}</span>
        <span style={{ ...statBadge, background: muted ? "#F1F3F7" : "#E8FAEF", color: muted ? "#40516A" : "#02A451" }}>{badge}</span>
      </div>
      <p style={{ margin: "22px 0 6px", color: "#40516A", fontSize: 13, fontWeight: 600 }}>{label}</p>
      <strong style={{ color: "#081C45", fontSize: 25, lineHeight: 1, fontWeight: 750 }}>{value}</strong>
    </div>
  );
}

function Segment({ value, onChange }: { value: "all" | "dynamic" | "static"; onChange: (value: "all" | "dynamic" | "static") => void }) {
  return (
    <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(3, 92px)", padding: 4, borderRadius: 8, background: "#F4F6FA" }}>
      {(["all", "dynamic", "static"] as const).map((item) => <button key={item} onClick={() => onChange(item)} style={segmentButton(value === item)}>{item === "all" ? "All QRs" : item[0].toUpperCase() + item.slice(1)}</button>)}
    </div>
  );
}

function MiniPreview({ record }: { record: QrCodeRecord }) {
  const design = record.design || {};
  return (
    <span style={{ width: 42, height: 42, border: "1px solid #D9E2EC", borderRadius: 6, background: "#fff", display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0 }}>
      {record.qrType === "Barcode" ? <BarcodePreview value={record.destinationUrl} fgColor={qrDesignColor(design, "fgColor")} bgColor={qrDesignColor(design, "bgColor")} size={40} /> : <QRPreview value={record.qrUrl || record.destinationUrl} fgColor={qrDesignColor(design, "fgColor")} bgColor={qrDesignColor(design, "bgColor")} margin={Number(design.margin ?? 1)} size={38} errorCorrectionLevel={String(design.errorCorrectionLevel || "M")} matrixStyle={String(design.matrixStyle || "square")} eyeFrameStyle={String(design.eyeFrameStyle || "square")} gradientMode={String(design.gradientMode || DEFAULT_QR_GRADIENT)} logoDataUrl={String(design.logoDataUrl || "")} logoSize={Number(design.logoSize ?? 18)} />}
    </span>
  );
}

function PreviewCanvas(props: { previewRef: React.RefObject<HTMLDivElement | null>; qrType: string; qrValue: string; fgColor: string; bgColor: string; margin: number; ecLevel: string; matrixStyle: string; eyeFrameStyle: string; gradientMode: string; frame: string; frameText: string; logoDataUrl?: string; logoSize?: number; compact?: boolean }) {
  const size = props.compact ? 170 : 210;
  return (
    <div style={{ width: "100%", display: "grid", placeItems: "center", padding: props.compact ? 12 : 18 }}>
      <div style={{ width: props.compact ? 210 : 260, minHeight: props.compact ? 210 : 290, background: "#fff", border: "1px solid #D9E2EC", borderRadius: 8, display: "grid", placeItems: "center", boxShadow: "0 8px 24px rgba(6,26,64,0.09)" }}>
        <div style={{ color: props.fgColor, fontSize: 12, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>{["top-text", "banner", "badge"].includes(props.frame) ? props.frameText : ""}</div>
        <div ref={props.previewRef}>
          {props.qrType === "Barcode" ? <BarcodePreview value={props.qrValue} fgColor={props.fgColor} bgColor={props.bgColor} size={size} /> : <QRPreview value={props.qrValue} fgColor={props.fgColor} bgColor={props.bgColor} margin={props.margin} size={size} errorCorrectionLevel={props.ecLevel} matrixStyle={props.matrixStyle} eyeFrameStyle={props.eyeFrameStyle} gradientMode={props.gradientMode} logoDataUrl={props.logoDataUrl} logoSize={props.logoSize} />}
        </div>
        <div style={{ color: props.fgColor, fontSize: 12, fontWeight: 700, textAlign: "center", marginTop: 8 }}>{["scan-me", "bottom-text", "ticket", "coupon"].includes(props.frame) ? props.frameText : ""}</div>
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, background: "#FFF6CC", color: "#081C45", padding: "4px 9px", fontSize: 11, fontWeight: 700 }}>{children}</span>;
}

function IconButton({ children, onClick, title, danger = false }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return <button title={title} onClick={onClick} style={{ width: 30, height: 30, border: "none", background: "transparent", color: danger ? "#C92A2A" : "#0E2F73", cursor: "pointer", display: "grid", placeItems: "center" }}>{children}</button>;
}

function ColorPicker({ label, value, onChange, colors }: { label: string; value: string; onChange: (value: string) => void; colors: string[] }) {
  return (
    <Control label={label}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {colors.map((color) => <button key={color} onClick={() => onChange(color)} style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${value === color ? "#F4B400" : "#D9E2EC"}`, background: color, cursor: "pointer" }} />)}
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: 26, height: 26, border: "none", background: "transparent" }} />
      </div>
    </Control>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 14 }}><FieldLabel>{label}</FieldLabel>{children}</div>;
}

const pageTitle: React.CSSProperties = { margin: 0, color: "#081C45", fontSize: 24, fontWeight: 750, letterSpacing: 0 };
const pageSubtitle: React.CSSProperties = { margin: "6px 0 0", color: "#40516A", fontSize: 13 };
const primaryButton: React.CSSProperties = { height: 42, border: "none", borderRadius: 4, background: "#081C45", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "0 18px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif" };
const secondaryButton: React.CSSProperties = { height: 38, border: "1px solid #C9D5E5", borderRadius: 4, background: "#FFFFFF", color: "#081C45", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 14px", fontSize: 13, fontWeight: 650, cursor: "pointer", fontFamily: "Inter, sans-serif" };
const statCard: React.CSSProperties = { background: "#FFFFFF", border: "1px solid #D9E2EC", borderRadius: 8, minHeight: 132, padding: "22px 24px", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" };
const statBadge: React.CSSProperties = { borderRadius: 4, padding: "5px 9px", fontSize: 11, fontWeight: 700 };
const filterBar: React.CSSProperties = { background: "#FFFFFF", border: "1px solid #D9E2EC", borderRadius: 8, padding: "20px 24px", display: "grid", gridTemplateColumns: "32px 190px 1fr 130px", gap: 16, alignItems: "center", marginBottom: 28 };
const searchBox: React.CSSProperties = { height: 40, border: "1px solid #D9E2EC", borderRadius: 6, background: "#FFFFFF", display: "flex", alignItems: "center", gap: 10, padding: "0 14px" };
const searchInput: React.CSSProperties = { border: "none", outline: "none", width: "100%", fontSize: 13, fontFamily: "Inter, sans-serif", color: "#081C45" };
const selectInput: React.CSSProperties = { height: 40, border: "1px solid #D9E2EC", borderRadius: 6, background: "#FFFFFF", color: "#081C45", padding: "0 10px", fontFamily: "Inter, sans-serif" };
const tableCard: React.CSSProperties = { background: "#FFFFFF", border: "1px solid #D9E2EC", borderRadius: 8, overflow: "hidden" };
const tableToolbar: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #D9E2EC" };
const qrTableHead: React.CSSProperties = { display: "grid", gridTemplateColumns: "46px 1.5fr 1.6fr 130px 130px 130px", gap: 10, padding: "14px 24px", borderBottom: "1px dashed #C9D5E5", color: "#40516A", fontSize: 12, fontWeight: 700, textTransform: "uppercase" };
const qrTableRow: React.CSSProperties = { display: "grid", gridTemplateColumns: "46px 1.5fr 1.6fr 130px 130px 130px", gap: 10, alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #EEF3F8", fontSize: 13, color: "#081C45" };
const truncateCell: React.CSSProperties = { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#40516A" };
const emptyState: React.CSSProperties = { padding: 34, textAlign: "center", color: "#667085", fontSize: 13, display: "flex", gap: 8, justifyContent: "center", alignItems: "center" };
const builderTopbar: React.CSSProperties = { background: "#FFFFFF", border: "1px solid #D9E2EC", borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 18 };
const builderGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: 18, alignItems: "start" };
const widePanel: React.CSSProperties = { background: "#FFFFFF", border: "1px solid #D9E2EC", borderRadius: 8, padding: 18 };
const previewPanel: React.CSSProperties = { background: "#FFFFFF", border: "1px solid #D9E2EC", borderRadius: 8, padding: 18, position: "sticky", top: 16 };
const typePanel: React.CSSProperties = { background: "#FFFFFF", border: "1px solid #D9E2EC", borderRadius: 8, padding: "18px 20px", marginBottom: 18, overflow: "hidden" };
const typeGrid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(15, minmax(52px, 1fr))", gap: 8 };
const formPanel: React.CSSProperties = { background: "#FFFFFF", border: "1px solid #D9E2EC", borderRadius: 8, padding: 18, marginBottom: 18 };
const sectionTitle: React.CSSProperties = { margin: "0 0 14px", color: "#081C45", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 };
const dynamicNotice: React.CSSProperties = { background: "#FFC60A", borderRadius: 6, padding: "10px 12px", display: "flex", gap: 12, alignItems: "center", color: "#081C45", fontSize: 12 };
const toggleKnob: React.CSSProperties = { width: 16, height: 16, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(15,23,42,0.2)" };
const previewUrl: React.CSSProperties = { margin: "8px 0 14px", color: "#0E2F73", fontSize: 12, wordBreak: "break-all", textAlign: "center" };
const uploadBox: React.CSSProperties = { marginTop: 12, minHeight: 54, border: "1px dashed #C9D5E5", borderRadius: 6, background: "#FFFFFF", color: "#667085", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12, cursor: "pointer" };
const statusBox: React.CSSProperties = { marginTop: 12, borderRadius: 6, padding: "9px 10px", fontSize: 12, fontWeight: 650 };
const scanSafetyNote: React.CSSProperties = { margin: "0 0 10px", borderRadius: 6, background: "#FFF6CC", color: "#081C45", padding: "8px 10px", fontSize: 11, lineHeight: 1.35 };
const successPanel: React.CSSProperties = { background: "#FFFFFF", border: "1px solid #D9E2EC", borderRadius: 8, padding: "30px 34px", textAlign: "center" };
const successCheck: React.CSSProperties = { width: 44, height: 44, borderRadius: "50%", border: "2px solid #5BD883", color: "#12B76A", display: "grid", placeItems: "center", margin: "0 auto 14px" };
const successGrid: React.CSSProperties = { marginTop: 24, display: "grid", gridTemplateColumns: "300px 1fr", gap: 28, textAlign: "left", alignItems: "center" };
const detailLine: React.CSSProperties = { display: "grid", gridTemplateColumns: "150px 1fr", gap: 12, borderBottom: "1px solid #EEF3F8", padding: "11px 0", color: "#40516A", fontSize: 13 };
const analyticsMock: React.CSSProperties = { height: 260, border: "1px solid #D9E2EC", borderRadius: 8, background: "linear-gradient(#fff, #F8FBFF)", padding: 22, display: "flex", alignItems: "end", gap: 18 };

function typeButton(active: boolean): React.CSSProperties {
  return { height: 48, border: `1px solid ${active ? "#F4B400" : "#D9E2EC"}`, borderRadius: 5, background: active ? "#FFF6CC" : "#FFFFFF", color: "#081C45", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 10, fontWeight: 650, cursor: "pointer", fontFamily: "Inter, sans-serif" };
}

function segmentButton(active: boolean): React.CSSProperties {
  return { height: 36, border: "none", borderRadius: 6, background: active ? "#FFFFFF" : "transparent", color: "#081C45", fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: active ? "0 1px 3px rgba(15,23,42,0.08)" : "none" };
}

function toggleStyle(active: boolean): React.CSSProperties {
  return { width: 40, height: 22, borderRadius: 999, border: "none", background: active ? "#081C45" : "#CBD5E1", padding: 3, cursor: "pointer", display: "flex", justifyContent: active ? "flex-end" : "flex-start" };
}


