import { Link } from "react-router";
import {
  QrCode,
  ArrowRight,
  RefreshCw,
  Palette,
  BarChart3,
  Download
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 py-18 px-6">
      <div className="relative z-10 mx-auto max-w-7xl grid gap-20 items-center lg:grid-cols-2">
        <div className="text-left">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-5 py-2 text-sm font-semibold text-purple-700">
            <QrCode className="w-4 h-4 text-purple-600" />
            Dynamic QR Codes
          </div>

          {/* Headline */}
          <h1 className="mb-8 text-balance text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight text-slate-900 leading-[1.08]">
            QR codes that
            <span className="bg-gradient-to-r from-purple-600 via-indigo-650 to-purple-600 bg-clip-text text-transparent block mt-2">
              evolve with you
            </span>
          </h1>

          <p className="mb-12 max-w-xl text-lg text-slate-600 leading-relaxed font-medium">
            Generate beautiful, scannable dynamic QR codes that you can update anytime. Track scans in real-time and customize every detail to match your brand.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-5 mb-14">
            <Link
              to="/signup"
              className="relative overflow-hidden rounded-lg bg-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-purple-600/15 hover:shadow-xl hover:shadow-purple-600/25 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2 group"
            >
              <span className="relative z-10">Create a QR Code</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/pricing"
              className="rounded-lg border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              View examples
            </Link>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: RefreshCw, label: "Edit anytime" },
              { icon: Palette, label: "Custom design" },
              { icon: Download, label: "Vector files" },
              { icon: BarChart3, label: "Analytics" }
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

        {/* QR Code mockup */}
        <div className="relative">
          {/* Soft backdrop blur glow */}

          <div className="relative mx-auto max-w-md rounded-[2.5rem] border border-slate-200/80 bg-white/85 backdrop-blur-md p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)]">
            {/* Browser dot indicators */}
            <div className="flex items-center gap-1.5 mb-6 pb-4 border-b border-slate-100">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="ml-4 text-[10px] font-mono text-slate-400">ziplin.io/qr-generator</span>
            </div>

            {/* QR Code preview */}
            <div className="mb-6 flex justify-center">
              <div className="w-60 h-60 rounded-3xl bg-white border border-slate-150 p-5 shadow-md flex items-center justify-center hover:scale-102 transition-transform duration-300">
                <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-2xl flex items-center justify-center p-3 shadow-inner">
                  <QrCode className="w-full h-full text-white" />
                </div>
              </div>
            </div>

            {/* QR info */}
            <div className="space-y-4 mb-6 text-left">
              <div className="rounded-2xl bg-purple-50 border border-purple-100/60 p-4 shadow-sm">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700 mb-1">Destination URL</div>
                <div className="text-sm font-bold text-purple-850 break-all">ziplin.io/summer-campaign-2025</div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { value: "2.4K", label: "Total Scans" },
                  { value: "89%", label: "Unique Users" },
                  { value: "24h", label: "Last Scan" }
                ].map((stat, i) => (
                  <div key={i} className="rounded-2xl border border-slate-150 bg-white p-3.5 text-center shadow-sm hover:shadow transition-shadow">
                    <div className="text-lg font-black text-slate-800 tracking-tight">{stat.value}</div>
                    <div className="text-[9px] font-bold text-slate-450 mt-1 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-purple-600/10 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-200 cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" />
                Edit URL
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}