import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Campaign, CampaignPayload } from "../../services/campaigns";
import { ZiplinLink } from "../../services/links";
import { campaignSlug, linkMatchesCampaign } from "./Campaigns";

const mediums = ["social", "newsletter", "video", "organic", "paid", "affiliate", "other"];
const sources = ["instagram", "facebook", "twitter", "linkedin", "youtube", "google", "email", "direct", "other"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
            {children}
        </div>
    );
}

export default function CampaignForm({
    initial,
    links,
    onSave,
    onClose
}: {
    initial?: Campaign | null;
    links: ZiplinLink[];
    onSave: (payload: CampaignPayload) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState<CampaignPayload>({
        name: initial?.name || "",
        source: initial?.source || "instagram",
        medium: initial?.medium || "social",
        status: initial?.status || "draft",
        goal: initial?.goal || 10000,
        selectedLinkIds: [],
    });
    const [linkSearch, setLinkSearch] = useState("");

    useEffect(() => {
        if (!initial) return;
        setForm((current) => ({
            ...current,
            selectedLinkIds: links.filter((link) => linkMatchesCampaign(link, initial)).map((link) => link.id),
        }));
    }, [initial, links]);

    const visibleLinks = useMemo(() => {
        const needle = linkSearch.trim().toLowerCase();
        if (!needle) return links;
        return links.filter((link) =>
            `${link.title} ${link.destinationUrl} ${link.slug}`.toLowerCase().includes(needle)
        );
    }, [linkSearch, links]);

    function toggleLink(id: string) {
        setForm((current) => {
            const selected = current.selectedLinkIds || [];
            return {
                ...current,
                selectedLinkIds: selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id],
            };
        });
    }

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px] z-40"
            />
            {/* Slide-over Drawer */}
            <div className="fixed top-0 right-0 w-full md:w-[440px] h-screen bg-white border-l border-slate-200 z-50 flex flex-col font-sans shadow-2xl">
                {/* Header */}
                <div className="px-7 pt-6 pb-4 border-b border-slate-200 flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 m-0">
                            {initial ? "Edit Campaign" : "New Campaign"}
                        </h2>
                        <p className="text-xs font-semibold text-slate-400 mt-1 m-0">
                            Configure UTM parameters and goals.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none cursor-pointer text-slate-400 p-1 hover:text-slate-800 transition-colors focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form fields scroll container */}
                <div className="flex-1 overflow-y-auto px-7 py-6">
                    <Field label="Campaign Name">
                        <input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Summer Sale"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#081C45]/20 focus:border-[#081C45] font-sans transition-all"
                        />
                    </Field>
                    <Field label="UTM Source">
                        <select
                            value={form.source}
                            onChange={(e) => setForm({ ...form, source: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#081C45]/20 focus:border-[#081C45] font-sans transition-all"
                        >
                            {sources.map((item) => <option key={item}>{item}</option>)}
                        </select>
                    </Field>
                    <Field label="UTM Medium">
                        <select
                            value={form.medium}
                            onChange={(e) => setForm({ ...form, medium: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#081C45]/20 focus:border-[#081C45] font-sans transition-all"
                        >
                            {mediums.map((item) => <option key={item}>{item}</option>)}
                        </select>
                    </Field>
                    <Field label="Status">
                        <select
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value as Campaign["status"] })}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#081C45]/20 focus:border-[#081C45] font-sans transition-all"
                        >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                        </select>
                    </Field>
                    <Field label="Click Goal">
                        <input
                            type="number"
                            value={form.goal}
                            onChange={(e) => setForm({ ...form, goal: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#081C45]/20 focus:border-[#081C45] font-sans transition-all"
                        />
                    </Field>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs font-mono text-[#164BB7] break-all leading-relaxed mb-4">
                        ?utm_source={form.source}&utm_medium={form.medium}&utm_campaign={campaignSlug(form.name)}
                    </div>

                    {/* Link Picker attachments */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 mt-5">
                        <div className="flex justify-between gap-3 items-center mb-3">
                            <div>
                                <strong className="text-sm font-bold text-slate-800">Attach links</strong>
                                <p className="text-[11px] text-slate-400 font-medium m-0 mt-0.5">
                                    Selected links will get this campaign UTM automatically.
                                </p>
                            </div>
                            <span className="bg-[#FFF6CC] text-[#164BB7] rounded-full px-2.5 py-1 text-[11px] font-extrabold whitespace-nowrap">
                                {form.selectedLinkIds?.length || 0} selected
                            </span>
                        </div>
                        <input
                            value={linkSearch}
                            onChange={(e) => setLinkSearch(e.target.value)}
                            placeholder="Search links to attach..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#081C45]/20 focus:border-[#081C45] font-sans mb-3"
                        />
                        <div className="grid gap-2 max-h-[220px] overflow-y-auto">
                            {visibleLinks.map((link) => (
                                <label
                                    key={link.id}
                                    className="grid grid-cols-[18px_1fr] items-center gap-2.5 bg-white border border-slate-200 rounded-lg p-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={(form.selectedLinkIds || []).includes(link.id)}
                                        onChange={() => toggleLink(link.id)}
                                        className="accent-[#081C45]"
                                    />
                                    <span className="min-w-0">
                                        <strong className="block text-xs font-bold text-slate-800 truncate">
                                            {link.title}
                                        </strong>
                                        <span className="block text-[11px] text-slate-400 font-medium truncate mt-0.5">
                                            {link.destinationUrl}
                                        </span>
                                    </span>
                                </label>
                            ))}
                            {!visibleLinks.length ? (
                                <div className="text-slate-400 text-xs font-medium py-3 text-center">
                                    No links found.
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-7 py-4 border-t border-slate-200 flex gap-3 bg-white">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-lg border border-slate-200 bg-white text-slate-650 font-bold text-sm hover:bg-slate-50 cursor-pointer transition-colors focus:outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => form.name.trim() && onSave(form)}
                        className="flex-[1.5] py-3 rounded-lg border-none bg-[#081C45] hover:bg-[#081C45] text-white font-bold text-sm cursor-pointer transition-colors focus:outline-none"
                    >
                        Save Campaign
                    </button>
                </div>
            </div>
        </>
    );
}

