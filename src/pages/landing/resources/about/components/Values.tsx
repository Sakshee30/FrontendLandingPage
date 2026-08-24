import { ShieldCheck, Zap, Coins } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Latency Obsession",
    desc: "We measure redirection times in single-digit milliseconds. Fast response rates maximize user conversion metrics.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100"
  },
  {
    icon: Coins,
    title: "Fair Pricing Always",
    desc: "We believe marketing tools shouldn't charge custom enterprise rates for standard features. We keep plans simple and transparent.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100"
  },
  {
    icon: ShieldCheck,
    title: "Respect for Privacy",
    desc: "We build built-in compliance options for GDPR and CCPA directly inside the tracking settings. Your visitors own their data.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100"
  }
];

export default function Values() {
  return (
    <section className="py-20 px-6 bg-slate-50/30 border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-slate-900">Our Core Pillars</h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">The values driving our engineering and customer decisions</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {values.map((val, i) => {
            const Icon = val.icon;
            return (
              <div key={i} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300 text-left">
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border ${val.border} ${val.bg} ${val.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-sm text-slate-650 leading-relaxed font-medium">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
