import { AlertCircle, Building2, Calendar, Crown, Gift, XCircle, Zap } from "lucide-react";
import { Plan, Subscription } from "../../services/subscription";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../../../utils/helpers/formatDate";
import fmtCurrency from "../../../utils/helpers/formatCurrency";

export const PLAN_STYLES: Record<
    string,
    {
        card: string;
        icon: string;
        badge: string;
    }
> = {
    free: {
        card:
            "bg-gradient-to-br from-[#FFF7D6] to-white border-[#F4B400] shadow-sm",
        icon: "bg-[#081C45] text-[#F4B400]",
        badge: "bg-[#FFF6CC]",
    },
    pro: {
        card:
            "bg-gradient-to-br from-[#FFF7D6] to-white border-[#F4B400] shadow-sm",
        icon: "bg-[#081C45] text-[#F4B400]",
        badge: "bg-[#FFF6CC]",
    },
    business: {
        card:
            "bg-gradient-to-br from-[#FFF6CC] to-white border-[#F4B400] shadow-sm",
        icon: "bg-[#081C45] text-[#F4B400]",
        badge: "bg-[#FFF6CC]",
    },
    enterprise: {
        card:
            "bg-gradient-to-br from-[#FFF7D6] to-white border-[#F4B400] shadow-sm",
        icon: "bg-[#081C45] text-[#F4B400]",
        badge: "bg-[#FFF6CC]",
    },
};

export const DEFAULT_STYLE = {
    card:
        "bg-gradient-to-br from-[#FFF7D6] to-white border-[#F4B400] shadow-sm",
    icon: "bg-[#081C45] text-[#F4B400]",
    badge: "bg-[#FFF6CC]",
};

export const PLAN_ICONS: Record<string, typeof Gift> = {
    free: Gift,
    pro: Zap,
    business: Crown,
    enterprise: Building2,
};

export default function CurrentPlanCard({
    sub,
    plan,
    onCancel,
    cancelling,
}: {
    sub: Subscription | null;
    plan: Plan | null;
    onCancel: () => void;
    cancelling: boolean;
}) {
    const p = sub
        ? {
            name: sub.plan_name,
            slug: sub.plan_slug,
            price_monthly: sub.price_monthly,
            currency: sub.currency,
        }
        : plan
            ? {
                name: plan.name,
                slug: plan.slug,
                price_monthly: plan.price_monthly,
                currency: plan.currency,
            }
            : null;

    if (!p) return null;

    const style = PLAN_STYLES[p.slug] ?? DEFAULT_STYLE;
    const Icon = PLAN_ICONS[p.slug] ?? Gift;

    const isFree = Number(p.price_monthly) === 0;
    const isPaid =
        sub &&
        !isFree &&
        (sub.status === "active" || sub.status === "trialing");

    const canCancel = isPaid && !sub?.cancel_at_period_end;

    return (
        <div className={` mb-8 rounded-2xl border p-5 md:p-6 ${style.card}`}
        >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <div
                    className={`
            flex h-14 w-14 shrink-0 items-center justify-center
            rounded-xl shadow-lg
            ${style.icon}
          `}
                >
                    <Icon size={24} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-extrabold text-slate-900">
                            {p.name}
                        </h3>
                        {sub && <StatusBadge status={sub.status} />}
                        {sub?.force_reprice && (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-700">
                                ⚠ Price update required
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <span className="text-sm text-slate-500">
                            {isFree
                                ? "Free forever"
                                : `${fmtCurrency(
                                    Number(p.price_monthly),
                                    p.currency
                                )} / month · ${sub?.billing_period ?? "monthly"
                                } billing`}
                        </span>
                        {sub?.current_period_end &&
                            sub.status === "active" &&
                            !sub.cancel_at_period_end && (
                                <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                                    <Calendar
                                        size={14}
                                        className="text-slate-400"
                                    />
                                    Next charge:
                                    <span className="font-semibold text-slate-900">
                                        {formatDate(sub.current_period_end)}
                                    </span>
                                </span>
                            )}
                        {sub?.cancel_at_period_end && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-700">
                                <AlertCircle size={14} />
                                Cancels{" "}
                                {formatDate(
                                    sub.current_period_end
                                        ? sub.current_period_end
                                        : ""
                                )}
                            </span>
                        )}
                    </div>
                </div>
                {canCancel && (
                    <button
                        onClick={onCancel}
                        disabled={cancelling}
                        className="
              inline-flex items-center justify-center gap-2
              rounded-xl border border-red-300
              bg-white px-4 py-2.5
              text-sm font-semibold text-red-600
              transition-colors
              hover:bg-red-50
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
                    >
                        <XCircle size={16} />
                        {cancelling ? "Cancelling..." : "Cancel plan"}
                    </button>
                )}
            </div>
        </div>
    );
}

