import { fontInfo, getFont } from "../../../utils/helpers/getFont";

export function ChartTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className={`rounded-lg border border-${fontInfo.C.cardBorder} bg-${fontInfo.C.card} p-3 shadow-${fontInfo.S.dropdown}`}>
            <div style={getFont(fontInfo.F.size.xs, fontInfo.F.weight.semibold, { color: fontInfo.C.textMuted, marginBottom: 4 })}>{label}</div>
            <div style={getFont(fontInfo.F.size.lg, fontInfo.F.weight.bold, { color: fontInfo.C.primary })}>{payload[0].value} clicks</div>
        </div>
    );
}
