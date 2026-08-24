import { Link } from "react-router";
import {
  Link2,
  ArrowRight,
  Zap,
  BarChart3,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 py-18 px-6">
      <div className="relative z-10 mx-auto max-w-7xl grid gap-16 items-center lg:grid-cols-2">
        <div className="text-left">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-5 py-2 text-sm font-semibold tracking-wide text-violet-700">
            <Link2 className="w-4 h-4 text-violet-600" />
            Branded Links
          </div>
          <h1 className="mb-6 text-balance text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.08]">
            Create, share, and track
            <span className="text-purple-600 block mt-2">
              branded links
            </span>
          </h1>
          <p className="mb-10 max-w-lg text-lg text-slate-600 leading-relaxed font-medium">
            Branded links build trust and get more clicks. Smart routing, real-time analytics, and instant editing give you complete campaign control.
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              to="/signup"
              className="rounded-lg bg-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-600/20 hover:shadow-violet-600/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Start for free
            </Link>
            <Link
              to="/pricing"
              className="rounded-lg border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              View pricing
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Zap, label: "Instant editing" },
              { icon: BarChart3, label: "Real-time analytics" },
              { icon: ShieldCheck, label: "Secure & compliant" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 border border-violet-100/60">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-700 leading-tight">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="relative rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)]">
            <div className="flex items-center gap-1.5 mb-6 pb-4 border-b border-slate-100">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="ml-4 text-[10px] font-mono text-slate-400">ziplin.io/links</span>
            </div>
            <div className="mb-6 rounded-2xl bg-slate-50 border border-slate-100 p-6 shadow-sm">
              <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                Your Branded Link
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
                    Z
                  </div>
                  <div>
                    <div className="text-lg font-extrabold text-slate-850">ziplin.io</div>
                    <div className="text-sm font-semibold text-violet-600">/campaign-summer24</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm hover:bg-emerald-100 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Total Clicks", value: "12,849", icon: BarChart3, color: "text-violet-600 bg-violet-50 border-violet-100/50" },
                { label: "Unique Visitors", value: "8,214", icon: Link2, color: "text-blue-600 bg-blue-50 border-blue-100/50" },
                { label: "Conversion Rate", value: "7.3%", icon: Zap, color: "text-emerald-600 bg-emerald-50 border-emerald-100/50" }
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl bg-white border border-slate-100 p-4 flex items-center justify-between shadow-sm hover:shadow transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-500">{stat.label}</span>
                  </div>
                  <div className="text-xl font-black text-slate-800">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
