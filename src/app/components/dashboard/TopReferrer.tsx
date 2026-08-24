import React from 'react';
import { Card } from './Card';
import { fontInfo, getFont } from '../../../utils/helpers/getFont';


interface Referrer {
    name: string;
    pct: number;
}

interface TopReferrersProps {
    referrers: Referrer[];

    accentBgs?: string[];  // Optional with default values
    accentColors?: string[]; // Optional with default values
    barGradients?: string[]; // Optional with default values
}

const TopReferrers: React.FC<TopReferrersProps> = ({
    referrers,

    accentBgs = [fontInfo.C.accent1, fontInfo.C.accent2, fontInfo.C.accent3, fontInfo.C.accent4, fontInfo.C.primary],
    accentColors = [fontInfo.C.accent1Bg, fontInfo.C.accent2Bg, fontInfo.C.accent3Bg, fontInfo.C.accent4Bg, fontInfo.C.primaryBg],
    barGradients = [
        `linear-gradient(90deg, ${fontInfo.C.accent1}, ${fontInfo.C.primaryLight})`,
        `linear-gradient(90deg, ${fontInfo.C.accent2}, #38bdf8)`,
        `linear-gradient(90deg, ${fontInfo.C.accent3}, #34d399)`,
        `linear-gradient(90deg, ${fontInfo.C.accent4}, #fcd34d)`,
        `linear-gradient(90deg, ${fontInfo.C.primary}, ${fontInfo.C.primaryLight})`,
    ]
}) => {
    return (
        <Card className='p-6'>
            <h2 style={{
                fontSize: fontInfo.F.size.lg,
                fontWeight: fontInfo.F.weight.bold,
                color: fontInfo.C.textPrimary,
                margin: "0 0 2px"
            }}>
                Top Referrers
            </h2>
            <p style={getFont(fontInfo.F.size.sm, fontInfo.F.weight.normal, { color: fontInfo.C.textMuted, marginTop: 0, marginBottom: 22 })}>
                Traffic sources
            </p>

            {referrers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", borderTop: `1px solid ${fontInfo.C.cardBorder}` }}>
                    <div style={getFont(fontInfo.F.size.base, fontInfo.F.weight.normal, { color: fontInfo.C.textMuted })}>
                        No click data yet.
                    </div>
                    <div style={getFont(fontInfo.F.size.sm, fontInfo.F.weight.normal, { color: fontInfo.C.textMuted, marginTop: 4 })}>
                        Share a link to start tracking.
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {referrers.map((ref, i) => (
                        <div key={ref.name}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: fontInfo.R.sm,
                                        background: accentBgs[i % accentBgs.length],
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        ...getFont(fontInfo.F.size.xs, fontInfo.F.weight.bold, { color: accentColors[i % accentColors.length] }),
                                    }}>
                                        {i + 1}
                                    </div>
                                    <span style={getFont(fontInfo.F.size.base, fontInfo.F.weight.medium, { color: fontInfo.C.textSecondary })}>
                                        {ref.name}
                                    </span>
                                </div>
                                <span style={getFont(fontInfo.F.size.sm, fontInfo.F.weight.bold, { color: fontInfo.C.textPrimary })}>
                                    {ref.pct}%
                                </span>
                            </div>
                            <div style={{ background: "#f1f5f9", borderRadius: fontInfo.R.full, height: 6, overflow: "hidden" }}>
                                <div style={{
                                    height: "100%",
                                    borderRadius: fontInfo.R.full,
                                    width: `${ref.pct}%`,
                                    background: barGradients[i % barGradients.length],
                                    transition: "width 0.6s ease",
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default TopReferrers;