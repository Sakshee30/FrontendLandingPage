import {
  Palette,
  Smartphone,
  Zap,
  BarChart3,
  Globe,
  ShoppingBag,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Choose from beautiful pre-built themes or create your own custom design with brand colors and fonts.",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100/70"
  },
  {
    icon: Smartphone,
    title: "Mobile-Optimized",
    description: "Perfectly responsive designs that look amazing on any device, from phones to tablets and desktops.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100/70"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with instant loading and smooth animations, no matter how many links you add.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100/70"
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "See who's clicking your links, where they're from, and what devices they're using in real-time.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100/70"
  },
  {
    icon: ShoppingBag,
    title: "Sell Products & Services",
    description: "Add digital products, courses, appointments, and affiliate links directly to your bio page.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100/70"
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Use your own custom domain for your bio page to build brand recognition and trust.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100/70"
  }
];

export default function Features() {
  return (
    <section className="bg-slate-50/50 py-18 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-pink-500/20 bg-pink-500/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-pink-750">
            Features
          </div>
          <h2 className="mb-5 text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            One bio, endless possibilities
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 leading-relaxed font-medium">
            Everything you need to create a stunning bio page that grows with you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-slate-355 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100/50"
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${feature.border} ${feature.bg}`}
              >
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-850">
                {feature.title}
              </h3>
              <p className="mb-5 text-sm text-slate-500 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
