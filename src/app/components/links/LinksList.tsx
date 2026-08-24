import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
    BarChart2,
    CalendarDays,
    Check,
    Copy,
    Edit3,
    ExternalLink,
    Filter,
    Link2,
    Loader2,
    MoreVertical,
    Plus,
    QrCode,
    Search,
    Trash2,
} from "lucide-react";
import { deleteLink, listLinks, ZiplinLink } from "../../services/links";
import { faviconUrl } from "../../../utils/helpers/faviconUrl";
import { formatDate } from "../../../utils/helpers/formatDate";

interface LinksListProps {
    onCreateLink: (initialUrl?: string) => void;
    onEditLink?: (link: ZiplinLink) => void;
    onOpenAnalytics?: (link: ZiplinLink) => void;
    onOpenQr?: (link: ZiplinLink) => void;
    canManage?: boolean;
    refreshKey?: number;
}

const navy = "#081C45";
const yellow = "#FFC60A";
const border = "#D7DFEA";
const muted = "#667085";
const text = "#081C45";

export function LinksList({
    onCreateLink,
    onEditLink,
    onOpenAnalytics,
    onOpenQr,
    canManage = false,
    refreshKey = 0,
}: LinksListProps) {
    const [links, setLinks] = useState<ZiplinLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All Links" | "Active" | "Archived">("All Links");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [copied, setCopied] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(10);

    async function loadLinks(silent = false) {
        if (!silent) setLoading(true);
        setError(null);
        try {
            const data = await listLinks();
            setLinks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load links");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadLinks();
    }, [refreshKey]);

    useEffect(() => {
        const refresh = () => {
            if (document.visibilityState === "visible") loadLinks(true);
        };
        const interval = window.setInterval(refresh, 6000);
        window.addEventListener("focus", refresh);
        document.addEventListener("visibilitychange", refresh);
        return () => {
            window.clearInterval(interval);
            window.removeEventListener("focus", refresh);
            document.removeEventListener("visibilitychange", refresh);
        };
    }, []);

    const totalClicks = links.reduce((sum, link) => sum + (link.clickCount ?? 0), 0);
    const activeLinks = links.filter((link) => link.status !== "archived" && link.status !== "inactive").length;
    const qrLinked = links.filter((link) => link.settings?.qrCode || link.settings?.qr || link.settings?.qrEnabled).length;

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase();
        return links.filter((link) => {
            const matchesSearch =
                !needle ||
                link.title.toLowerCase().includes(needle) ||
                link.shortUrl.toLowerCase().includes(needle) ||
                link.destinationUrl.toLowerCase().includes(needle) ||
                link.slug.toLowerCase().includes(needle);
            const matchesStatus =
                statusFilter === "All Links" ||
                (statusFilter === "Active" && link.status !== "archived" && link.status !== "inactive") ||
                (statusFilter === "Archived" && (link.status === "archived" || link.status === "inactive"));
            return matchesSearch && matchesStatus;
        });
    }, [links, search, statusFilter]);

    const visibleLinks = filtered.slice(0, visibleCount);
    const allVisibleSelected = visibleLinks.length > 0 && visibleLinks.every((link) => selectedIds.includes(link.id));

    function toggleSelected(id: string) {
        setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
    }

    function toggleAllVisible() {
        const ids = visibleLinks.map((link) => link.id);
        setSelectedIds((current) =>
            allVisibleSelected ? current.filter((id) => !ids.includes(id)) : Array.from(new Set([...current, ...ids]))
        );
    }

    async function handleCopy(link: ZiplinLink) {
        await navigator.clipboard.writeText(link.shortUrl).catch(() => null);
        setCopied(link.id);
        window.setTimeout(() => setCopied(null), 1400);
    }

    async function handleDelete(link: ZiplinLink) {
        if (!canManage || !confirm(`Delete "${link.title}"?`)) return;
        try {
            await deleteLink(link.id);
            setLinks((current) => current.filter((item) => item.id !== link.id));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Delete failed");
        }
    }

    const stats = [
        { label: "Total Clicks", value: totalClicks.toLocaleString(), badge: "+12%", icon: BarChart2 },
        { label: "Active Links", value: activeLinks.toLocaleString(), badge: "Active", icon: Link2 },
        { label: "Total QR Scans", value: "0", badge: "+08%", icon: QrCode },
        { label: "Active QR Codes", value: qrLinked.toLocaleString(), badge: "Active", icon: QrCode },
    ];

    return (
        <div style={{ minHeight: "100%", background: "#DDE8F6", color: text }}>
            <div style={{ padding: "28px clamp(18px, 2.4vw, 36px) 44px", width: "100%", boxSizing: "border-box" }}>
                <section style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18, marginBottom: 28 }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: 19, lineHeight: 1.1, color: "#050D1F", fontWeight: 900 }}>Links Management</h1>
                        <p style={{ margin: "7px 0 0", color: muted, fontSize: 11, fontWeight: 500 }}>Manage and optimize your shortened URLs and redirects</p>
                    </div>
                    <button onClick={() => onCreateLink()} style={primaryButton}>
                        <Plus size={18} strokeWidth={2.4} />
                        Create new link
                    </button>
                </section>

                <section style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(160px, 1fr))", gap: "clamp(18px, 2vw, 28px)", marginBottom: 28 }}>
                    {stats.map(({ label, value, badge, icon: Icon }) => (
                        <div key={label} style={statCard}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <Icon size={20} color="#050D1F" strokeWidth={2.6} />
                                <span style={{ ...badgeStyle, background: badge === "Active" ? "#F1F3F6" : "#EAFBF1", color: badge === "Active" ? "#344054" : "#00B341" }}>{badge}</span>
                            </div>
                            <div>
                                <div style={{ color: "#42526B", fontSize: 11, fontWeight: 650, marginBottom: 5 }}>{label}</div>
                                <div style={{ color: navy, fontSize: 20, fontWeight: 900, letterSpacing: 0 }}>{value}</div>
                            </div>
                        </div>
                    ))}
                </section>

                <section style={filterCard}>
                    <Filter size={18} color="#050D1F" />
                    <div style={{ minWidth: 145 }}>
                        <div style={{ color: navy, fontSize: 16, fontWeight: 850 }}>Filter Links</div>
                        <div style={{ color: muted, fontSize: 10, marginTop: 3 }}>Use filters to find specific links</div>
                    </div>
                    <div style={filterInput}>
                        <CalendarDays size={12} color="#65758B" />
                        <span>06/17/2026 - 07/16/2026</span>
                    </div>
                    <label style={{ ...filterInput, flex: 1, minWidth: 220 }}>
                        <Search size={15} color="#65758B" />
                        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search for links" style={searchInput} />
                    </label>
                    <button style={filterButton}>Filter⌄</button>
                </section>

                {error && <div style={errorBox}>{error}</div>}

                {selectedIds.length > 0 && (
                    <div style={selectionBar}>
                        {selectedIds.length} selected
                        <button style={smallGhostButton} onClick={() => setSelectedIds([])}>Clear</button>
                    </div>
                )}

                <section style={tableCard}>
                    <div style={tableTop}>
                        <div style={tabsWrap}>
                            {(["All Links", "Active", "Archived"] as const).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setVisibleCount(10);
                                    }}
                                    style={statusFilter === status ? activeTab : tab}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <div style={{ color: "#4F5E73", fontSize: 11, fontWeight: 600 }}>
                            Showing {filtered.length === 0 ? 0 : 1}-{Math.min(visibleCount, filtered.length)} of {filtered.length.toLocaleString()}
                            <button style={pagerButton}>‹</button>
                            <button style={pagerButton}>›</button>
                        </div>
                    </div>

                    <div style={tableHead}>
                        <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} style={checkboxStyle} />
                        <div>LINK</div>
                        <div>CLICKS</div>
                        <div>LINK NOTE</div>
                        <div>CHANNELS</div>
                        <div>DATE</div>
                        <div style={{ textAlign: "center" }}>ACTIONS</div>
                    </div>

                    {loading ? (
                        <div style={emptyState}><Loader2 size={28} style={{ animation: "spin 1s linear infinite" }} /> Loading your links...</div>
                    ) : visibleLinks.length === 0 ? (
                        <div style={emptyState}>{search ? "No links match your search" : "No links found"}</div>
                    ) : (
                        visibleLinks.map((link) => (
                            <LinkTableRow
                                key={link.id}
                                link={link}
                                selected={selectedIds.includes(link.id)}
                                copied={copied === link.id}
                                canManage={canManage}
                                onSelect={() => toggleSelected(link.id)}
                                onCopy={() => handleCopy(link)}
                                onAnalytics={() => onOpenAnalytics?.(link)}
                                onQr={() => onOpenQr?.(link)}
                                onEdit={() => onEditLink?.(link)}
                                onDelete={() => handleDelete(link)}
                            />
                        ))
                    )}

                    {visibleCount < filtered.length && (
                        <button style={loadMoreButton} onClick={() => setVisibleCount((count) => count + 25)}>
                            Load more links
                        </button>
                    )}
                </section>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function LinkTableRow({
    link,
    selected,
    copied,
    canManage,
    onSelect,
    onCopy,
    onAnalytics,
    onQr,
    onEdit,
    onDelete,
}: {
    link: ZiplinLink;
    selected: boolean;
    copied: boolean;
    canManage: boolean;
    onSelect: () => void;
    onCopy: () => void;
    onAnalytics: () => void;
    onQr: () => void;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const [faviconFailed, setFaviconFailed] = useState(false);
    const favicon = faviconUrl(link.destinationUrl);
    const note = link.settings?.notes || "-";
    const channel = link.settings?.folder || "-";

    return (
        <div style={{ ...tableRow, background: selected ? "#F8FBFF" : "#FFFFFF" }}>
            <input type="checkbox" checked={selected} onChange={onSelect} style={checkboxStyle} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={thumb}>
                    {favicon && !faviconFailed ? (
                        <img src={favicon} alt="" width={24} height={24} onError={() => setFaviconFailed(true)} style={{ borderRadius: 4 }} />
                    ) : (
                        <Link2 size={13} color={navy} />
                    )}
                </div>
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 850, color: navy, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3, minWidth: 0 }}>
                        <a href={link.shortUrl} target="_blank" rel="noreferrer" style={{ color: "#667085", fontSize: 10, textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {link.shortUrl}
                        </a>
                        <button onClick={onCopy} title={copied ? "Copied" : "Copy"} style={inlineIconButton}>{copied ? <Check size={10} /> : <Copy size={10} />}</button>
                        <a href={link.shortUrl} target="_blank" rel="noreferrer" style={inlineIconButton}><ExternalLink size={10} /></a>
                    </div>
                </div>
            </div>
            <div>
                <div style={{ color: navy, fontSize: 12, fontWeight: 900 }}>{(link.clickCount ?? 0).toLocaleString()} total</div>
                <div style={{ color: muted, fontSize: 10, marginTop: 3 }}>0 unique</div>
            </div>
            <div style={cellText}>{note}</div>
            <div style={cellText}>{channel}</div>
            <div style={cellText}>{formatDate(link.createdAt)}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <button style={actionButton} title="Analytics" onClick={onAnalytics}><BarChart2 size={12} /></button>
                <button style={actionButton} title="QR code" onClick={onQr}><QrCode size={12} /></button>
                {canManage && <button style={actionButton} title="Edit" onClick={onEdit}><Edit3 size={12} /></button>}
                {canManage && <button style={actionButton} title="Delete" onClick={onDelete}><Trash2 size={12} /></button>}
                <button style={actionButton} title="More"><MoreVertical size={13} /></button>
            </div>
        </div>
    );
}

const primaryButton: CSSProperties = {
    border: "none",
    borderRadius: 4,
    background: navy,
    color: "#FFFFFF",
    height: 36,
    padding: "0 22px",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    fontSize: 12,
    fontWeight: 750,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(6,43,103,0.16)",
};

const statCard: CSSProperties = {
    background: "#FFFFFF",
    border: `1px solid ${border}`,
    borderRadius: 7,
    minHeight: 106,
    padding: "22px 18px 16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 10px 26px rgba(8,30,73,0.05)",
};

const badgeStyle: CSSProperties = {
    borderRadius: 4,
    padding: "4px 7px",
    fontSize: 9,
    fontWeight: 800,
};

const filterCard: CSSProperties = {
    background: "#FFFFFF",
    border: `1px solid ${border}`,
    borderRadius: 7,
    padding: "13px 18px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
    boxShadow: "0 8px 20px rgba(8,30,73,0.04)",
};

const filterInput: CSSProperties = {
    height: 32,
    border: `1px solid ${border}`,
    borderRadius: 5,
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "0 11px",
    color: "#344054",
    fontSize: 10,
    fontWeight: 600,
};

const searchInput: CSSProperties = {
    width: "100%",
    border: "none",
    outline: "none",
    color: "#344054",
    fontSize: 10,
    fontWeight: 600,
};

const filterButton: CSSProperties = {
    border: "none",
    background: "transparent",
    color: "#050D1F",
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
};

const tableCard: CSSProperties = {
    background: "#FFFFFF",
    border: `1px solid ${border}`,
    borderRadius: 7,
    overflow: "hidden",
    boxShadow: "0 10px 26px rgba(8,30,73,0.05)",
};

const tableTop: CSSProperties = {
    minHeight: 50,
    padding: "10px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${border}`,
};

const tabsWrap: CSSProperties = {
    display: "inline-flex",
    background: "#F3F6FA",
    borderRadius: 5,
    padding: 3,
};

const tab: CSSProperties = {
    border: "none",
    borderRadius: 4,
    background: "transparent",
    color: "#4D5D74",
    padding: "7px 20px",
    fontSize: 10,
    fontWeight: 750,
    cursor: "pointer",
};

const activeTab: CSSProperties = {
    ...tab,
    background: "#FFFFFF",
    color: navy,
    boxShadow: "0 2px 8px rgba(8,30,73,0.07)",
};

const tableHead: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "32px minmax(190px, 1.7fr) 82px 92px 92px 96px 120px",
    alignItems: "center",
    gap: 12,
    minWidth: 720,
    padding: "13px 14px",
    borderBottom: `1px dashed ${border}`,
    color: "#40516A",
    fontSize: 10,
    fontWeight: 850,
};

const tableRow: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "32px minmax(190px, 1.7fr) 82px 92px 92px 96px 120px",
    alignItems: "center",
    gap: 12,
    minWidth: 720,
    padding: "16px 14px",
    borderBottom: `1px solid ${border}`,
};

const checkboxStyle: CSSProperties = {
    width: 12,
    height: 12,
    accentColor: navy,
    cursor: "pointer",
};

const thumb: CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: 5,
    background: "#EFF5FF",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
};

const cellText: CSSProperties = {
    color: "#667085",
    fontSize: 10,
    fontWeight: 600,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
};

const actionButton: CSSProperties = {
    border: "none",
    background: "transparent",
    color: navy,
    cursor: "pointer",
    padding: 2,
    display: "inline-flex",
};

const inlineIconButton: CSSProperties = {
    border: "none",
    background: "transparent",
    color: "#65758B",
    cursor: "pointer",
    padding: 0,
    display: "inline-flex",
    alignItems: "center",
};

const loadMoreButton: CSSProperties = {
    width: "100%",
    border: "none",
    background: "#FFFFFF",
    color: navy,
    padding: "12px",
    fontSize: 11,
    fontWeight: 850,
    cursor: "pointer",
};

const pagerButton: CSSProperties = {
    border: "none",
    background: "transparent",
    color: navy,
    fontSize: 18,
    fontWeight: 900,
    marginLeft: 9,
    cursor: "pointer",
};

const emptyState: CSSProperties = {
    minHeight: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    color: muted,
    fontSize: 11,
    fontWeight: 700,
};

const errorBox: CSSProperties = {
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    color: "#B91C1C",
    borderRadius: 8,
    padding: "13px 16px",
    marginBottom: 18,
    fontWeight: 700,
};

const selectionBar: CSSProperties = {
    background: "#FFF7DF",
    border: "1px solid #FFE2A3",
    color: navy,
    borderRadius: 8,
    padding: "12px 16px",
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 14,
    fontWeight: 800,
};

const smallGhostButton: CSSProperties = {
    border: "none",
    background: "transparent",
    color: navy,
    fontWeight: 850,
    cursor: "pointer",
};
