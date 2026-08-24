import React from 'react';
import { MousePointerClick, ArrowUpRight } from 'lucide-react';
import { Card } from './Card';
import { fontInfo, getFont } from '../../../utils/helpers/getFont';


interface Click {
    id: string;
    slug: string;
    city?: string;
    country?: string;
}

interface RecentActivityProps {
    clicks: Click[];
    onViewAll?: () => void;

}

const RecentActivity: React.FC<RecentActivityProps> = ({
    clicks,
    onViewAll,

}) => {
    return (
        <Card className='p-6'>
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <h2 style={getFont(fontInfo.F.size.lg, fontInfo.F.weight.bold, { color: fontInfo.C.textPrimary, margin: 0 })}>
                        Recent Activity
                    </h2>
                    <p style={getFont(fontInfo.F.size.sm, fontInfo.F.weight.normal, { color: fontInfo.C.textMuted, marginTop: 3, marginBottom: 0 })}>
                        Latest clicks across all links
                    </p>
                </div>
                {clicks.length > 0 && onViewAll && (
                    <div
                        onClick={onViewAll}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            cursor: "pointer",
                            ...getFont(fontInfo.F.size.sm, fontInfo.F.weight.semibold, { color: fontInfo.C.primary })
                        }}
                    >
                        View all <ArrowUpRight size={12} />
                    </div>
                )}
            </div>

            {clicks.length === 0 ? (
                <div style={{ textAlign: "center", padding: "36px 0", borderTop: `1px solid ${fontInfo.C.cardBorder}` }}>
                    <MousePointerClick size={28} color={fontInfo.C.textMuted} style={{ marginBottom: 10, display: "block", margin: "0 auto 10px" }} />
                    <div style={getFont(fontInfo.F.size.md, fontInfo.F.weight.medium, { color: fontInfo.C.textSecondary })}>
                        No clicks yet
                    </div>
                    <div style={getFont(fontInfo.F.size.sm, fontInfo.F.weight.normal, { color: fontInfo.C.textMuted, marginTop: 4 })}>
                        Create and share a link to start seeing activity here.
                    </div>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                    {clicks.slice(0, 9).map((click) => (
                        <div key={click.id} style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            background: fontInfo.C.cardSurface,
                            border: `1px solid ${fontInfo.C.cardBorder}`,
                            borderRadius: fontInfo.R.md,
                            padding: "10px 14px",
                        }}>
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: fontInfo.R.sm,
                                flexShrink: 0,
                                background: fontInfo.C.primaryBg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                                <MousePointerClick size={13} color={fontInfo.C.primary} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <div style={getFont(fontInfo.F.size.base, fontInfo.F.weight.semibold, {
                                    color: fontInfo.C.textPrimary,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                })}>
                                    /{click.slug}
                                </div>
                                <div style={getFont(fontInfo.F.size.xs, fontInfo.F.weight.normal, { color: fontInfo.C.textMuted, marginTop: 1 })}>
                                    {click.city ? `${click.city}, ` : ""}{click.country || "Unknown location"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default RecentActivity;