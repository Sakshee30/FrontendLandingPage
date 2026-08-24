import { Link } from "react-router";
import {
  Target,
  ArrowRight,
  Zap,
  BarChart3,
  Calendar,
  Layers,
  CheckCircle2,
  Instagram,
  Youtube,
  Mail,
  Video
} from "lucide-react";

export default function Hero() {
  const channels = [
    { name: "Instagram Bio", clicks: "8.4k", icon: Instagram, color: "text-pink-650 bg-pink-50 border-pink-100/50" },
    { name: "YouTube Video", clicks: "6.2k", icon: Youtube, color: "text-red-650 bg-red-50 border-red-100/50" },
    { name: "Email Blast", clicks: "5.1k", icon: Mail, color: "text-blue-650 bg-blue-50 border-blue-100/50" },
    { name: "TikTok Ad", clicks: "3.7k", icon: Video, color: "text-slate-800 bg-slate-50 border-slate-200" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 py-18 px-6 border-b border-slate-100">
      <div className="relative z-10 mx-auto max-w-7xl grid gap-8 items-center lg:grid-cols-2">
        <div className="text-left">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-5 py-2 text-sm font-semibold text-purple-700">
            <Target className="w-4 h-4 text-purple-600" />
            Campaign Management
          </div>
          <h1 className="mb-8 text-balance text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight text-slate-900 leading-[1.08]">
            Plan, launch, and track
            <span className="text-purple-600 block mt-2">
              winning campaigns
            </span>
          </h1>
          <p className="mb-12 max-w-xl text-lg text-slate-650 leading-relaxed font-medium">
            Organize all your links, QR codes, and bio pages into campaigns. Track performance across channels and optimize your ROI in real-time.
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
              className="rounded-lg border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 inline-flex items-center justify-center shadow-sm"
            >
              See how it works
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: "Schedule" },
              { icon: Layers, label: "Organize" },
              { icon: BarChart3, label: "Analyze" },
              { icon: CheckCircle2, label: "Optimize" }
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
          <div className="relative mx-auto max-w-md rounded-[2.5rem] border border-slate-200/80 bg-white/85 backdrop-blur-md p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)]">
            <div className="flex items-center gap-1.5 mb-6 pb-4 border-b border-slate-100">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="ml-4 text-[10px] font-mono text-slate-400">ziplin.io/campaigns/summer-2025</span>
            </div>
            <div className="mb-6 text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-250/30 px-3 py-1 text-xs font-bold text-emerald-700 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active
              </div>
              <h3 className="text-lg font-bold text-slate-900">Summer Sale 2025</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Tracks all summer marketing links</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: "Links", value: "12", color: "text-purple-600 bg-purple-50 border-purple-100/30" },
                { label: "Clicks", value: "24.8k", color: "text-indigo-600 bg-indigo-50 border-indigo-100/30" },
                { label: "Revenue", value: "$18.2k", color: "text-emerald-600 bg-emerald-50 border-emerald-100/30" }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-150 bg-white p-3.5 text-center shadow-sm hover:shadow transition-shadow"
                >
                  <div className={`text-lg font-black tracking-tight ${stat.color.split(" ")[0]}`}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 mt-1 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3 text-left">
              {channels.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-slate-150 bg-white p-4 shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${item.color}`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-slate-600">{item.clicks}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
