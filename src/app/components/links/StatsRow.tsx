import { BarChart3, Link2, QrCode, Radar } from "lucide-react";
import { TOKEN_COLOR } from "../../../utils/constants/colors.constants";

interface StatsRowProps {
    links: any;
    totalClicks: number;
}

export const StatsRow: React.FC<StatsRowProps> = ({ links, totalClicks }) => {
    const activeLinks = links.filter((l: any) => l.status !== "archived" && l.status !== "inactive").length;
    const qrLinked = links.filter((l: any) => l.settings?.qrCode || l.settings?.qr || l.settings?.qrEnabled).length;
    const stats = [
        { label: "Total Clicks", value: totalClicks.toLocaleString(), delta: "+12%", icon: BarChart3, color: "#111827" },
        { label: "Active Links", value: activeLinks.toLocaleString(), status: "Active", icon: Link2, color: "#111827" },
        { label: "Total QR Scans", value: "0", delta: "+0%", icon: Radar, color: "#111827" },
        { label: "Active QR Codes", value: qrLinked.toLocaleString(), status: "Active", icon: QrCode, color: "#111827" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {stats.map(({ label, value, delta, status, icon: Icon, color }) => (
                <div
                    key={label}
                    style={{
                        background: "#fff",
                        border: `1px solid ${TOKEN_COLOR.BORDER}`,
                        borderRadius: 8,
                        padding: "18px 20px",
                        minHeight: 104,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "0 1px 2px rgba(15,23,42,0.03)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon size={15} color={color} />
                        </div>
                        {(delta || status) && (
                            <span
                                style={{
                                    borderRadius: 999,
                                    background: delta?.startsWith("-") ? "#FEF2F2" : "#ECFDF3",
                                    color: delta?.startsWith("-") ? TOKEN_COLOR.DANGER : "#12B76A",
                                    fontSize: 10,
                                    fontWeight: 800,
                                    padding: "3px 8px",
                                }}
                            >
                                {delta || status}
                            </span>
                        )}
                    </div>
                    <div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: TOKEN_COLOR.TEXT, lineHeight: 1 }}>{value}</div>
                        <div style={{ fontSize: 12, color: TOKEN_COLOR.MUTED, fontWeight: 700, marginTop: 8 }}>{label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
