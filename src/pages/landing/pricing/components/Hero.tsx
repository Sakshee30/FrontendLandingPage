import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 py-20 lg:py-24 px-6 border-b border-slate-100">
      {/* Background blobs */}
      <div className="pointer-events-none absolute -top-64 -left-72 h-[900px] w-[900px] rounded-full bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-cyan-500/5 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-5 py-2 text-sm font-semibold text-violet-750 shadow-sm">
          <Sparkles className="w-4 h-4 text-violet-650" />
          Pricing Plans
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
          Simple, transparent
          <span className="text-purple-600 block mt-2">
            pricing structure
          </span>
        </h1>
        <p className="max-w-xl mx-auto text-lg text-slate-600 font-medium leading-relaxed">
          Start free. Upgrade when you need more links, branding controls, team seats, or API limits. No hidden fees, ever.
        </p>
      </div>
    </section>
  );
}
