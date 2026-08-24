import { Link } from "react-router";
import type { PublicPlan } from "../../../../app/services/public";

const SparkleIcon = () => (
  <span className="shrink-0 text-indigo-500 mt-0.5" aria-hidden="true">
    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 2l2.25 4.75L16 9l-4.75 2.25L9 16l-2.25-4.75L2 9l4.75-2.25L9 2zm8 9l1.125 2.375L21 14.5l-2.375 1.125L17 18l-1.125-2.375L13.5 14.5l2.375-1.125L17 11z" />
    </svg>
  </span>
);

const CheckIcon = () => (
  <span className="flex items-center justify-center shrink-0 w-5 h-5 rounded-full border border-indigo-200 text-indigo-500 bg-indigo-50/10 mt-0.5" aria-hidden="true">
    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </span>
);

export default function PlanCard({ plan }: { plan: PublicPlan }) {
  const limits = (plan.limits || {}) as Record<string, any>;
  const subtitle = limits.subtitle || "";
  const feeInfo = limits.fee_info || "";
  const isRecommended = plan.slug === "pro";
  // const isRecommended = plan.isDefault || plan.slug === "pro";

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: plan.currency || "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(plan.priceYearly || 0);

  let featuresHeader = "What's included";
  if (plan.slug === "launch") {
    featuresHeader = "All core features, plus:";
  } else if (plan.slug === "grow") {
    featuresHeader = "Everything in Launch, plus:";
  } else if (plan.slug === "rise") {
    featuresHeader = "Everything in Grow, plus:";
  }

  const featuresList = (plan.features || []).map((feature: string) => {
    const isSpark = feature.startsWith("✨ ");
    const text = isSpark ? feature.substring(2) : feature;
    return { text, isSpark };
  });

  return (
    <div
      className={`bg-white border rounded-[28px] relative flex flex-col justify-between transition-all duration-300 ${isRecommended
        ? "border-indigo-150 shadow-xl shadow-indigo-100/40 md:scale-[1.02] z-10"
        : "border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
        }`}
    >
      {isRecommended && (
        <div className="absolute top-0 left-0 right-0 bg-[#e8ebff] py-2.5 text-center rounded-t-[27px]">
          <span className="text-[#4f46e5] text-xs font-extrabold tracking-wider uppercase">
            Recommended
          </span>
        </div>
      )}

      {/* Main card body */}
      <div className={`p-8 flex-1 flex flex-col justify-between ${isRecommended ? "pt-16" : "pt-8"}`}>
        <div className="text-left mb-6">
          <div className="text-3xl font-bold text-slate-900 tracking-tight">
            {plan.name}
          </div>
          <div className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
            {subtitle}
          </div>

          <div className="flex items-baseline gap-1 mt-6">
            <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              {formattedPrice}
            </span>
            <span className="text-xs font-semibold text-slate-500 ml-1">
              Per Year
            </span>
          </div>

          <div className="text-[11px] font-semibold text-slate-800 mt-2 leading-relaxed min-h-[32px]">
            {feeInfo}
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-medium mt-6 min-h-[40px]">
            {plan.description}
          </p>
        </div>

        <Link
          to="/signup"
          className="w-[90%] mx-auto text-center py-3.5 font-bold rounded-full text-sm transition-all duration-200 block mb-6 bg-[#4f46e5] text-white hover:bg-[#4338ca] shadow-md shadow-indigo-500/10 hover:scale-[1.02] active:scale-[0.98]"
        >
          Get Started
        </Link>

        <div className="border-t border-slate-100 pt-6 text-left flex-1 flex flex-col">
          <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">
            {featuresHeader}
          </div>
          <ul className="space-y-3.5 flex-1">
            {featuresList.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-xs font-semibold text-slate-700">
                {feature.isSpark ? <SparkleIcon /> : <CheckIcon />}
                <span className="leading-relaxed font-semibold text-slate-700 mt-0.5">{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}