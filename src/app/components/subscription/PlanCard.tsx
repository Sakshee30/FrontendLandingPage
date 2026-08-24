import { ArrowRight, Building2, Check, Crown, Gift, Zap } from "lucide-react";
import { Plan, Subscription } from "../../services/subscription";
import { formatDate } from "../../../utils/helpers/formatDate";
import fmtCurrency from "../../../utils/helpers/formatCurrency";

const PLAN_ICONS: Record<string, typeof Gift> = {
    free: Gift,
    pro: Zap,
    business: Crown,
    enterprise: Building2,
};

const PLAN_STYLES: Record<
    string,
    {
        card: string;
        icon: string;
        light: string;
        accent: string;
        button: string;
    }
> = {
    free: {
        card: "bg-[#FFF7D6] border-[#F4B400]",
        icon: "bg-[#081C45] text-[#F4B400]",
        light: "bg-[#FFF6CC]",
        accent: "text-[#164BB7]",
        button: "bg-[#081C45] hover:bg-[#0E2F73]",
    },
    pro: {
        card: "bg-[#FFF7D6] border-[#F4B400]",
        icon: "bg-[#081C45] text-[#F4B400]",
        light: "bg-[#FFF6CC]",
        accent: "text-[#164BB7]",
        button: "bg-[#081C45] hover:bg-[#0E2F73]",
    },
    business: {
        card: "bg-[#FFF6CC] border-[#081C45]",
        icon: "bg-[#081C45] text-[#F4B400]",
        light: "bg-[#FFF6CC]",
        accent: "text-[#164BB7]",
        button: "bg-[#081C45] hover:bg-[#081C45]",
    },
    enterprise: {
        card: "bg-[#FFF7D6] border-[#F4B400]",
        icon: "bg-[#081C45] text-[#F4B400]",
        light: "bg-[#FFF6CC]",
        accent: "text-[#164BB7]",
        button: "bg-[#081C45] hover:bg-[#0E2F73]",
    },
};

const DEFAULT_STYLE = PLAN_STYLES.free;

export default function PlanCard({
    plan,
    currentSub,
    billingPeriod,
    onSelect,
    selecting,
}: {
    plan: Plan;
    currentSub: Subscription | null;
    billingPeriod: "monthly" | "yearly";
    onSelect: (id: string) => void;
    selecting: string | null;
}) {
    const style = PLAN_STYLES[plan.slug] ?? DEFAULT_STYLE;
    const Icon = PLAN_ICONS[plan.slug] ?? Gift;

    const isCurrent = plan.id === (currentSub?.plan_id ?? null);
    const price =
        billingPeriod === "yearly"
            ? plan.price_yearly
            : plan.price_monthly;

    const isLoading = selecting === plan.id;
    const isCancelling = !!currentSub?.cancel_at_period_end;
    const isRenewing = isCurrent && isCancelling;

    const isClickable =
        isRenewing ||
        (!isCurrent && plan.slug !== "enterprise");

    const ctaLabel = isLoading
        ? "Processing…"
        : isRenewing
            ? "Renew plan"
            : isCurrent
                ? "Current plan"
                : isCancelling
                    ? Number(price) === 0
                        ? "Switch to Free"
                        : "Switch plan"
                    : Number(price) === 0
                        ? "Switch to Free"
                        : "Upgrade";

    return (
        <div
            className={`
        relative flex flex-col rounded-2xl border p-5
        transition-all duration-200
        ${isCurrent
                    ? `${style.card} shadow-md ring-4 ring-black/5`
                    : "border-slate-200 bg-white shadow-sm hover:shadow-lg"
                }
      `}
        >
            {isCurrent && (
                <div
                    className={`
            absolute -top-px right-4
            rounded-b-lg px-3 py-1
            text-[10px] font-extrabold tracking-wider text-white
            ${isCancelling
                            ? "bg-amber-500"
                            : style.icon
                        }
          `}
                >
                    {isCancelling ? "CANCELLING" : "CURRENT"}
                </div>
            )}

            {plan.slug === "pro" && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#081C45] px-3 py-1 text-[10px] font-extrabold tracking-wider text-white">
                    MOST POPULAR
                </div>
            )}
            <div className="mb-4 flex items-center gap-3">
                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.icon}`}
                >
                    <Icon size={17} />
                </div>

                <h3 className="text-[15px] font-extrabold text-slate-900">
                    {plan.name}
                </h3>
            </div>
            <div className="mb-4">
                {plan.slug === "enterprise" ? (
                    <div className="text-3xl font-black text-slate-900">
                        Custom
                    </div>
                ) : Number(price) === 0 ? (
                    <div className="text-4xl font-black text-slate-900">
                        Free
                    </div>
                ) : (
                    <div className="flex items-end gap-1">
                        <span className="text-4xl font-black leading-none text-slate-900">
                            {fmtCurrency(
                                Number(price),
                                plan.currency
                            )}
                        </span>

                        <span className="pb-1 text-sm font-semibold text-slate-400">
                            /{billingPeriod === "yearly" ? "yr" : "mo"}
                        </span>
                    </div>
                )}

                {plan.description && (
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">
                        {plan.description}
                    </p>
                )}
            </div>
            <div className="mb-4 border-t border-slate-100" />
            <div className="mb-5 flex flex-1 flex-col gap-2">
                {plan.features.map((feature, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-2 text-sm text-slate-700"
                    >
                        <div
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${style.light}`}
                        >
                            <Check
                                size={10}
                                strokeWidth={3}
                                className={style.accent}
                            />
                        </div>

                        <span>{feature}</span>
                    </div>
                ))}
            </div>
            {plan.slug === "enterprise" ? (
                <a
                    href="mailto:hello@ziplin.io?subject=Enterprise Plan"
                    className={`
            flex items-center justify-center gap-2
            rounded-xl py-3
            text-sm font-bold text-white
            transition-colors
            ${style.button}
          `}
                >
                    Contact Sales
                    <ArrowRight size={14} />
                </a>
            ) : (
                <div>
                    <button
                        onClick={() =>
                            isClickable && onSelect(plan.id)
                        }
                        disabled={!isClickable || isLoading}
                        className={`
              flex w-full items-center justify-center gap-2
              rounded-xl py-3
              text-sm font-bold
              transition-all
              disabled:cursor-not-allowed
              disabled:opacity-70
              ${!isClickable
                                ? "bg-slate-100 text-slate-400"
                                : isRenewing
                                    ? "bg-amber-500 text-white hover:bg-amber-600"
                                    : `${style.button} text-white`
                            }
            `}
                    >
                        {ctaLabel}

                        {isClickable && !isLoading && (
                            <ArrowRight size={14} />
                        )}
                    </button>

                    {/* Deferred Start Note */}
                    {isClickable &&
                        isCancelling &&
                        currentSub?.current_period_end && (
                            <div className="mt-2 text-center text-xs text-slate-400">
                                {isRenewing
                                    ? "Continues from"
                                    : "Starts"}{" "}
                                <span className="font-semibold text-slate-600">
                                    {formatDate(
                                        currentSub.current_period_end
                                    )}
                                </span>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}
