import { Link2, MousePointerClick, QrCode, BookUser } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getAllLinksOverview, ZiplinClick, ZiplinLink } from "../../services/links";
import { getDayKey, getGreeting } from "../../../utils/helpers/getGreetings";
import { StatCard } from "./StatCard";
import { QuickShortener } from "./QuickShortner";
import HeaderComponent from "./HeaderComponent";
import RecentActivity from "./RecentActivity";
import ChartSection from "./ChartSection";
import { fontInfo } from "../../../utils/helpers/getFont";
import TopReferrers from "./TopReferrer";
import { FreeDashboard } from "./FreeDashboard";


function countBy(items: string[]) {
    return items.reduce<Record<string, number>>((acc, item) => {
        const key = item || "Direct";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
}

const STAT_DEFS = [
    { key: "clicks", label: "Total Clicks", Icon: MousePointerClick, accent: fontInfo.C.accent1, bg: fontInfo.C.accent1Bg },
    { key: "links", label: "Links Created", Icon: Link2, accent: fontInfo.C.accent2, bg: fontInfo.C.accent2Bg },
    { key: "qr", label: "QR Scans", Icon: QrCode, accent: fontInfo.C.accent3, bg: fontInfo.C.accent3Bg },
    { key: "bio", label: "Bio Views", Icon: BookUser, accent: fontInfo.C.accent4, bg: fontInfo.C.accent4Bg },
];

interface DashboardProps { onCreateLink: () => void; }

export function Dashboard({ onCreateLink }: DashboardProps) {
    const { user } = useAuth();
    const [links, setLinks] = useState<ZiplinLink[]>([]);
    const [clicks, setClicks] = useState<ZiplinClick[]>([]);
    const [loading, setLoading] = useState(true);
    const isFreeUser = !user?.plan || user.plan.slug === "free";

    async function load(silent = false) {
        if (!silent) setLoading(true);
        try {
            const data = await getAllLinksOverview();
            setLinks(data.links);
            setClicks(data.clicks ?? []);
        } finally { setLoading(false); }
    }

    useEffect(() => {
        load();
        const id = window.setInterval(() => { if (document.visibilityState === "visible") load(true); }, 5000);
        const onVis = () => { if (document.visibilityState === "visible") load(true); };
        window.addEventListener("focus", onVis);
        document.addEventListener("visibilitychange", onVis);
        return () => { window.clearInterval(id); window.removeEventListener("focus", onVis); document.removeEventListener("visibilitychange", onVis); };
    }, []);

    const chartData = useMemo(() => {
        const buckets = countBy(clicks.map((c) => getDayKey(c.clickedAt)));
        const data = Object.entries(buckets).map(([day, clicks]) => ({ day, clicks }));
        return data.length ? data : [{ day: "No data", clicks: 0 }];
    }, [clicks]);

    const referrers = useMemo(() => {
        const counts = countBy(clicks.map((c) => c.referrer || "Direct"));
        const total = clicks.length || 1;
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
            .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }));
    }, [clicks]);
    const today = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());

    if (isFreeUser) {
        return <FreeDashboard onCreated={() => load(true)} />;
    }

    return (
        <div className="max-w-[1600px] p-6">
            <HeaderComponent
                user={user}
                today={today}
                onCreateLink={onCreateLink}
                getGreeting={getGreeting}
            />
            <QuickShortener onCreated={() => load(true)} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {STAT_DEFS.map((def) => {
                    const value =
                        def.key === "clicks" ? clicks.length.toLocaleString() :
                            def.key === "links" ? links.length.toLocaleString() : "0";
                    return (
                        <StatCard key={def.key} label={def.label} value={loading ? "—" : value}
                            live={def.key === "clicks" || def.key === "links"}
                            Icon={def.Icon} accent={def.accent} bg={def.bg} />
                    );
                })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <ChartSection
                    chartData={chartData}
                    totalClicks={clicks.length}
                />
                <TopReferrers
                    referrers={referrers}
                />
            </div>
            <RecentActivity
                clicks={clicks}
                onViewAll={() => console.log('View all clicked')}

            />
        </div>
    );
}

