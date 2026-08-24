import { Folder, FolderPlus, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TOKEN_COLOR } from "../../../utils/constants/colors.constants";
const defaultFolders = ["Default", "Website Links", "Zoom Links", "Blog Links", "YouTube Links"];

export function LinksSecondarySidebar({ onCreateLink }: { onCreateLink: () => void }) {
    const [activeFolder, setActiveFolder] = useState<string>("All links");
    const [folders, setFolders] = useState<string[]>(() => {
        try { return Array.from(new Set([...defaultFolders, ...JSON.parse(localStorage.getItem("ziplin-folders") || "[]")])).filter(Boolean); }
        catch { return defaultFolders; }
    });
    useEffect(() => {
        const refresh = () => {
            try { setFolders(Array.from(new Set([...defaultFolders, ...JSON.parse(localStorage.getItem("ziplin-folders") || "[]")])).filter(Boolean)); }
            catch { setFolders(defaultFolders); }
        };
        window.addEventListener("storage", refresh);
        const iv = window.setInterval(refresh, 1500);
        return () => { window.removeEventListener("storage", refresh); clearInterval(iv); };
    }, []);

    return (
        <div style={{ fontFamily: "Inter, sans-serif", padding: "8px 0" }}>
            {[{ label: "All links", isFolder: false }, ...folders.map((f) => ({ label: f, isFolder: true }))].map(({ label, isFolder }) => {
                const isActive = activeFolder === label;
                return (
                    <button
                        key={label}
                        onClick={() => setActiveFolder(label)}
                        style={{
                            display: "flex", alignItems: "center", gap: 8, width: "100%",
                            padding: isFolder ? "7px 12px 7px 28px" : "9px 12px",
                            background: isActive ? TOKEN_COLOR.PRIMARY_BG : "transparent",
                            border: "none", borderRadius: 8, cursor: "pointer",
                            color: isActive ? TOKEN_COLOR.PRIMARY : TOKEN_COLOR.TEXT,
                            fontSize: isFolder ? 14 : 15, fontWeight: isActive ? 700 : isFolder ? 500 : 700,
                            fontFamily: "Inter, sans-serif", textAlign: "left" as const,
                        }}
                    >
                        {!isFolder ? <Link2 size={16} color={isActive ? TOKEN_COLOR.PRIMARY : TOKEN_COLOR.MUTED} /> : <Folder size={14} color={isActive ? TOKEN_COLOR.PRIMARY : TOKEN_COLOR.FAINT} />}
                        {label}
                    </button>
                );
            })}
            <button
                onClick={onCreateLink}
                style={{
                    marginTop: 16, display: "flex", alignItems: "center", gap: 7,
                    width: "100%", padding: "9px 12px", borderRadius: 8,
                    border: `1.5px solid ${TOKEN_COLOR.PRIMARY_BG}`, background: TOKEN_COLOR.PRIMARY_BG,
                    color: TOKEN_COLOR.TEXT, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Inter, sans-serif",
                }}
            >
                <FolderPlus size={14} /> New folder
            </button>
        </div>
    );
}