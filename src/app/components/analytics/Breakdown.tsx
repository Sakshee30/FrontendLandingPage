import MetricBar from "./MetricBar";

function pct(value: number, total: number) {
    return total ? Math.round((value / total) * 100) : 0;
}

export default function Breakdown({
    counts,
    total,
}: {
    counts: Record<string, number>;
    total: number;
}) {
    const rows = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    if (!rows.length) return <p style={{ color: '#667085' }}>No data yet.</p>;
    return (
        <div className="space-y-5">
            {rows.map(([name, count]) => (
                <MetricBar key={name} name={name} percent={pct(count, total)} />
            ))}
        </div>
    );
}
