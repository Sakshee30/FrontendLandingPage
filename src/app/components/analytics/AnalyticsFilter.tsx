import { AnalyticsSummary } from "../../services/analytics";

interface Props {
    filters: {
        from: string;
        to: string;
        linkId: string;
        country: string;
        device: string;
    }
    setFilters: (filters: {
        from: string;
        to: string;
        linkId: string;
        country: string;
        device: string;
    }) => void;
    summary: AnalyticsSummary | null;
    countries: string[];
    devices: string[];
}
export default function AnalyticsFilter({ filters, setFilters, summary, countries, devices }: Props) {
    return (
        <>
            <div className="mb-[18px] grid gap-[10px] rounded-[10px] border border-[#D9E2EC] bg-white p-[20px_22px] md:grid-cols-5">
                <select
                    value={filters.linkId}
                    onChange={(event) =>
                        setFilters({ ...filters, linkId: event.target.value })
                    }
                    className="rounded-lg border border-[#D9E2EC] bg-white px-3 py-2.5 text-[13px] text-[#1C2433] outline-none focus:border-[#2F80ED]"
                >
                    <option value="">All links</option>
                    {(summary?.links || []).map((link) => (
                        <option key={link.id} value={link.id}>
                            {link.title}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={filters.from}
                    onChange={(event) =>
                        setFilters({ ...filters, from: event.target.value })
                    }
                    className="rounded-lg border border-[#D9E2EC] bg-white px-3 py-2.5 text-[13px] text-[#1C2433] outline-none focus:border-[#2F80ED]"
                />
                <input
                    type="date"
                    value={filters.to}
                    onChange={(event) =>
                        setFilters({ ...filters, to: event.target.value })
                    }
                    className="rounded-lg border border-[#D9E2EC] bg-white px-3 py-2.5 text-[13px] text-[#1C2433] outline-none focus:border-[#2F80ED]"
                />
                <select
                    value={filters.country}
                    onChange={(event) =>
                        setFilters({ ...filters, country: event.target.value })
                    }
                    className="rounded-lg border border-[#D9E2EC] bg-white px-3 py-2.5 text-[13px] text-[#1C2433] outline-none focus:border-[#2F80ED]"
                >
                    <option value="">All countries</option>
                    {countries.map((country) => (
                        <option key={country}>{country}</option>
                    ))}
                </select>
                <select
                    value={filters.device}
                    onChange={(event) =>
                        setFilters({ ...filters, device: event.target.value })
                    }
                    className="rounded-lg border border-[#D9E2EC] bg-white px-3 py-2.5 text-[13px] text-[#1C2433] outline-none focus:border-[#2F80ED]"
                >
                    <option value="">All devices</option>
                    {devices.map((device) => (
                        <option key={device}>{device}</option>
                    ))}
                </select>
            </div>
        </>
    )
}