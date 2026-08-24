import { useState } from "react";
import { BookOpen, Search } from "lucide-react";

export function SearchHero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 pt-20 pb-20 px-6 border-b border-slate-200/60">
      <div className="pointer-events-none absolute -top-64 -left-72 h-[900px] w-[900px] rounded-full bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-cyan-500/5 blur-3xl"></div>
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-5 py-2 text-sm font-semibold text-violet-750">
          <BookOpen className="w-4 h-4 text-violet-650" />
          Knowledge Base
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
          How can we help you?
        </h1>
        <p className="mb-10 text-base md:text-lg text-slate-600 font-medium">
          Search our comprehensive guides, installation tutorials, and platform documentations.
        </p>

        {/* Search Bar Simulation */}
        <div className="mx-auto max-w-xl flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-100 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/5 transition-all">
          <Search className="h-5 w-5 text-slate-400 ml-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search guides, pixels, custom domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-sm md:text-base font-medium"
          />
        </div>
      </div>
    </section>
  );
}
