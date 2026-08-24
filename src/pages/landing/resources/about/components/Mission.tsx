import { Globe, Heart, Rocket } from "lucide-react";

export default function Mission() {
  return (
    <section className="py-20 px-6 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto grid gap-16 items-center lg:grid-cols-2">
        {/* Left Column */}
        <div className="text-left">
          <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-650" />
            Our Mission
          </h2>
          <h3 className="text-2xl font-extrabold text-slate-800 mb-6 leading-tight">
            Supercharging every digital link connection.
          </h3>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium mb-6">
            URLs are the core connections of the internet. Every time you share a link, it represents an opportunity to connect with a reader, client, or customer. Yet, standard link managers are slow, default links lack branding, and enterprise analytics suites cost thousands.
          </p>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
            We started Ziplin to solve this. By building our redirection layer on decentralized global edge computing grids, we enable redirects that resolve in under 20ms. We integrate custom domains, vector dynamic QR codes, UTM parameters, and tracking pixels under one affordable workspace.
          </p>
        </div>

        {/* Right Column (Visual stack) */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-pink-500/5 rounded-3xl blur-2xl pointer-events-none"></div>
          
          <div className="relative space-y-6 max-w-md mx-auto">
            {[
              {
                icon: Globe,
                title: "250+ Edge Locations",
                desc: "Your short URLs are served from global edge networks, ensuring immediate delivery in under 20ms.",
                color: "text-violet-600",
                bg: "bg-violet-50",
                border: "border-violet-100"
              },
              {
                icon: Rocket,
                title: "All-in-One Dashboard",
                desc: "No need to purchase separate link shortening, QR codes, or bio page builders. Manage everything together.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-100"
              }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${card.border} ${card.bg}`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-extrabold text-slate-900">{card.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
