import { fontInfo, getFont } from "../../../utils/helpers/getFont";
import { Card } from "./Card";

export function StatCard({ label, value, live, Icon, accent, bg }: {
    label: string; value: any; live?: boolean;
    Icon: React.ElementType; accent: string; bg: string;
}) {

    return (
        <Card className="px-5 py-6 relative overflow-hidden">
            <div className="flex h-10 items-center justify-between">
                <div className={`w-10 h-10 rounded-${fontInfo.R.md} bg-${bg} flex items-center justify-center`}>
                    <Icon size={18} color={accent} />
                </div>
                {live && (
                    <span style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        background: fontInfo.C.successBg, border: `1px solid ${fontInfo.C.successBorder}`,
                        borderRadius: fontInfo.R.full, padding: "3px 9px",
                        ...getFont(fontInfo.F.size.xs, fontInfo.F.weight.semibold, { color: fontInfo.C.successText }),
                    }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                        Live
                    </span>
                )}
            </div>

            <div className="mt-3">
                <div style={getFont(30, fontInfo.F.weight.black, { color: fontInfo.C.textPrimary, letterSpacing: "-1px", lineHeight: 1 })}>
                    {value}
                </div>
                <div style={getFont(fontInfo.F.size.base, fontInfo.F.weight.medium, { color: fontInfo.C.textMuted, marginTop: 5 })}>
                    {label}
                </div>
            </div>
        </Card>
    );
}
