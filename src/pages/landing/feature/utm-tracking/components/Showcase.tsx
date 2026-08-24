import { CheckCircle2, TrendingUp, PieChart, Filter } from "lucide-react";

export default function Showcase() {
  return (
    <section className="bg-white py-32 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-20 items-center lg:grid-cols-2 mb-28">
          <div>
            <div className="mb-6 inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-purple-700">
              Analytics Dashboard
            </div>
            <h3 className="mb-8 text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Analyze traffic by
              <br />
              UTM parameters
            </h3>
            <p className="mb-10 text-lg text-slate-600 leading-relaxed">
              See which sources, mediums, and campaigns are performing best. Filter and compare to find winning combinations.
            </p>
            <div className="space-y-4">
              {[
                "Compare traffic from different sources",
                "See conversion rates by UTM campaign",
                "Filter by any UTM parameter",
                "Download UTM reports in seconds"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics mockup */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)]">
              <div className="mb-8 flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-900">Traffic by Source</h4>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    Last 30 Days
                  </div>
                  <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1.5 text-xs font-bold">
                    Clicks
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { source: "Instagram", percentage: 42, clicks: "16,042", color: "from-pink-500 to-purple-500" },
                  { source: "TikTok", percentage: 28, clicks: "10,695", color: "from-pink-500 to-rose-500" },
                  { source: "Google Ads", percentage: 18, clicks: "6,875", color: "from-blue-500 to-purple-500" },
                  { source: "Email", percentage: 8, clicks: "3,056", color: "from-yellow-500 to-orange-500" },
                  { source: "LinkedIn", percentage: 4, clicks: "1,528", color: "from-blue-600 to-indigo-600" },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-800">{item.source}</span>
                      <span className="text-sm font-bold text-slate-700">{item.clicks} ({item.percentage}%)</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              icon: TrendingUp,
              title: "Performance Trends",
              description: "See how each UTM parameter performs over time with beautiful charts.",
            },
            {
              icon: PieChart,
              title: "Attribution",
              description: "Understand how your traffic sources work together to drive conversions.",
            },
            {
              icon: Filter,
              title: "Advanced Filtering",
              description: "Filter analytics by any combination of UTM parameters for deep insights.",
            },
          ].map((item, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-white p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                <item.icon className="w-7 h-7" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-slate-900">
                {item.title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
