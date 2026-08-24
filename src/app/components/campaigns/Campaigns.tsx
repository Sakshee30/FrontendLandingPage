import { useEffect, useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { createCampaign, deleteCampaign, listCampaigns, updateCampaign, Campaign, CampaignPayload } from "../../services/campaigns";
import { ZiplinLink, listLinks, updateLink } from "../../services/links";
import CampaignForm from "./CampaignForm";
import CampaignFilter from "./CampaignFilter";
import CampaignTable from "./CampaignTable";
import CampaignHeader from "./CampaignHeader";
import { StatCard } from "../dashboard/StatCard";

const statusStyles: Record<Campaign["status"], { className: string; label: string }> = {
    active: { className: "bg-emerald-50 text-emerald-600 border border-emerald-100/50", label: "Active" },
    paused: { className: "bg-amber-50 text-amber-600 border border-amber-100/50", label: "Paused" },
    draft: { className: "bg-slate-100 text-slate-500 border border-slate-200/50", label: "Draft" },
};



export function campaignSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "campaign";
}

export function linkMatchesCampaign(link: ZiplinLink, campaign: Pick<CampaignPayload, "name" | "source" | "medium">) {
    const utm = link.settings?.utm || {};
    return utm.source === campaign.source && utm.medium === campaign.medium && utm.campaign === campaignSlug(campaign.name);
}

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [links, setLinks] = useState<ZiplinLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Campaign | null>(null);
    const [statusFilter, setStatusFilter] = useState<"all" | Campaign["status"]>("all");
    const [search, setSearch] = useState("");

    async function load(silent = false) {
        if (!silent) setLoading(true);
        setError(null);
        try {
            const [nextCampaigns, nextLinks] = await Promise.all([listCampaigns(), listLinks()]);
            setCampaigns(nextCampaigns);
            setLinks(nextLinks);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load campaigns");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    useEffect(() => {
        const refreshSilently = () => {
            if (document.visibilityState === "visible" && !showForm) load(true);
        };

        const interval = window.setInterval(refreshSilently, 5000);
        window.addEventListener("focus", refreshSilently);
        document.addEventListener("visibilitychange", refreshSilently);

        return () => {
            window.clearInterval(interval);
            window.removeEventListener("focus", refreshSilently);
            document.removeEventListener("visibilitychange", refreshSilently);
        };
    }, [showForm]);

    const filtered = useMemo(() => campaigns.filter((campaign) => {
        const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
        const needle = search.toLowerCase();
        return matchesStatus && (campaign.name.toLowerCase().includes(needle) || campaign.source.toLowerCase().includes(needle));
    }), [campaigns, search, statusFilter]);

    async function saveCampaign(payload: CampaignPayload) {
        try {
            const { selectedLinkIds = [], ...campaignPayload } = payload;
            const saved = editing ? await updateCampaign(editing.id, campaignPayload) : await createCampaign(campaignPayload);
            const savedCampaignPayload = { name: saved.name, source: saved.source, medium: saved.medium };
            const previousCampaignPayload = editing ? { name: editing.name, source: editing.source, medium: editing.medium } : savedCampaignPayload;

            await Promise.all(links.map((link) => {
                const shouldAttach = selectedLinkIds.includes(link.id);
                const shouldDetach = Boolean(editing && !shouldAttach && linkMatchesCampaign(link, previousCampaignPayload));
                if (!shouldAttach && !shouldDetach) return Promise.resolve(link);

                const currentUtm = link.settings?.utm || {};
                const nextUtm = shouldAttach
                    ? { ...currentUtm, source: saved.source, medium: saved.medium, campaign: campaignSlug(saved.name) }
                    : { ...currentUtm, source: "", medium: "", campaign: "" };

                return updateLink(link.id, {
                    title: link.title,
                    destinationUrl: link.destinationUrl,
                    slug: link.slug,
                    settings: { ...(link.settings || {}), utm: nextUtm },
                });
            }));

            await load(true);
            setShowForm(false);
            setEditing(null);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Could not save campaign");
        }
    }

    async function removeCampaign(id: string) {
        if (!confirm("Delete this campaign?")) return;
        await deleteCampaign(id);
        setCampaigns((current) => current.filter((item) => item.id !== id));
    }

    const totalClicks = campaigns.reduce((sum, campaign) => sum + (campaign.clicks || 0), 0);
    const activeCount = campaigns.filter((campaign) => campaign.status === "active").length;

    return (
        <div className="p-8 font-sans bg-slate-50/30 min-h-screen max-w-[1600px]">
            <CampaignHeader setEditing={setEditing} setShowForm={setShowForm} />
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3.5 mb-4 font-semibold text-sm">
                    {error}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
                {[
                    { label: "Total Campaigns", value: campaigns.length, Icon: TrendingUp, accent: "", bg: "" },
                    { label: "Active", value: activeCount, Icon: TrendingUp, accent: "", bg: "" },
                    { label: "Total Clicks", value: totalClicks.toLocaleString(), Icon: TrendingUp, accent: "", bg: "" },
                    { label: "Avg. per Campaign", value: Math.round(totalClicks / (campaigns.length || 1)).toLocaleString(), Icon: TrendingUp, accent: "", bg: "" }
                ].map((stat) => (
                    <StatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        Icon={stat.Icon}
                        accent={stat.accent}
                        bg={stat.bg}
                        live
                    />
                ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <CampaignFilter search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
                {loading ? (
                    <div className="p-6 text-slate-400 text-sm font-medium">Loading campaigns...</div>
                ) : null}

                <CampaignTable filtered={filtered} statusStyles={statusStyles} removeCampaign={removeCampaign} setEditing={setEditing} setShowForm={setShowForm} loading={loading} />
            </div>
            {showForm && (
                <CampaignForm
                    initial={editing}
                    links={links}
                    onSave={saveCampaign}
                    onClose={() => { setShowForm(false); setEditing(null); }}
                />
            )}
        </div>
    );
}
