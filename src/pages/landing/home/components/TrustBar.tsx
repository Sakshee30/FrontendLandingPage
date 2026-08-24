import {
  ShoppingBag,
  Globe,
  Layout,
  Instagram,
  Youtube,
  Linkedin,
  Zap,
  Sparkles,
  Slack,
  Video,
} from "lucide-react";

export function TrustBar() {
  const platforms = [
    { name: "Shopify", icon: ShoppingBag, hoverColor: "group-hover:text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-100" },
    { name: "WordPress", icon: Globe, hoverColor: "group-hover:text-sky-600 group-hover:bg-sky-50 group-hover:border-sky-100" },
    { name: "Webflow", icon: Layout, hoverColor: "group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100" },
    { name: "Instagram", icon: Instagram, hoverColor: "group-hover:text-pink-600 group-hover:bg-pink-50 group-hover:border-pink-100" },
    { name: "TikTok", icon: Video, hoverColor: "group-hover:text-slate-900 group-hover:bg-slate-50 group-hover:border-slate-200" },
    { name: "YouTube", icon: Youtube, hoverColor: "group-hover:text-rose-600 group-hover:bg-rose-50 group-hover:border-rose-100" },
    { name: "LinkedIn", icon: Linkedin, hoverColor: "group-hover:text-blue-600 group-hover:bg-blue-50 group-hover:border-blue-100" },
    { name: "Zapier", icon: Zap, hoverColor: "group-hover:text-orange-500 group-hover:bg-orange-50 group-hover:border-orange-100" },
    { name: "HubSpot", icon: Sparkles, hoverColor: "group-hover:text-amber-600 group-hover:bg-amber-50 group-hover:border-amber-100" },
    { name: "Slack", icon: Slack, hoverColor: "group-hover:text-purple-650 group-hover:bg-purple-50 group-hover:border-purple-100" },
  ];

  // Repeat the list 3 times to ensure infinite smooth seamless scroll wrapping
  const list = [...platforms, ...platforms, ...platforms];

  return (
    <section className="bg-gradient-to-b from-white to-slate-50/30 border-y border-slate-200/40 py-10 overflow-hidden relative">
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.3333%);
          }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <p className="mb-8 text-center text-[11px] font-black uppercase tracking-[0.25em] text-slate-400/90 select-none">
        Integrates seamlessly with your stack
      </p>

      {/* Marquee Scroller Wrapper */}
      <div className="relative w-full overflow-hidden flex">
        {/* Soft edge blur overlays */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50/95 via-slate-50/40 to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50/95 via-slate-50/40 to-transparent z-10"></div>

        {/* Rolling track */}
        <div className="flex gap-4 animate-marquee whitespace-nowrap py-1">
          {list.map((platform, idx) => {
            const Icon = platform.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-3 rounded-2xl border border-slate-200/50 bg-white/40 backdrop-blur-sm pl-3.5 pr-5 py-2.5 shadow-sm text-sm font-bold text-slate-600 hover:text-slate-900 hover:border-slate-350 hover:bg-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-100/50 group cursor-pointer transition-all duration-300"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/60 text-slate-400 transition-all duration-300 ${platform.hoverColor}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span>{platform.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrustBar;