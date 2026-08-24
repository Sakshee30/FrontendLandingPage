import { MessageSquare } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 pt-20 pb-12 px-6 border-b border-slate-100">
      {/* Background elements */}
      <div className="pointer-events-none absolute -top-64 -left-72 h-[900px] w-[900px] rounded-full bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-cyan-500/5 blur-3xl"></div>
      
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-5 py-2 text-sm font-semibold text-violet-750 shadow-sm">
          <MessageSquare className="w-4 h-4 text-violet-650" />
          Contact Support
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1]">
          We'd love to hear
          <span className="bg-gradient-to-r from-violet-600 via-indigo-650 to-pink-500 bg-clip-text text-transparent block mt-2">
            from you
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-665 font-medium leading-relaxed">
          Have questions about our API, limits, or plan offerings? Reach out directly and our engineering support team will assist you shortly.
        </p>
      </div>
    </section>
  );
}
