interface Props {
    search: string;
    statusFilter: "all" | "active" | "paused" | "draft";
    setSearch: (search: string) => void;
    setStatusFilter: (status: "all" | "active" | "paused" | "draft") => void;
}

export default function CampaignFilter({ search, statusFilter, setSearch, setStatusFilter }: Props) {
    return (
        <>
            <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50 w-full overflow-x-auto">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search campaigns..."
                    className="flex-1 px-3.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-sans transition-all"
                />
                {(["all", "active", "paused", "draft"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-4 py-1.5 rounded-full font-bold text-xs capitalize transition-all focus:outline-none cursor-pointer ${statusFilter === status
                            ? "bg-[#081C45] text-white shadow-sm shadow-[#081C45]/10"
                            : "bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                            }`}
                    >
                        {status === "all" ? "All" : status}
                    </button>
                ))}
            </div>
        </>
    )
}
