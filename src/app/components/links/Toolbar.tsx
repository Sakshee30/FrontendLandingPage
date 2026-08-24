import React from "react";
import { ChevronDown, Filter, Search } from "lucide-react";
import { TOKEN_COLOR } from "../../../utils/constants/colors.constants";

interface ToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    showFilters: boolean;
    onToggleFilters: () => void;
    timeFilter: string;
    onTimeFilterChange: (value: string) => void;
    clickFilter: string;
    onClickFilterChange: (value: string) => void;
    domainFilter: string;
    onDomainFilterChange: (value: string) => void;
    onClearFilters: () => void;
    onExport: () => void;
    filteredCount?: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    search,
    onSearchChange,
    showFilters,
    onToggleFilters,
    timeFilter,
    onTimeFilterChange,
    clickFilter,
    onClickFilterChange,
    domainFilter,
    onDomainFilterChange,
    onClearFilters,
    onExport,
}) => {
    const hasActiveFilters =
        timeFilter !== "All time" ||
        clickFilter !== "All" ||
        domainFilter !== "All";

    return (
        <section
            className="mb-4 rounded-lg border bg-white p-4"
            style={{
                borderColor: TOKEN_COLOR.BORDER,
                boxShadow: "0 1px 2px rgba(15,23,42,0.03)",
            }}
        >
            <div className="mb-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-[13px] font-extrabold" style={{ color: TOKEN_COLOR.TEXT }}>
                    <Filter size={15} />
                    Filter Links
                </div>
                <span className="text-[12px] font-semibold" style={{ color: TOKEN_COLOR.FAINT }}>
                    Use filters to find specific links
                </span>
                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={onToggleFilters}
                        className="flex cursor-pointer items-center gap-1.5 rounded border bg-white px-[12px] py-[7px] text-[12px] font-bold"
                        style={{
                            borderColor: showFilters ? "#0B3B78" : TOKEN_COLOR.BORDER,
                            color: showFilters ? "#0B3B78" : TOKEN_COLOR.MUTED,
                            fontFamily: "Inter, sans-serif",
                        }}
                    >
                        Filter
                        <ChevronDown size={12} />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div
                    className="flex flex-1 items-center gap-2 rounded border px-[14px] py-[10px]"
                    style={{
                        background: "#F7F9FC",
                        borderColor: TOKEN_COLOR.BORDER,
                        minWidth: 260,
                    }}
                >
                    <Search size={14} color={TOKEN_COLOR.FAINT} />
                    <input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search for links"
                        className="flex-1 border-none bg-transparent text-[13px] outline-none"
                        style={{
                            color: TOKEN_COLOR.TEXT,
                            fontFamily: "Inter, sans-serif",
                        }}
                    />
                    {search && (
                        <button
                            onClick={() => onSearchChange("")}
                            className="border-none bg-transparent p-0 text-sm leading-none cursor-pointer"
                            style={{ color: TOKEN_COLOR.FAINT }}
                        >
                            x
                        </button>
                    )}
                </div>

                <button
                    onClick={onExport}
                    className="flex cursor-pointer items-center rounded border bg-white px-[13px] py-[10px] text-[13px] font-bold"
                    style={{
                        borderColor: TOKEN_COLOR.BORDER,
                        color: TOKEN_COLOR.MUTED,
                        fontFamily: "Inter, sans-serif",
                    }}
                >
                    Export
                </button>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="rounded border bg-white px-[13px] py-[10px] text-[13px] font-bold cursor-pointer"
                        style={{
                            borderColor: "#FECACA",
                            color: TOKEN_COLOR.DANGER,
                        }}
                    >
                        Clear
                    </button>
                )}
            </div>

            {showFilters && (
                <div
                    className="mt-3 flex flex-wrap items-center gap-2.5 border-t pt-3"
                    style={{ borderColor: TOKEN_COLOR.BORDER }}
                >
                    <span className="text-xs font-bold" style={{ color: TOKEN_COLOR.FAINT }}>
                        FILTER BY
                    </span>

                    {[
                        {
                            label: "Date",
                            value: timeFilter,
                            set: onTimeFilterChange,
                            options: ["All time", "Today", "Last 7 days", "Last 30 days"],
                        },
                        {
                            label: "Clicks",
                            value: clickFilter,
                            set: onClickFilterChange,
                            options: ["All", "Has clicks", "No clicks"],
                        },
                        {
                            label: "Domain",
                            value: domainFilter,
                            set: onDomainFilterChange,
                            options: ["All", "Default", "Custom"],
                        },
                    ].map(({ label, value, set, options }) => (
                        <div key={label} className="relative">
                            <select
                                aria-label={label}
                                value={value}
                                onChange={(e) => set(e.target.value)}
                                className="appearance-none rounded border pr-7 pl-3 py-[7px] text-xs font-semibold cursor-pointer"
                                style={{
                                    borderColor: value !== options[0] ? "#0B3B78" : TOKEN_COLOR.BORDER,
                                    background: value !== options[0] ? "#EEF4FF" : "#fff",
                                    color: value !== options[0] ? "#0B3B78" : TOKEN_COLOR.MUTED,
                                    fontFamily: "Inter, sans-serif",
                                }}
                            >
                                {options.map((option) => (
                                    <option key={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={11}
                                color={TOKEN_COLOR.MUTED}
                                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                            />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};
