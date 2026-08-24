import { TOKEN_COLOR } from "../../../utils/constants/colors.constants";
import type { ImportRow } from "../../../utils/helpers/parseImportRows";
import type { RedirectDomainOption } from "../../services/config";

interface ImportPreviewProps {
    importPreview: ImportRow[];
    domains?: RedirectDomainOption[];
    importing: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    onUpdateRow?: (index: number, field: keyof ImportRow, value: any) => void;
}

export const ImportPreview: React.FC<ImportPreviewProps> = ({
    importPreview,
    domains = [],
    importing,
    onCancel,
    onConfirm,
    onUpdateRow,
}) => {
    const readyCount = importPreview.filter((r) => r.valid).length;
    const skippedCount = importPreview.filter((r) => !r.valid).length;

    return (
        <div style={{ background: "#fff", border: `1px solid ${TOKEN_COLOR.BORDER}`, borderRadius: 12, padding: 18, marginBottom: 14, animation: "fadeIn 0.2s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <strong style={{ fontSize: 14, color: TOKEN_COLOR.TEXT }}>Bulk import preview</strong>
                <span style={{ fontSize: 12, color: TOKEN_COLOR.MUTED }}>{readyCount} ready · {skippedCount} skipped</span>
                <div style={{ flex: 1 }} />
                <button onClick={onCancel} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${TOKEN_COLOR.BORDER}`, background: "#fff", color: TOKEN_COLOR.MUTED, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                <button onClick={onConfirm} disabled={importing || readyCount === 0} style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: TOKEN_COLOR.PRIMARY, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    {importing ? "Importing…" : "Confirm import"}
                </button>
            </div>
            <div style={{ maxHeight: 300, overflow: "auto", border: `1px solid ${TOKEN_COLOR.BORDER}`, borderRadius: 9 }}>
                {importPreview.slice(0, 50).map((row, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "9px 14px", borderBottom: i < importPreview.length - 1 ? `1px solid #F8FAFC` : "none", color: row.valid ? TOKEN_COLOR.TEXT : TOKEN_COLOR.DANGER, fontSize: 13 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr .7fr", gap: 10 }}>
                            <input 
                                value={row.title} 
                                onChange={(e) => onUpdateRow?.(i, 'title', e.target.value)}
                                placeholder="Title"
                                style={{ fontWeight: 600, border: "1px solid transparent", background: "transparent", padding: "4px 8px", borderRadius: 6, outline: "none", color: "inherit", width: "100%" }}
                                onFocus={(e) => e.target.style.border = `1px solid ${TOKEN_COLOR.BORDER}`}
                                onBlur={(e) => e.target.style.border = "1px solid transparent"}
                            />
                            <input 
                                value={row.destinationUrl} 
                                onChange={(e) => onUpdateRow?.(i, 'destinationUrl', e.target.value)}
                                placeholder="Destination URL"
                                style={{ border: "1px solid transparent", background: "transparent", padding: "4px 8px", borderRadius: 6, outline: "none", color: "inherit", width: "100%" }}
                                onFocus={(e) => e.target.style.border = `1px solid ${TOKEN_COLOR.BORDER}`}
                                onBlur={(e) => e.target.style.border = "1px solid transparent"}
                            />
                            <div style={{ padding: "4px 8px", display: "flex", alignItems: "center" }}>
                                {row.valid ? "Ready" : row.reason}
                            </div>
                        </div>
                        {row.valid && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 11, padding: "0 8px" }}>
                                <div style={{ display: "flex", alignItems: "center", background: "#F1F5F9", borderRadius: 4, color: TOKEN_COLOR.MUTED }}>
                                    <span style={{ padding: "2px 0 2px 6px" }}>Slug: /</span>
                                    <input 
                                        value={row.slug || ""}
                                        onChange={(e) => onUpdateRow?.(i, 'slug', e.target.value)}
                                        style={{ background: "transparent", border: "none", outline: "none", color: "inherit", width: 80, padding: "2px 6px 2px 0", fontSize: 11 }}
                                        placeholder="auto generate"
                                    />
                                </div>
                                
                                <div style={{ display: "flex", alignItems: "center", background: "#F1F5F9", borderRadius: 4, color: TOKEN_COLOR.MUTED }}>
                                    <span style={{ padding: "2px 0 2px 6px" }}>Domain: </span>
                                    <select 
                                        value={row.shortDomain || ""}
                                        onChange={(e) => onUpdateRow?.(i, 'shortDomain', e.target.value)}
                                        style={{ background: "transparent", border: "none", outline: "none", color: "inherit", maxWidth: 100, padding: "2px 6px 2px 0", fontSize: 11, cursor: "pointer", appearance: "auto" }}
                                    >
                                        <option value="">default</option>
                                        {domains.map((d) => (
                                            <option key={d.domain} value={d.domain}>
                                                {d.domain}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {row.utm && <span style={{ background: "#F0FDF4", padding: "2px 6px", borderRadius: 4, color: "#166534", display: "flex", alignItems: "center" }}>+ UTM Params</span>}
                                {row.tags && <span style={{ background: "#EEF2FF", padding: "2px 6px", borderRadius: 4, color: TOKEN_COLOR.PRIMARY, display: "flex", alignItems: "center" }}>{row.tags.length} Tags</span>}
                                
                                <div style={{ display: "flex", alignItems: "center", background: "#FEF2F2", borderRadius: 4, color: "#991B1B" }}>
                                    <span style={{ padding: "2px 0 2px 6px" }}>Folder: </span>
                                    <input 
                                        value={row.folder || ""}
                                        onChange={(e) => onUpdateRow?.(i, 'folder', e.target.value)}
                                        style={{ background: "transparent", border: "none", outline: "none", color: "inherit", width: 80, padding: "2px 6px 2px 0", fontSize: 11 }}
                                        placeholder="Default"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {importPreview.length > 50 && (
                    <div style={{ padding: "12px", textAlign: "center", fontSize: 12, color: TOKEN_COLOR.MUTED, background: "#F8FAFC" }}>
                        And {importPreview.length - 50} more rows...
                    </div>
                )}
            </div>
        </div>
    );
};