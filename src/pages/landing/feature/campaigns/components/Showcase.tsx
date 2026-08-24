import { CheckCircle2, Calendar, Users, TrendingUp } from "lucide-react";

export default function Showcase() {
  return (
    <section className="bg-white py-18 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-20 items-center lg:grid-cols-2 mb-28">
          <div>
            <div className="mb-6 inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-purple-700">
              Campaign Dashboard
            </div>
            <h3 className="mb-8 text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              See all your campaign
              <br />
              performance in one place
            </h3>
            <p className="mb-10 text-lg text-slate-600 leading-relaxed">
              Get a complete overview of how each campaign is performing. Compare results across time periods and channels to find what works best.
            </p>
            <div className="space-y-4">
              {[
                "Compare campaign performance side-by-side",
                "Filter by channel, date range, and more",
                "Export campaign reports in seconds",
                "Set custom goals and track progress"
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

          {/* Dashboard mockup */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)]">
              <div className="mb-8 flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-900">Campaign Comparison</h4>
                <div className="rounded-lg bg-white border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700">
                  Last 30 Days
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { name: "Summer Sale 2025", clicks: "24,891", conversions: "1,245", conversionRate: "5.0%", change: "+12.5%", status: "active" },
                  { name: "Spring Launch", clicks: "18,234", conversions: "785", conversionRate: "4.3%", change: "+8.2%", status: "completed" },
                  { name: "Black Friday", clicks: "35,123", conversions: "2,103", conversionRate: "6.0%", change: "-2.1%", status: "completed" },
                ].map((campaign, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${campaign.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}>
                          {campaign.status === "active" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Calendar className="w-3 h-3" />
                          )}
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">{campaign.name}</span>
                      </div>
                      <span className={`text-xs font-bold ${campaign.change.startsWith("+") ? "text-emerald-700" : "text-rose-700"
                        }`}>{campaign.change}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Clicks", value: campaign.clicks, icon: TrendingUp },
                        { label: "Conversions", value: campaign.conversions, icon: CheckCircle2 },
                        { label: "CR", value: campaign.conversionRate, icon: TrendingUp },
                      ].map((stat, j) => (
                        <div key={j} className="text-center">
                          <div className="text-xl font-black text-slate-900">{stat.value}</div>
                          <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                        </div>
                      ))}
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
              icon: Calendar,
              title: "Time-based Reports",
              description: "Analyze performance by week, month, quarter, or custom date ranges.",
            },
            {
              icon: Users,
              title: "Channel Breakdown",
              description: "See exactly which channels are driving the most traffic and conversions.",
            },
            {
              icon: TrendingUp,
              title: "ROI Tracking",
              description: "Connect your ad spend to track ROI across all your campaigns.",
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
