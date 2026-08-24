import { Pencil, Trash2 } from "lucide-react";
import formatDate from "../../../utils/helpers/format-date";
import { Campaign } from "../../services/campaigns";

interface Props {
    filtered: Campaign[];
    statusStyles: Record<Campaign["status"], { className: string; label: string }>;
    removeCampaign: (id: string) => void;
    setEditing: (campaign: Campaign | null) => void;
    setShowForm: (show: boolean) => void;
    loading?: boolean
}

export default function CampaignTable({ filtered, statusStyles, removeCampaign, setEditing, setShowForm, loading }: Props) {
    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse font-sans">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                            {["Campaign", "Source", "Medium", "Status", "Links", "Clicks", "Goal Progress", "Created", "Actions"].map((col) => (
                                <th
                                    key={col}
                                    className="py-3 px-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap bg-slate-50/50"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map((campaign) => {
                            const status = statusStyles[campaign.status];
                            const goalPct = Math.min(100, Math.round(((campaign.clicks || 0) / campaign.goal) * 100));
                            return (
                                <tr key={campaign.id} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="py-4 px-4 text-sm font-semibold text-slate-800 truncate max-w-[180px]">
                                        {campaign.name}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-700">
                                        <code className="text-xs bg-blue-50/60 text-blue-600 px-2 py-0.5 rounded font-mono">
                                            {campaign.source}
                                        </code>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-700">
                                        <code className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                                            {campaign.medium}
                                        </code>
                                    </td>
                                    <td className="py-4 px-4 text-sm">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.className}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-600 font-medium">
                                        {campaign.links}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-600 font-medium">
                                        {campaign.clicks}
                                    </td>
                                    <td className="py-4 px-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-slate-100 rounded-full h-2 w-[100px] overflow-hidden">
                                                <div
                                                    style={{ width: `${goalPct}%` }}
                                                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                                />
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-400">
                                                {goalPct}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-500">
                                        {formatDate(campaign.createdAt)}
                                    </td>
                                    <td className="py-4 px-4 text-sm whitespace-nowrap">
                                        <button
                                            onClick={() => { setEditing(campaign); setShowForm(true); }}
                                            className="bg-transparent border-none cursor-pointer text-slate-400 p-1.5 hover:text-slate-800 transition-colors inline-flex justify-center items-center rounded-lg focus:outline-none"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => removeCampaign(campaign.id)}
                                            className="bg-transparent border-none cursor-pointer text-slate-400 p-1.5 hover:text-red-600 transition-colors inline-flex justify-center items-center rounded-lg focus:outline-none ml-1.5"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {!filtered.length && !loading ? (
                            <tr>
                                <td colSpan={9} className="py-12 text-center text-slate-400 text-sm font-medium">
                                    No campaigns found.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </>
    )
}