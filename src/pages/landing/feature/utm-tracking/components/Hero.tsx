import { Link } from "react-router";
import {
  ArrowRightLeft,
  BarChart3,
  Filter,
  CheckCircle2,
  Layers
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 py-18 px-6">
      <div className="relative z-10 mx-auto max-w-7xl grid gap-20 items-center lg:grid-cols-2">
        <div className="text-left">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-purple/20 bg-purple-500/5 px-5 py-2 text-sm font-semibold text-purple-700">
            <ArrowRightLeft className="w-4 h-4 text-purple-600" />
            UTM Tracking
          </div>
          <h1 className="mb-8 text-balance text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight text-slate-900 leading-[1.08]">
            Track every click with
            <span className="text-purple-600 block mt-2">
              perfect UTM parameters
            </span>
          </h1>
          <p className="mb-12 max-w-xl text-lg text-slate-600 leading-relaxed font-medium">
            Never worry about inconsistent UTMs again. Automate parameter creation, enforce standards, and analyze traffic sources like never before.
          </p>
          <div className="flex flex-wrap items-center gap-5 mb-14">
            <Link
              to="/signup"
              className="rounded-lg bg-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-600/20 hover:shadow-violet-600/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Start for free
            </Link>
            <Link
              to="/pricing"
              className="rounded-lg border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              See how it works
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Filter, label: "Smart presets" },
              { icon: BarChart3, label: "Source analysis" },
              { icon: CheckCircle2, label: "Consistent UTMs" },
              { icon: Layers, label: "Easy filtering" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-sm hover:shadow transition-shadow duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100/30 flex-shrink-0">
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
          <div className="relative rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)] ">
            <div className="flex items-center gap-1.5 mb-6 pb-4 border-b border-slate-100">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="ml-4 text-[10px] font-mono text-slate-400">ziplin.io/utm-builder</span>
            </div>
            <div className="mb-6 text-left">
              <h3 className="text-lg font-extrabold text-slate-850">UTM Builder</h3>
              <p className="text-xs font-semibold text-slate-400 mt-1">Create perfect tracking links in seconds</p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { label: "Campaign Source", value: "instagram", icon: "📱" },
                { label: "Campaign Medium", value: "social", icon: "🔗" },
                { label: "Campaign Name", value: "summer-sale-2025", icon: "🏷️" },
              ].map((field, index) => (
                <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:border-slate-250 hover:bg-slate-55 transition-all duration-200 text-left">
                  <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-450 mb-1 flex items-center gap-2">
                    <span>{field.icon}</span>
                    {field.label}
                  </div>
                  <div className="text-sm font-extrabold text-slate-800">{field.value}</div>
                </div>
              ))}
            </div>
            <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-100/60 p-5 shadow-inner text-left">
              <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                Generated Link
              </div>
              <div className="text-sm font-bold text-blue-800 break-all leading-relaxed">
                ziplin.io/summer?utm_source=instagram&utm_medium=social&utm_campaign=summer-sale-2025
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "38.2k", label: "Clicks", color: "text-blue-600" },
                { value: "62%", label: "From Instagram", color: "text-violet-600" },
                { value: "12.8%", label: "Conversion", color: "text-emerald-600" }
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl border border-slate-150 bg-white p-4 text-center shadow-sm hover:shadow transition-shadow duration-200">
                  <div className={`text-lg font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-450 mt-1 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
