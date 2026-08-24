import fmtLimitVal from "../../../utils/helpers/format-limit-value";
import { Subscription } from "../../services/subscription";

export default function LimitsPanel({
    sub,
}: {
    sub: Subscription;
}) {
    const lim = sub.limits;

    if (!lim) return null;

    const rows = [
        ["Short links", fmtLimitVal(lim.max_links)],
        ["Clicks / month", fmtLimitVal(lim.max_clicks_per_month)],
        [
            "Websites",
            fmtLimitVal(
                lim.max_websites ?? (lim as any).max_workspaces
            ),
        ],
        ["Team members", fmtLimitVal(lim.max_team_members)],
        ["QR codes", fmtLimitVal(lim.qr_codes)],
        ["Bio pages", fmtLimitVal(lim.bio_pages)],
        ["Custom domains", lim.custom_domains ? "✓" : "—"],
        ["API access", lim.api_access ? "✓" : "—"],
        ["Webhooks", lim.webhooks ? "✓" : "—"],
    ];

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-extrabold text-slate-900">
                    Plan Limits
                </h3>
            </div>
            <div>
                {rows.map(([label, value], index) => (
                    <div
                        key={label}
                        className={`
              flex items-center justify-between
              px-5 py-3
              text-sm
              ${index % 2 === 0
                                ? "bg-white"
                                : "bg-slate-50/50"
                            }
              ${index < rows.length - 1
                                ? "border-b border-slate-100"
                                : ""
                            }
            `}
                    >
                        <span className="text-slate-500">
                            {label}
                        </span>
                        <span
                            className={`font-bold ${value === "✓"
                                ? "text-emerald-600"
                                : value === "—"
                                    ? "text-slate-400"
                                    : "text-slate-900"
                                }`}
                        >
                            {value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}