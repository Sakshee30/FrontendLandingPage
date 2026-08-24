import React from "react";
import { ChevronDown, ChevronUp, Clock, CreditCard, } from "lucide-react";
import { getSubscriptionPayments, RzpPayment, UpcomingPayment, } from "../../services/subscription";
import fmtCurrency from "../../../utils/helpers/formatCurrency";

const getStatusClasses = (status: string) => {
    switch (status) {
        case "captured":
            return "bg-emerald-50 text-emerald-600";
        case "failed":
            return "bg-red-100 text-red-700";
        default:
            return "bg-slate-100 text-slate-500";
    }
};

export default function BillingPanel({
    rzpSubId,
    currency,
}: {
    rzpSubId: string | null;
    currency: string;
}) {
    const [payments, setPayments] = React.useState<RzpPayment[]>([]);
    const [upcoming, setUpcoming] =
        React.useState<UpcomingPayment | null>(null);

    const [loading, setLoading] = React.useState(false);
    const [loaded, setLoaded] = React.useState(false);
    const [showAll, setShowAll] = React.useState(false);

    React.useEffect(() => {
        if (!rzpSubId) return;
        setLoading(true);
        getSubscriptionPayments()
            .then((res) => {
                setPayments(res.payments);
                setUpcoming(res.upcoming);
                setLoaded(true);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [rzpSubId]);

    const displayed = showAll
        ? payments
        : payments.slice(0, 5);

    const refreshPayments = () => {
        setLoading(true);
        getSubscriptionPayments()
            .then((res) => {
                setPayments(res.payments);
                setUpcoming(res.upcoming);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-2">
                    <CreditCard
                        size={16}
                        className="text-slate-500"
                    />
                    <span className="text-sm font-extrabold text-slate-900">
                        Billing & Payments
                    </span>
                </div>
                {loaded && (
                    <button
                        onClick={refreshPayments}
                        className="text-xs font-semibold text-slate-400 transition-colors hover:text-slate-600"
                    >
                        ↻ Refresh
                    </button>
                )}
            </div>
            {!rzpSubId ? (
                <div className="px-5 py-6 text-center text-sm text-slate-400">
                    No billing data — subscribe to a paid plan to
                    see payment history.
                </div>
            ) : loading ? (
                <div className="px-5 py-8 text-center text-sm text-slate-400">
                    Loading...
                </div>
            ) : (
                <>
                    {upcoming && (
                        <div className="mx-5 my-4 rounded-xl border border-[#F4B400] bg-[#FFF6CC] p-4">
                            <div className="mb-2 flex items-center gap-2">
                                <Clock
                                    size={14}
                                    className="text-[#164BB7]"
                                />
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#081C45]">
                                    Next auto-deduction
                                </span>
                            </div>
                            <div className="mb-1 text-2xl font-black text-[#081C45]">
                                {fmtCurrency(
                                    upcoming.amount,
                                    currency
                                )}
                            </div>
                            <div className="text-sm text-[#164BB7]">
                                Scheduled for{" "}
                                <span className="font-bold">
                                    {new Date(
                                        upcoming.chargeAt * 1000
                                    ).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            {upcoming.paidCount > 0 && (
                                <div className="mt-1 text-xs text-[#164BB7]">
                                    {upcoming.paidCount} cycle
                                    {upcoming.paidCount !== 1
                                        ? "s"
                                        : ""}{" "}
                                    completed
                                    {upcoming.remainingCount != null &&
                                        ` · ${upcoming.remainingCount} remaining`}
                                </div>
                            )}
                        </div>
                    )}
                    {payments.length === 0 ? (
                        <div className="p-5 text-center text-sm text-slate-400">
                            No payments recorded yet.
                        </div>
                    ) : (
                        <>
                            <div className="hidden md:grid grid-cols-[1fr_100px_110px_80px] border-y border-slate-100 bg-slate-50 px-5 py-2">
                                {["ID", "Amount", "Date", "Status"].map(
                                    (heading) => (
                                        <span
                                            key={heading}
                                            className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400"
                                        >
                                            {heading}
                                        </span>
                                    )
                                )}
                            </div>
                            <div>
                                {displayed.map((payment, index) => (
                                    <div
                                        key={payment.id}
                                        className={`grid gap-3 px-5 py-3 md:grid-cols-[1fr_100px_110px_80px] items-center
                      ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} ${index < displayed.length - 1 ? "border-b border-slate-100" : ""}
                    `}
                                    >
                                        <div className="md:hidden space-y-1">
                                            <div className="truncate font-mono text-xs text-slate-500">
                                                {payment.id}
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900">
                                                    {fmtCurrency(
                                                        payment.amount / 100,
                                                        payment.currency
                                                    )}
                                                </span>
                                                <span
                                                    className={`rounded-md px-2 py-1 text-[10px] font-bold capitalize ${getStatusClasses(
                                                        payment.status
                                                    )}`}
                                                >
                                                    {payment.status ===
                                                        "captured"
                                                        ? "Paid"
                                                        : payment.status}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {new Date(
                                                    payment.created_at * 1000
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden md:block truncate pr-2 font-mono text-xs text-slate-500">
                                            {payment.id}
                                        </div>
                                        <div className="hidden md:block text-sm font-bold text-slate-900">
                                            {fmtCurrency(
                                                payment.amount / 100,
                                                payment.currency
                                            )}
                                        </div>
                                        <div className="hidden md:block text-xs text-slate-500">
                                            {new Date(
                                                payment.created_at * 1000
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}
                                        </div>
                                        <div className="hidden md:block">
                                            <span
                                                className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold capitalize ${getStatusClasses(
                                                    payment.status
                                                )}`}
                                            >
                                                {payment.status ===
                                                    "captured"
                                                    ? "Paid"
                                                    : payment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {payments.length > 5 && (
                                <button
                                    onClick={() =>
                                        setShowAll(!showAll)
                                    }
                                    className="flex w-full items-center justify-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100"
                                >
                                    {showAll ? (
                                        <>
                                            <ChevronUp size={14} />
                                            Show less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown size={14} />
                                            Show all {payments.length} payments
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
