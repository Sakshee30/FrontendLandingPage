import { Download, RefreshCw, Share2 } from "lucide-react";

interface Props {
    load: () => void;
    handlePublicReport: () => void;
    filters: any;
    sharing: boolean;
    exportClicks: (clicks: any) => void;
    summary: any;
    exportPdfLikeReport: (summary: any) => void;
    handleResetAnalytics: () => void;
    clicks: any;

}
export default function AnalyticsHeader({ load, handlePublicReport, filters, sharing, exportClicks, summary, exportPdfLikeReport, handleResetAnalytics, clicks }: Props) {
    return (
        <>
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <h1 className="m-0 flex items-center gap-2 text-2xl font-bold text-slate-800">
                    Analytics Overview
                </h1>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => load()}
                        className="flex items-center gap-1 rounded-md border border-[#2F80ED] bg-white px-4 py-2 text-sm font-bold text-[#2F80ED] transition-colors hover:bg-blue-50"
                    >
                        <RefreshCw size={14} />
                        Apply Filters
                    </button>

                    <button
                        onClick={handlePublicReport}
                        disabled={!filters.linkId || sharing}
                        className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-55"
                    >
                        <Share2 size={14} />
                        {sharing ? "Sharing..." : "Public Report"}
                    </button>

                    <button
                        onClick={() => exportClicks(clicks)}
                        className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        <Download size={14} />
                        Export
                    </button>

                    <button
                        onClick={() => exportPdfLikeReport(summary)}
                        className="flex items-center gap-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        PDF
                    </button>

                    <button
                        onClick={handleResetAnalytics}
                        disabled={!filters.linkId}
                        className="flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-55"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </>
    )
}