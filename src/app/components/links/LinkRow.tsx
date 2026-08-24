import { BarChart2, Check, Copy, Edit3, ExternalLink, Link2, Loader2, QrCode, ShieldCheck, Trash2 } from "lucide-react";
import { domainOf } from "../../../utils/helpers/domainOf";
import { ActionBtn } from "./ActionButton";
import { ZiplinLink } from "../../services/links";
import { useState } from "react";
import { faviconUrl } from "../../../utils/helpers/faviconUrl";
import { linkColor } from "../../../utils/helpers/linkColor";
import { formatDate } from "../../../utils/helpers/formatDate";
import { TOKEN_COLOR } from "../../../utils/constants/colors.constants";

export function LinkRow({
    link, isSelected, copied, checkingId, canManage,
    onSelect, onCopy, onEdit, onDelete, onAnalytics, onQr, onHealthCheck,
}: {
    link: ZiplinLink; isSelected: boolean; copied: string | null; checkingId: string | null;
    canManage: boolean;
    onSelect: (id: string) => void;
    onCopy: (id: string, url: string) => void;
    onEdit?: (link: ZiplinLink) => void;
    onDelete: (link: ZiplinLink) => void;
    onAnalytics?: (link: ZiplinLink) => void;
    onQr?: (link: ZiplinLink) => void;
    onHealthCheck: (link: ZiplinLink) => void;
}) {
    const [hovered, setHovered] = useState(false);
    const [fvErr, setFvErr] = useState(false);
    const fv = faviconUrl(link.destinationUrl);
    const accent = linkColor(link.title);
    const isCopied = copied === link.id;
    const note = link.settings?.notes || "-";
    const channel = link.settings?.folder || "Default";

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="grid"
            style={{
                gridTemplateColumns: "36px minmax(260px, 1.5fr) 110px 150px 130px 112px",
                alignItems: "center",
                columnGap: 16,
                padding: "15px 18px",
                borderLeft: `3px solid ${isSelected ? "#0B3B78" : "transparent"}`,
                background: isSelected ? "#EEF4FF" : hovered ? "#FAFBFC" : "#fff",
                transition: "background 0.12s, border-color 0.12s",
                borderBottom: `1px solid ${TOKEN_COLOR.BORDER}`,
            }}
        >
            <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(link.id)}
                style={{ width: 14, height: 14, accentColor: "#0B3B78", flexShrink: 0, cursor: "pointer" }}
                aria-label={`Select ${link.title}`}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div style={{
                    width: 36, height: 36, borderRadius: 6, background: `${accent}12`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden",
                }}>
                    {fv && !fvErr
                        ? <img src={fv} alt="" width={19} height={19} onError={() => setFvErr(true)} style={{ borderRadius: 4 }} />
                        : <Link2 size={16} color={accent} />
                    }
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <div style={{ fontWeight: 850, fontSize: 13, color: TOKEN_COLOR.TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {link.title}
                        </div>
                        <span style={{ borderRadius: 999, background: "#F1F5F9", color: TOKEN_COLOR.MUTED, fontSize: 10, fontWeight: 800, padding: "2px 7px", flexShrink: 0 }}>
                            {link.status || "Active"}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, minWidth: 0 }}>
                        <a
                            href={link.shortUrl} target="_blank" rel="noreferrer"
                            style={{ fontSize: 12, color: "#0B3B78", textDecoration: "none", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 210 }}
                        >
                            {link.shortUrl.replace(/^https?:\/\//, "")}
                        </a>
                        <button
                            onClick={() => onCopy(link.id, link.shortUrl)}
                            style={{ border: "none", background: "transparent", cursor: "pointer", padding: 2, borderRadius: 4, color: isCopied ? TOKEN_COLOR.SUCCESS : TOKEN_COLOR.FAINT, display: "flex", alignItems: "center", flexShrink: 0 }}
                            title={isCopied ? "Copied" : "Copy short URL"}
                        >
                            {isCopied ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                        <a href={link.shortUrl} target="_blank" rel="noreferrer" style={{ color: TOKEN_COLOR.FAINT, display: "flex", flexShrink: 0 }} title="Open link">
                            <ExternalLink size={11} />
                        </a>
                    </div>
                    <div style={{ color: TOKEN_COLOR.FAINT, fontSize: 11, fontWeight: 600, marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={link.destinationUrl}>
                        {domainOf(link.destinationUrl)}
                    </div>
                </div>
            </div>

            <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: TOKEN_COLOR.TEXT, fontWeight: 900 }}>{(link.clickCount ?? 0).toLocaleString()}</div>
                <div style={{ fontSize: 10, color: TOKEN_COLOR.FAINT, fontWeight: 700 }}>total</div>
            </div>

            <div style={{ fontSize: 12, color: note === "-" ? TOKEN_COLOR.FAINT : TOKEN_COLOR.MUTED, fontWeight: 650, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={note}>
                {note}
            </div>

            <div>
                <span style={{ borderRadius: 999, background: "#F8FAFC", border: `1px solid ${TOKEN_COLOR.BORDER}`, color: TOKEN_COLOR.MUTED, fontSize: 11, fontWeight: 800, padding: "4px 9px" }}>
                    {channel}
                </span>
                <div style={{ fontSize: 10, color: TOKEN_COLOR.FAINT, fontWeight: 700, marginTop: 6 }}>
                    {formatDate(link.createdAt)}
                </div>
            </div>

            <div style={{ display: "flex", gap: 5, alignItems: "center", justifyContent: "flex-end", opacity: hovered || isSelected ? 1 : 0.92, transition: "opacity 0.15s" }}>
                <ActionBtn title="Analytics" onClick={() => onAnalytics?.(link)}>
                    <BarChart2 size={13} />
                </ActionBtn>
                <ActionBtn title="QR code" onClick={() => onQr?.(link)}>
                    <QrCode size={13} />
                </ActionBtn>
                {canManage && (
                    <>
                        <ActionBtn title="Check link health" onClick={() => onHealthCheck(link)} disabled={checkingId === link.id}>
                            {checkingId === link.id
                                ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                                : <ShieldCheck size={13} />
                            }
                        </ActionBtn>
                        <ActionBtn title="Edit link" onClick={() => onEdit?.(link)}>
                            <Edit3 size={13} />
                        </ActionBtn>
                        <ActionBtn title="Delete link" onClick={() => onDelete(link)} danger>
                            <Trash2 size={13} />
                        </ActionBtn>
                    </>
                )}
            </div>
        </div>
    );
}
