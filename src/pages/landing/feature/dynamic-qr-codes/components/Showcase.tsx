import {
  Check,
  RefreshCw,
  Palette,
  BarChart3
} from "lucide-react";

const benefits = [
  {
    title: "Update content without reprinting",
    description: "Change your QR code destination whenever you want - perfect for seasonal promotions and menu updates.",
    icon: RefreshCw,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    iconBorder: "border-purple-100/85"
  },
  {
    title: "Professional branding for every QR",
    description: "Make your QR codes stand out with custom colors, logos, and frames that match your brand identity.",
    icon: Palette,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    iconBorder: "border-purple-100/85"
  },
  {
    title: "Data-driven decisions with analytics",
    description: "See who's scanning your QR codes, where they're located, and when they're scanning for better campaign insights.",
    icon: BarChart3,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    iconBorder: "border-purple-100/85"
  }
];

export default function Showcase() {
  return (
    <section className="bg-white py-18 px-6 border-b border-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 items-center lg:grid-cols-2 mb-28">
          <div>
            <div className="mb-6 inline-block rounded-full border border-purple-200 bg-purple-50 px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-purple-700">
              Analytics Dashboard
            </div>
            <h3 className="mb-8 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Detailed insights for every QR code
            </h3>
            <p className="mb-10 text-lg text-slate-650 leading-relaxed">
              Get real-time analytics and powerful insights to understand how your QR codes are performing and optimize your campaigns.
            </p>
            <div className="space-y-4">
              {[
                "Real-time scan tracking and timestamps",
                "Location-based analytics with heat maps",
                "Device and browser detection",
                "Export reports to CSV or PDF"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-purple-600">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 shadow-xl shadow-slate-100/40 backdrop-blur-md">
              <div className="mb-8 flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-900">Campaign Performance</h4>
                <div className="rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700">
                  ↑ 34.2% this week
                </div>
              </div>

              <div className="mb-8 grid grid-cols-4 gap-4">
                {[
                  { value: "18.4K", label: "Total Scans" },
                  { value: "15.2K", label: "Unique" },
                  { value: "82.6%", label: "CTR" },
                  { value: "47", label: "Active QRs" }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-150 bg-white p-5 text-center shadow-sm shadow-slate-100"
                  >
                    <div className="text-xl font-extrabold text-slate-900">{stat.value}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="h-48 flex items-end gap-2 px-2">
                {Array.from({ length: 12 }).map((_, i) => {
                  const heights = [30, 45, 38, 60, 48, 72, 65, 40, 55, 80, 70, 85];
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-lg transition-all duration-300 hover:opacity-85"
                      style={{
                        height: `${heights[i]}%`,
                        background: i === 11
                          ? "linear-gradient(180deg, #A162F7 0%, #8037F3 100%)"
                          : "linear-gradient(180deg, rgba(161, 98, 247, 0.25) 0%, rgba(128, 55, 243, 0.08) 100%)"
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200/60 bg-slate-50/50 p-8 hover:bg-white hover:shadow-xl hover:shadow-slate-100/60 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${benefit.iconBorder} ${benefit.iconBg} ${benefit.iconColor}`}>
                <benefit.icon className="w-7 h-7" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-slate-900">
                {benefit.title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}