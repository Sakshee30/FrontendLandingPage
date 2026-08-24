import {
    ArrowRight,
    Building2,
    Check,
    Crown,
    Gift,
    Zap,
} from "lucide-react";

import { Plan, Subscription } from "../../services/subscription";
import { formatDate } from "../../../utils/helpers/formatDate";
import fmtLimitVal from "../../../utils/helpers/format-limit-value";
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
        button: string;
        text: string;
        border: string;
    }
> = {
    free: {
        card: "bg-slate-50 border-slate-300",
        icon: "bg-slate-600",
        button: "bg-slate-600 hover:bg-slate-700",
        text: "text-slate-600",
        border: "border-slate-300",
    },
    pro: {
        card: "bg-blue-50 border-blue-300",
        icon: "bg-blue-500",
        button: "bg-blue-500 hover:bg-blue-600",
        text: "text-blue-600",
        border: "border-blue-300",
    },
    business: {
        card: "bg-[#FFF6CC] border-[#F4B400]",
        icon: "bg-[#081C45]",
        button: "bg-[#081C45] hover:bg-[#081C45]",
        text: "text-[#164BB7]",
        border: "border-[#F4B400]",
    },
    enterprise: {
        card: "bg-rose-50 border-rose-300",
        icon: "bg-rose-600",
        button: "bg-rose-600 hover:bg-rose-700",
        text: "text-rose-600",
        border: "border-rose-300",
    },
};

const DEFAULT_STYLE = {
    card: "bg-slate-50 border-slate-300",
    icon: "bg-slate-600",
    button: "bg-slate-600 hover:bg-slate-700",
    text: "text-slate-600",
    border: "border-slate-300",
};

export default function PaymentSuccessScreen({
    plan,
    sub,
    onDone,
}: {
    plan: Plan;
    sub: Subscription;
    onDone: () => void;
}) {
    const style = PLAN_STYLES[plan.slug] ?? DEFAULT_STYLE;
    const Icon = PLAN_ICONS[plan.slug] ?? Gift;

    const price =
        sub.billing_period === "yearly"
            ? plan.price_yearly
            : plan.price_monthly;

    return (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
            <div
                className="
          w-full max-w-[480px]
          rounded-3xl bg-white
          px-6 py-8 md:px-10 md:py-12
          text-center
          shadow-[0_32px_80px_rgba(0,0,0,0.22)]
          animate-in fade-in zoom-in-95 duration-300
        "
            >
                {/* Success Icon */}
                <div
                    className={`
            mx-auto mb-6
            flex h-20 w-20 items-center justify-center
            rounded-full
            shadow-xl
            ${style.icon}
          `}
                >
                    <Check
                        size={38}
                        className="text-white"
                        strokeWidth={3}
                    />
                </div>

                {/* Heading */}
                <h2 className="mb-2 text-3xl font-black text-slate-900">
                    You're all set!
                </h2>

                <p className="mb-7 text-sm leading-6 text-slate-500">
                    Your{" "}
                    <span className="font-bold text-slate-900">
                        {plan.name}
                    </span>{" "}
                    plan is now active.
                </p>

                {/* Plan Summary */}
                <div
                    className={`
            mb-7 rounded-2xl border p-5 text-left
            ${style.card}
          `}
                >
                    <div className="mb-4 flex items-center gap-3">
                        <div
                            className={`
                flex h-10 w-10 items-center justify-center
                rounded-xl text-white
                ${style.icon}
              `}
                        >
                            <Icon size={18} />
                        </div>

                        <div>
                            <div className="text-sm font-extrabold text-slate-900">
                                {plan.name}
                            </div>

                            <div className="text-xs text-slate-500">
                                {sub.billing_period} billing
                            </div>
                        </div>

                        <div className="ml-auto text-right">
                            <div
                                className={`text-xl font-black ${style.text}`}
                            >
                                {fmtCurrency(
                                    Number(price),
                                    plan.currency
                                )}
                                <span className="ml-1 text-xs font-semibold text-slate-400">
                                    /
                                    {sub.billing_period === "yearly"
                                        ? "yr"
                                        : "mo"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`mb-4 border-t ${style.border}`}
                    />

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {[
                            ["Status", "Active"],
                            [
                                "Next charge",
                                sub.current_period_end
                                    ? formatDate(sub.current_period_end)
                                    : "—",
                            ],
                            [
                                "Websites",
                                sub.limits
                                    ? fmtLimitVal(sub.limits.max_websites)
                                    : "—",
                            ],
                            [
                                "Short links",
                                sub.limits
                                    ? fmtLimitVal(sub.limits.max_links)
                                    : "—",
                            ],
                        ].map(([label, value]) => (
                            <div key={label}>
                                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    {label}
                                </div>

                                <div className="text-sm font-bold text-slate-900">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <button
                    onClick={onDone}
                    className={`
            flex w-full items-center justify-center gap-2
            rounded-xl px-5 py-3.5
            text-sm font-extrabold text-white
            transition-all duration-200
            shadow-lg hover:scale-[1.01]
            active:scale-[0.99]
            ${style.button}
          `}
                >
                    Start using {plan.name}
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
