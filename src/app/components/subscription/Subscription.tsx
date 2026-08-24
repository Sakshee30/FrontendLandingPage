import React from "react";
import { cancelSubscription, createRzpSubscription, getActivePlans, getCurrentSubscription, Plan, selectPlan, type Subscription, verifyRzpPayment } from "../../services/subscription";
import PaymentSuccessScreen from "./PaymentSuccessScreen";
import PaymentErrorScreen from "./PaymentErrorScreen";
import RepriceNotice from "./RepriceNotice";
import CurrentPlanCard from "./CurrentPlanCard";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";
import BillingToggle from "./BillingToggle";
import PlanCard from "./PlanCard";
import BillingPanel from "./BillingPanel";
import LimitsPanel from "./LimitsPanel";

function loadRzpScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if ((window as any).Razorpay) { resolve(true); return; }
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve(true);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
    });
}

async function openRzpCheckout({
    rzpKeyId, rzpSubscriptionId, planName, currency,
    userEmail, userName, onSuccess, onDismiss,
}: {
    rzpKeyId: string; rzpSubscriptionId: string; planName: string; currency: string;
    userEmail?: string; userName?: string;
    onSuccess: (paymentId: string, subscriptionId: string, signature: string) => void;
    onDismiss: () => void;
}) {
    const loaded = await loadRzpScript();
    if (!loaded) throw new Error("Could not load Razorpay checkout.");
    const rzp = new (window as any).Razorpay({
        key: rzpKeyId,
        subscription_id: rzpSubscriptionId,
        name: "Ziplin",
        description: planName,
        currency: currency.toUpperCase(),
        prefill: { email: userEmail ?? "", name: userName ?? "" },
        theme: { color: "#081C45" },
        handler: (r: any) => onSuccess(r.razorpay_payment_id, r.razorpay_subscription_id, r.razorpay_signature),
        modal: { ondismiss: onDismiss },
    });
    rzp.open();
}


export function Subscription() {
    const [plans, setPlans] = React.useState<Plan[]>([]);
    const [sub, setSub] = React.useState<Subscription | null>(null);
    const [defaultPlan, setDefaultPlan] = React.useState<Plan | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [billingPeriod, setBillingPeriod] = React.useState<"monthly" | "yearly">("monthly");
    const [selecting, setSelecting] = React.useState<string | null>(null);
    const [toast, setToast] = React.useState<{ msg: string; type: "ok" | "err" } | null>(null);
    const [error, setError] = React.useState("");
    const [repriceDismissed, setRepriceDismissed] = React.useState(false);
    const [cancelling, setCancelling] = React.useState(false);
    const [plansExpanded, setPlansExpanded] = React.useState(true);
    const [successState, setSuccessState] = React.useState<{ plan: Plan; sub: Subscription } | null>(null);
    const [payError, setPayError] = React.useState<{ planName: string; message: string; retry: () => void } | null>(null);

    React.useEffect(() => {
        Promise.all([getActivePlans(), getCurrentSubscription()])
            .then(([ps, { subscription, defaultPlan: dp }]) => {
                setPlans(ps);
                setSub(subscription);
                setDefaultPlan(dp);
                if (subscription && subscription.plan_slug !== "free") setPlansExpanded(false);
            })
            .catch(() => setError("Failed to load plans. Please try again."))
            .finally(() => setLoading(false));
    }, []);

    async function handleSelect(planId: string) {
        const plan = plans.find((p) => p.id === planId);
        if (!plan) return;
        setSelecting(planId);
        try {
            if (Number(plan.price_monthly) === 0) {
                const r = await selectPlan(planId, billingPeriod);
                setSub(r.subscription);
                setToast({ msg: `Switched to ${plan.name}.`, type: "ok" });
                return;
            }
            const checkout = await createRzpSubscription(planId, billingPeriod);
            await openRzpCheckout({
                rzpKeyId: checkout.rzpKeyId, rzpSubscriptionId: checkout.rzpSubscriptionId,
                planName: checkout.planName, currency: checkout.currency,
                onSuccess: async (payId, subId, sig) => {
                    try {
                        const r = await verifyRzpPayment({ razorpay_payment_id: payId, razorpay_subscription_id: subId, razorpay_signature: sig });
                        setSub(r.subscription);
                        setRepriceDismissed(true);
                        setSuccessState({ plan, sub: r.subscription });
                    } catch (e: any) {
                        const msg = e?.response?.data?.message ?? e.message ?? "Activation failed. Contact support.";
                        setPayError({ planName: plan.name, message: msg, retry: () => { setPayError(null); handleSelect(planId); } });
                    } finally { setSelecting(null); }
                },
                onDismiss: () => setSelecting(null),
            });
        } catch (e: any) {
            setToast({ msg: e?.response?.data?.message ?? e.message ?? "Failed to start checkout", type: "err" });
            setSelecting(null);
        }
    }

    async function handleCancel() {
        if (!confirm("Cancel your subscription? You'll keep access until the end of the billing period.")) return;
        setCancelling(true);
        try {
            const r = await cancelSubscription();
            setSub(r.subscription);
            setToast({ msg: "Subscription cancelled. Access continues until period end.", type: "ok" });
        } catch (e: any) {
            setToast({ msg: e.message ?? "Failed to cancel", type: "err" });
        } finally { setCancelling(false); }
    }

    const yearlyDiscount = (() => {
        const pro = plans.find((p) => p.slug === "pro");
        if (!pro || Number(pro.price_monthly) === 0) return 0;
        return Math.round((1 - Number(pro.price_yearly) / (Number(pro.price_monthly) * 12)) * 100);
    })();

    if (loading) {
        return (
            <div className="flex h-[300px] items-center justify-center">
                <div className="flex items-center gap-3 text-slate-500">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                    <span className="text-sm font-medium">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-7 max-w-[1080px] font-sans text-gray-900">
            {toast && (
                <div
                    onClick={() => setToast(null)}
                    className={`
    fixed bottom-6 right-6 z-[9999]
    flex max-w-[360px] cursor-pointer items-center gap-2
    rounded-xl px-5 py-3
    text-sm font-bold text-white
    shadow-lg
    transition-all duration-200 hover:scale-[1.02]
    ${toast.type === "ok"
                            ? "bg-emerald-600"
                            : "bg-red-700"
                        }
  `}
                >
                    <span className="text-base">
                        {toast.type === "ok" ? "✓" : "✕"}
                    </span>
                    <span>{toast.msg}</span>
                </div>
            )}
            {successState && (
                <PaymentSuccessScreen
                    plan={successState.plan}
                    sub={successState.sub}
                    onDone={() => { setSuccessState(null); setPlansExpanded(false); }}
                />
            )}
            {payError && (
                <PaymentErrorScreen
                    planName={payError.planName}
                    message={payError.message}
                    onRetry={() => { setPayError(null); payError.retry(); }}
                    onDismiss={() => setPayError(null)}
                />
            )}
            <div className="mb-7">
                <h2 className="text-2xl font-bold text-gray-900">Subscription</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your plan and billing.</p>
            </div>

            {error && (
                <div className="text-sm font-bold text-red-600 bg-red-100 border border-red-200 rounded-xl px-4 py-3 mb-6">
                    {error}
                </div>
            )}

            {(sub as any)?.force_reprice && !repriceDismissed && (
                <RepriceNotice onDismiss={() => setRepriceDismissed(true)} />
            )}

            <CurrentPlanCard sub={sub} plan={defaultPlan} onCancel={handleCancel} cancelling={cancelling} />
            <div className="mb-8">
                {!plansExpanded ? (
                    <button
                        onClick={() => setPlansExpanded(true)}
                        className="w-full flex items-center justify-between px-6 py-4 bg-white border-2 border-dashed rounded-xl cursor-pointer border-slate-300"
                        style={{ transition: "border-color 0.15s, background 0.15s", }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#94A3B8"; (e.currentTarget as HTMLElement).style.background = "#F8FAFC"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#CBD5E1"; (e.currentTarget as HTMLElement).style.background = "#fff"; }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-100 rounded-xl w-9 h-9 flex items-center justify-center">
                                <Zap size={16} color="#64748B" />
                            </div>
                            <div className="text-left">
                                <div className="text-base font-bold text-gray-900">Change or upgrade plan</div>
                                <div className="text-sm text-gray-500 mt-1">View all available plans</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                            View plans <ChevronDown size={15} />
                        </div>
                    </button>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
                            <div className="flex items-center gap-2">
                                <Zap size={16} color="#081C45" />
                                <span className="text-lg font-bold text-gray-900">Choose a plan</span>
                            </div>
                            <div className="flex items-center gap-3" >
                                <BillingToggle value={billingPeriod} onChange={setBillingPeriod} discount={yearlyDiscount} />
                                <button
                                    onClick={() => setPlansExpanded(false)}
                                    className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-slate-500 text-sm font-semibold px-2 py-1 rounded-lg transition-colors duration-150 hover:text-slate-700 hover:bg-slate-100"
                                >
                                    <ChevronUp size={15} /> Collapse
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {plans.map((plan) => (
                                    <PlanCard
                                        key={plan.id} plan={plan} currentSub={sub}
                                        billingPeriod={billingPeriod} onSelect={handleSelect} selecting={selecting}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {sub && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <BillingPanel rzpSubId={sub.rzp_subscription_id ?? null} currency={sub.currency ?? "INR"} />
                    <LimitsPanel sub={sub} />
                </div>
            )}
        </div>
    );
}

