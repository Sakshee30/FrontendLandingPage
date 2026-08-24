import {
  Check,
  Zap,
  BarChart3,
  ShieldCheck
} from "lucide-react";

export default function Showcase() {
  const benefits = [
    {
      title: "Track performance across every channel",
      description: "One dashboard for all campaigns. See email, social, paid, and organic performance in one place with automatic UTM tracking.",
      icon: BarChart3
    },
    {
      title: "Get more clicks and conversions",
      description: "Build trust instantly with branded links, personalize every destination, and send users to the right place.",
      icon: Zap
    },
    {
      title: "Keep control of your campaigns",
      description: "Edit destinations anytime, stay organized at scale with tagging, and use advanced control options like expiration and passwords.",
      icon: ShieldCheck
    }
  ];

  return (
    <section className="bg-white py-18 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 items-center lg:grid-cols-2 mb-28">
          <div>
            <div className="mb-6 inline-block rounded-full border border-blue-500/20 bg-blue-500/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
              Analytics
            </div>
            <h3 className="mb-6 text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Powerful link management in one location
            </h3>
            <p className="mb-8 text-base text-slate-600 leading-relaxed font-medium">
              Track performance across every channel, optimize for maximum conversions, and maintain full control over your branded link campaigns-all from one powerful dashboard.
            </p>
            <div className="space-y-4">
              {[
                "One dashboard for all campaigns",
                "Automatic UTM tracking",
                "Audience insights by location, device & language"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600 shadow-sm">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-650">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)]">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-800">
                Analytics Overview
              </div>
              <div className="rounded-xl border border-emerald-250 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm">
                ↑ 24.3%
              </div>
            </div>
            <div className="mb-8 grid grid-cols-3 gap-4">
              {[
                { label: "Total Clicks", value: "24.8k" },
                { label: "Unique", value: "18.2k" },
                { label: "CTR", value: "7.3%" }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow transition-shadow"
                >
                  <div className="text-2xl font-black text-slate-850 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="h-28 flex items-end gap-2 px-1">
              {Array.from({ length: 14 }).map((_, i) => {
                const heights = [55, 72, 48, 88, 65, 95, 78, 60, 82, 70, 91, 58, 74, 86];
                return (
                  <div
                    key={i}
                    className="flex-1 rounded-t-lg transition-all duration-300"
                    style={{
                      height: `${heights[i]}%`,
                      background:
                        i === 12
                          ? "linear-gradient(180deg, #7c3aed 0%, #6366f1 100%)"
                          : "rgba(124, 58, 237, 0.15)"
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600">
                <benefit.icon className="w-7 h-7" />
              </div>
              <h4 className="mb-3 text-lg font-bold text-slate-850">
                {benefit.title}
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
