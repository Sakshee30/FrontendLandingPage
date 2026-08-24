import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { CalendarDays, Copy, Edit3, ExternalLink, Share2, Trash2 } from 'lucide-react';
import { getAnalyticsSummary, AnalyticsSummary } from '../../services/analytics';
import { resetLinkAnalytics } from '../../services/analytics';
import { FrontendConfig, getFrontendConfig } from '../../services/config';
import { ZiplinClick } from '../../services/links';
import { enablePublicReport } from '../../services/reports';



function exportClicks(clicks: ZiplinClick[]) {
    const header = [
        'Time',
        'Slug',
        'Country',
        'City',
        'Device',
        'Browser',
        'Referrer',
        'IP',
        'Latitude',
        'Longitude',
    ];
    const rows = clicks.map((click) => [
        click.clickedAt,
        click.slug,
        click.country || '',
        click.city || '',
        click.device || '',
        click.browser || '',
        click.referrer || 'Direct',
        click.ip || '',
        click.latitude || '',
        click.longitude || '',
    ]);
    const csv = [header, ...rows]
        .map((row) =>
            row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        )
        .join('\n');
    const url = URL.createObjectURL(
        new Blob([csv], { type: 'text/csv;charset=utf-8' })
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'ziplin-clicks.csv';
    anchor.click();
    URL.revokeObjectURL(url);
}

function exportPdfLikeReport(summary: AnalyticsSummary | null) {
    if (!summary) return;
    const html = `<!doctype html><html><head><title>Ziplin analytics report</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#101828}h1{font-size:28px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.card{border:1px solid #d9e2ec;border-radius:14px;padding:16px}.value{font-size:28px;font-weight:900}pre{background:#f5f7fb;padding:14px;border-radius:10px;white-space:pre-wrap}</style></head><body><h1>Ziplin Analytics Report</h1><p>Generated ${new Date().toLocaleString()}</p><div class="grid"><div class="card"><b>Clicks</b><div class="value">${summary.stats.totalClicks
        }</div></div><div class="card"><b>Unique</b><div class="value">${summary.stats.uniqueVisitors
        }</div></div><div class="card"><b>Top country</b><div class="value">${summary.stats.topCountry
        }</div></div><div class="card"><b>Top device</b><div class="value">${summary.stats.topDevice
        }</div></div></div><h2>Breakdowns</h2><pre>${JSON.stringify(
            summary.breakdowns,
            null,
            2
        )}</pre><h2>Series</h2><pre>${JSON.stringify(
            summary.series,
            null,
            2
        )}</pre><script>window.print()</script></body></html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
}

function clusterLocations(locations: AnalyticsSummary['locations']) {
    const clusters = new Map<
        string,
        {
            id: string;
            latitude: number;
            longitude: number;
            count: number;
            label: string;
        }
    >();
    locations.forEach((location) => {
        const latitude = Number(location.latitude);
        const longitude = Number(location.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
        const key = `${latitude.toFixed(1)},${longitude.toFixed(1)}`;
        const existing = clusters.get(key);
        if (existing) {
            existing.count += 1;
            return;
        }
        clusters.set(key, {
            id: key,
            latitude,
            longitude,
            count: 1,
            label: `${location.city || 'Unknown'}, ${location.country || 'Unknown'}`,
        });
    });
    return Array.from(clusters.values());
}

export function Analytics() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [filters, setFilters] = useState(() => ({
        from: '',
        to: '',
        linkId: localStorage.getItem('ziplin-analytics-link-id') || '',
        country: '',
        device: '',
    }));
    const [config, setConfig] = useState<FrontendConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sharing, setSharing] = useState(false);

    async function load(silent = false) {
        if (!silent) setLoading(true);
        setError(null);
        try {
            setSummary(await getAnalyticsSummary(filters));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not load analytics');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        localStorage.removeItem('ziplin-analytics-link-id');
        getFrontendConfig()
            .then(setConfig)
            .catch(() => null);
        load();
    }, []);

    useEffect(() => {
        const refreshSilently = () => {
            if (document.visibilityState === 'visible') load(true);
        };

        const interval = window.setInterval(refreshSilently, 5000);
        window.addEventListener('focus', refreshSilently);
        document.addEventListener('visibilitychange', refreshSilently);

        return () => {
            window.clearInterval(interval);
            window.removeEventListener('focus', refreshSilently);
            document.removeEventListener('visibilitychange', refreshSilently);
        };
    }, [filters]);

    const countries = useMemo(
        () =>
            Object.keys(summary?.breakdowns.countries || {}).filter(
                (key) => key !== 'Unknown'
            ),
        [summary]
    );
    const devices = useMemo(
        () =>
            Object.keys(summary?.breakdowns.devices || {}).filter(
                (key) => key !== 'Unknown'
            ),
        [summary]
    );
    const clicks = summary?.clicks || [];
    const locationClusters = useMemo(
        () => clusterLocations(summary?.locations || []),
        [summary]
    );
    const stats = summary?.stats || {
        totalClicks: 0,
        uniqueVisitors: 0,
        totalLinks: 0,
        geolocatedClicks: 0,
        privateClicks: 0,
        topCountry: '-',
        topDevice: '-',
    };
    const selectedLink = useMemo(() => {
        if (!summary?.links?.length) return null;
        return summary.links.find((link) => link.id === filters.linkId) || summary.links[0];
    }, [summary, filters.linkId]);
    const selectedShortUrl = selectedLink?.shortUrl || selectedLink?.destinationUrl || '';
    const referrers = useMemo(() => entries(summary?.breakdowns.referrers || {}).slice(0, 5), [summary]);
    const deviceRows = useMemo(() => entries(summary?.breakdowns.devices || {}).slice(0, 3), [summary]);
    const countryRows = useMemo(() => entries(summary?.breakdowns.countries || {}).slice(0, 5), [summary]);

    async function handlePublicReport() {
        if (!filters.linkId) {
            alert('Select one link first, then create a public report.');
            return;
        }
        setSharing(true);
        try {
            const report = await enablePublicReport(filters.linkId, {
                enabled: true,
            });
            await navigator.clipboard.writeText(report.publicUrl).catch(() => null);
            window.open(report.publicUrl, '_blank');
        } catch (err) {
            alert(
                err instanceof Error ? err.message : 'Could not create public report'
            );
        } finally {
            setSharing(false);
        }
    }

    async function handleResetAnalytics() {
        if (!filters.linkId) {
            alert('Select one link first, then reset analytics.');
            return;
        }
        if (
            !confirm(
                'Reset click analytics for this selected link? This cannot be undone.'
            )
        )
            return;
        try {
            await resetLinkAnalytics(filters.linkId);
            await load();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Could not reset analytics');
        }
    }

    return (
        <div style={{ minHeight: '100%', background: '#F8FBFF', color: navy, fontFamily: 'Inter, sans-serif' }}>
            <div style={{ padding: '28px clamp(18px, 2.4vw, 36px) 36px', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, marginBottom: 24 }}>
                    <div>
                        <div style={{ color: '#667085', fontSize: 11, fontWeight: 500, marginBottom: 16 }}>Links &gt; <span style={{ color: navy, fontWeight: 600 }}>{selectedLink?.title || 'Analytics'}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                            <h1 style={{ margin: 0, fontSize: 22, lineHeight: 1, fontWeight: 650, color: navy }}>{selectedLink?.title || 'Analytics'}</h1>
                            {selectedShortUrl && (
                                <button style={linkCopyButton} onClick={() => navigator.clipboard.writeText(selectedShortUrl).catch(() => null)}>
                                    {selectedShortUrl.replace(/^https?:\/\//, '')} <Copy size={12} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button style={outlineButton} onClick={handlePublicReport} disabled={sharing}><Share2 size={13} /> Share</button>
                        {selectedLink && <button style={outlineButton} onClick={() => navigate(`/links/${selectedLink.id}/edit`)}><Edit3 size={13} /> Edit</button>}
                        <button style={dangerButton} onClick={handleResetAnalytics}><Trash2 size={13} /> Delete</button>
                    </div>
                </div>

                {error && <div style={errorBox}>{error}</div>}
                {loading && <div style={loadingBox}>Loading analytics from backend...</div>}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: 18, marginBottom: 24 }}>
                    <MetricCard label="Total Clicks" value={stats.totalClicks.toLocaleString()} badge="+14.2%" />
                    <MetricCard label="Unique Clicks" value={stats.uniqueVisitors.toLocaleString()} badge="+8.1%" />
                    <MetricCard label="Average CTR" value={stats.totalClicks ? `${Math.max(1, Math.round((stats.uniqueVisitors / Math.max(stats.totalClicks, 1)) * 1000) / 10)}%` : '0%'} badge="-1.2%" danger />
                    <MetricCard label="Top Country" value={stats.topCountry || '-'} badge="No change" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 18, marginBottom: 24 }}>
                    <Panel title="Top Referrers">
                        <div style={miniTableHead}><span>REFERRER</span><span>CLICKS</span><span>PERCENT</span></div>
                        {referrers.map(([label, count]) => (
                            <div key={label} style={miniTableRow}>
                                <div><strong style={{ fontWeight: 600 }}>{label || 'Direct'}</strong><small>{label === 'Direct' ? 'Direct Traffic' : label.toLowerCase()}</small></div>
                                <span>{count.toLocaleString()}</span>
                                <span>{percent(count, stats.totalClicks)}</span>
                            </div>
                        ))}
                        {!referrers.length && <div style={emptyText}>No referrer data yet.</div>}
                    </Panel>

                    <Panel title="Devices & Browsers">
                        {deviceRows.map(([label, count]) => (
                            <ProgressRow key={label} label={label} count={count} total={stats.totalClicks} />
                        ))}
                        {!deviceRows.length && <div style={emptyText}>No device data yet.</div>}
                    </Panel>
                </div>

                <Panel title="Geographic Distribution" style={{ marginBottom: 24 }}>
                    <div style={geoHead}><span>RANK</span><span>COUNTRY</span><span>CLICKS</span><span>PERCENTAGE</span></div>
                    {countryRows.map(([label, count], index) => (
                        <div key={label} style={geoRow}>
                            <span>{index + 1}</span>
                            <strong style={{ fontWeight: 600 }}>{label}</strong>
                            <span>{count.toLocaleString()}</span>
                            <span>{percent(count, stats.totalClicks)}</span>
                        </div>
                    ))}
                    {!countryRows.length && <div style={emptyText}>No country data yet.</div>}
                </Panel>

                <Panel
                    title="Click Performance"
                    subtitle="Clicks recorded over the last 30 days"
                    action={<button style={dateButton}><CalendarDays size={12} /> Last 30 Days</button>}
                >
                    <LineChart series={summary?.series || []} />
                </Panel>
            </div>
        </div>
    );
}

const navy = '#081C45';
const blue = '#0E2F73';
const border = '#D9E2EC';
const muted = '#667085';

function entries(record: Record<string, number>) {
    return Object.entries(record)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1]);
}

function percent(count: number, total: number) {
    if (!total) return '0%';
    return `${Math.round((count / total) * 1000) / 10}%`;
}

function MetricCard({ label, value, badge, danger = false }: { label: string; value: string; badge: string; danger?: boolean }) {
    return (
        <div style={metricCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ color: '#40516A', fontSize: 12, fontWeight: 600 }}>{label}</div>
                <span style={{ ...metricBadge, background: danger ? '#FEECEC' : '#EAFBF1', color: danger ? '#EF4444' : '#12B76A' }}>{badge}</span>
            </div>
            <div style={{ color: navy, fontSize: label === 'Top Country' ? 22 : 24, fontWeight: 700, marginTop: 22, lineHeight: 1.1 }}>{value}</div>
        </div>
    );
}

function Panel({ title, subtitle, action, children, style }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; style?: CSSProperties }) {
    return (
        <section style={{ ...panel, ...style }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                    <h2 style={{ margin: 0, color: navy, fontSize: 18, fontWeight: 700 }}>{title}</h2>
                    {subtitle && <p style={{ margin: '4px 0 0', color: muted, fontSize: 11 }}>{subtitle}</p>}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

function ProgressRow({ label, count, total }: { label: string; count: number; total: number }) {
    const pct = total ? Math.round((count / total) * 100) : 0;
    return (
        <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: navy, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                <span>{label}</span>
                <span>{pct}% <small style={{ color: muted, fontWeight: 500 }}>({count.toLocaleString()} clicks)</small></span>
            </div>
            <div style={{ height: 6, borderRadius: 999, background: '#E1E7F0', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: blue }} />
            </div>
        </div>
    );
}

function LineChart({ series }: { series: Array<{ date: string; clicks: number }> }) {
    const values = series.length ? series.slice(-30) : Array.from({ length: 30 }, (_, i) => ({ date: `Day ${i + 1}`, clicks: 0 }));
    const max = Math.max(1, ...values.map((item) => item.clicks));
    const width = 900;
    const height = 190;
    const points = values.map((item, index) => {
        const x = 20 + (index / Math.max(values.length - 1, 1)) * (width - 40);
        const y = 20 + (1 - item.clicks / max) * (height - 40);
        return { x, y, item };
    });
    const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ');

    return (
        <div style={{ width: '100%', overflow: 'hidden' }}>
            <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="230" preserveAspectRatio="none">
                {[0, 1, 2, 3, 4].map((line) => {
                    const y = 20 + line * ((height - 40) / 4);
                    return <line key={line} x1="20" x2={width - 20} y1={y} y2={y} stroke="#D9E2EC" strokeDasharray="3 3" />;
                })}
                <path d={path} fill="none" stroke={blue} strokeWidth="3" />
                {points.map((point, index) => (
                    <circle key={index} cx={point.x} cy={point.y} r="4" fill={blue} stroke="#fff" strokeWidth="2" />
                ))}
            </svg>
        </div>
    );
}

const metricCard: CSSProperties = {
    background: '#FFFFFF',
    border: `1px solid ${border}`,
    borderRadius: 8,
    minHeight: 104,
    padding: '18px 18px',
    boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
};

const metricBadge: CSSProperties = {
    borderRadius: 4,
    padding: '5px 8px',
    fontSize: 10,
    fontWeight: 600,
    whiteSpace: 'nowrap',
};

const panel: CSSProperties = {
    background: '#FFFFFF',
    border: `1px solid ${border}`,
    borderRadius: 8,
    padding: '18px 22px',
    boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
};

const outlineButton: CSSProperties = {
    height: 36,
    border: `1px solid ${border}`,
    background: '#FFFFFF',
    color: navy,
    borderRadius: 6,
    padding: '0 14px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
};

const dangerButton: CSSProperties = {
    ...outlineButton,
    border: '1px solid #FECACA',
    background: '#FEECEC',
    color: '#DC2626',
};

const linkCopyButton: CSSProperties = {
    border: 'none',
    background: 'transparent',
    color: blue,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
};

const errorBox: CSSProperties = {
    marginBottom: 16,
    border: '1px solid #FECACA',
    background: '#FEF2F2',
    color: '#B91C1C',
    borderRadius: 8,
    padding: '12px 14px',
    fontWeight: 600,
};

const loadingBox: CSSProperties = {
    marginBottom: 16,
    border: `1px solid ${border}`,
    background: '#FFFFFF',
    color: muted,
    borderRadius: 8,
    padding: '12px 14px',
    fontWeight: 600,
};

const miniTableHead: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 80px 80px',
    color: '#667085',
    fontSize: 10,
    fontWeight: 600,
    border: `1px solid ${border}`,
    borderBottom: 0,
    padding: '10px 14px',
};

const miniTableRow: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 80px 80px',
    alignItems: 'center',
    border: `1px solid ${border}`,
    padding: '10px 14px',
    color: navy,
    fontSize: 12,
};

const geoHead: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 120px 120px',
    color: '#667085',
    fontSize: 10,
    fontWeight: 600,
    border: `1px solid ${border}`,
    padding: '10px 14px',
};

const geoRow: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '60px 1fr 120px 120px',
    border: `1px solid ${border}`,
    borderTop: 0,
    padding: '10px 14px',
    color: navy,
    fontSize: 12,
};

const dateButton: CSSProperties = {
    ...outlineButton,
    height: 30,
    fontSize: 11,
};

const emptyText: CSSProperties = {
    color: muted,
    fontSize: 12,
    fontWeight: 600,
    padding: '12px 0',
};


