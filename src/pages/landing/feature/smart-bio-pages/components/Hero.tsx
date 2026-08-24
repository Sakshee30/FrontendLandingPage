import { Link } from "react-router";
import {
  User,
  ArrowRight,
  Palette,
  Zap,
  Globe,
  ShoppingBag,
  Instagram,
  Twitter,
  Linkedin,
  Youtube
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 py-18 px-6">
      <div className="relative z-10 mx-auto max-w-7xl grid gap-20 items-center lg:grid-cols-2">
        <div className="text-left">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-5 py-2 text-sm font-semibold text-purple-700">
            <User className="w-4 h-4 text-purple-600" />
            Smart Bio Pages
          </div>
          <h1 className="mb-8 text-balance text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight text-slate-900 leading-[1.08]">
            Turn followers
            <span className="bg-gradient-to-r from-purple-600 via-indigo-550 to-purple-500 bg-clip-text text-transparent block mt-2">
              into fans
            </span>
            with one link
          </h1>
          <p className="mb-12 max-w-xl text-lg text-slate-600 leading-relaxed font-medium">
            Create stunning link-in-bio pages that drive clicks, grow your audience, and sell your products. All in one beautiful place.
          </p>
          <div className="flex flex-wrap items-center gap-5 mb-14">
            <Link
              to="/signup"
              className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 via-indigo-550 to-purple-500 px-10 py-4.5 text-base font-bold text-white shadow-lg shadow-purple-600/15 hover:shadow-xl hover:shadow-purple-600/25 hover:scale-105 transition-all duration-200 inline-flex items-center gap-2 group"
            >
              <span className="relative z-10">Start for free</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800"></div>
            </Link>
            <Link
              to="/pricing"
              className="rounded-lg border border-slate-200 bg-white px-10 py-4.5 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              See how it works
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Palette, label: "Custom themes" },
              { icon: Zap, label: "Lightning fast" },
              { icon: ShoppingBag, label: "Sell products" },
              { icon: Globe, label: "Custom domains" }
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
              <span className="ml-4 text-[10px] font-mono text-slate-450">ziplin.io/zoe-miller</span>
            </div>
            <div className="text-center mb-8">
              <div className="relative mx-auto mb-5 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 via-purple-500 to-indigo-500 flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-purple-500/20">
                Z
              </div>
              <h3 className="text-xl font-extrabold text-slate-850">Zoe Miller</h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Digital Creator & Designer</p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { text: "🚀 New Portfolio", badge: "NEW" },
                { text: "🎨 Design Courses", badge: "HOT" },
                { text: "📺 YouTube Channel", badge: "" },
                { text: "📧 Newsletter", badge: "" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl bg-slate-50 border border-slate-100 p-4 text-center transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-center gap-3">
                    {item.badge && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-purple-500 to-purple-500 text-white px-2.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <span className="text-sm font-bold text-slate-700">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              {[
                { icon: Instagram, color: "text-purple-600 bg-purple-50 border-purple-100/40" },
                { icon: Twitter, color: "text-sky-500 bg-sky-50 border-sky-100/40" },
                { icon: Youtube, color: "text-red-600 bg-red-50 border-red-100/40" },
                { icon: Linkedin, color: "text-blue-600 bg-blue-50 border-blue-100/40" }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`h-10 w-10 rounded-full border flex items-center justify-center cursor-pointer shadow-sm hover:scale-110 active:scale-95 transition-all duration-200 ${item.color}`}
                >
                  <item.icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}