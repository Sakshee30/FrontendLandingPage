import { Link } from "react-router";
import {
  Target,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  RefreshCw,
  Plus,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  Tag
} from "lucide-react";

const Hero = () => {
  const activePixels = [
    { name: "Meta Pixel", provider: "Meta", event: "PageView", id: "8294..283", active: true, icon: Target, color: "text-blue-600 bg-blue-50 border-blue-100/50" },
    { name: "Google Analytics 4", provider: "Google", event: "purchase", id: "G-7W..81A", active: true, icon: Layers, color: "text-amber-600 bg-amber-50 border-amber-100/50" },
    { name: "LinkedIn Insight Tag", provider: "LinkedIn", event: "Lead", id: "6023..918", active: true, icon: Activity, color: "text-sky-600 bg-sky-50 border-sky-100/50" },
    { name: "TikTok Pixel", provider: "TikTok", event: "Click", id: "TT-83..2A", active: false, icon: Zap, color: "text-slate-400 bg-slate-50 border-slate-100" }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 py-18 px-6 border-b border-slate-100">
      <div className="relative z-10 mx-auto max-w-7xl grid gap-16 items-center lg:grid-cols-2">
        <div className="text-left">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-5 py-2 text-sm font-semibold text-indigo-700">
            <Target className="w-4 h-4 text-indigo-600" />
            Retargeting Pixels
          </div>

          {/* Headline */}
          <h1 className="mb-8 text-balance text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight text-slate-900 leading-[1.08]">
            Reach your audience
            <span className="text-purple-600 block mt-2">
              again and again
            </span>
          </h1>

          <p className="mb-12 max-w-xl text-lg text-slate-650 leading-relaxed font-medium">
            Add retargeting pixels to your short links and build custom audiences on Meta, Google, LinkedIn, and more. Retarget users who click your links with highly relevant ads.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-5 mb-14">
            <Link
              to="/signup"
              className="group flex items-center rounded-lg bg-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-600/20 hover:shadow-violet-600/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <span>Start retargeting</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/pricing"
              className="rounded-lg border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 inline-flex items-center justify-center shadow-sm"
            >
              See how it works
            </Link>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, label: "Real-time" },
              { icon: Shield, label: "GDPR Safe" },
              { icon: BarChart3, label: "Audience Analytics" },
              { icon: Tag, label: "Multi-Pixel" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-sm hover:shadow transition-shadow duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/30 flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-700 leading-tight">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pixel visual mockup */}
        <div className="relative">
          {/* Soft backdrop blur glow */}

          <div className="relative mx-auto max-w-md rounded-[2.5rem] border border-slate-200/80 bg-white/85 backdrop-blur-md p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)]">
            {/* Browser dot indicators */}
            <div className="flex items-center gap-1.5 mb-6 pb-4 border-b border-slate-100">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="ml-4 text-[10px] font-mono text-slate-400">ziplin.io/settings/pixels</span>
            </div>

            {/* Pixel settings header */}
            <div className="mb-6 text-left flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-650" />
                  Retargeting Pixels
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Capture audiences from every redirect</p>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 border border-indigo-150 text-indigo-600 hover:scale-105 active:scale-95 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Pixel list */}
            <div className="space-y-3 mb-6 text-left">
              {activePixels.map((pixel, index) => (
                <div key={index} className="flex items-center justify-between rounded-2xl border border-slate-150 bg-white p-4 shadow-sm hover:shadow transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${pixel.color}`}>
                      <pixel.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">{pixel.name}</span>
                      <span className="text-[10px] font-medium text-slate-400 block mt-0.5">ID: {pixel.id} • Event: {pixel.event}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${pixel.active
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100/30"
                    : "bg-slate-50 text-slate-500 border-slate-100"
                    }`}>{pixel.active ? "Active" : "Inactive"}</span>
                </div>
              ))}
            </div>

            {/* Live fire logs */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 text-left shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-indigo-700 mb-3">
                <Terminal className="w-4 h-4" />
                Live conversion trigger
              </div>
              <div className="text-xs font-mono text-slate-700 bg-white border border-indigo-100/30 rounded-xl p-3.5 break-all shadow-inner">
                <span className="text-indigo-600 font-bold">Meta Pixel</span> fires event <span className="text-violet-650 font-bold">"PageView"</span> for campaign: <span className="text-slate-800 font-semibold">ziplin.co/summer-sale</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero;