import {
  Link2,
  ArrowRight,
  RefreshCw,
  Shield,
  Palette,
  BarChart3,
  Smartphone
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Custom Branded Domains",
    description: "Create branded links using your own domain or choose from our library to build instant brand recognition.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100/70"
  },
  {
    icon: RefreshCw,
    title: "Instant Destination Editing",
    description: "Update your link destinations at any time without breaking existing links. Same short URL, new target page.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100/70"
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track clicks, locations, devices, and referrers as they happen across every channel with one powerful dashboard.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100/70"
  },
  {
    icon: Palette,
    title: "Social Cards Customization",
    description: "Personalize social cards, titles, meta tags, and open-graph imagery for perfect previews every time.",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100/70"
  },
  {
    icon: Smartphone,
    title: "Dynamic Smart Routing",
    description: "Send mobile users to apps, desktop users to web, and route visitors by location, language, or device type.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100/70"
  },
  {
    icon: Shield,
    title: "Advanced Control & Security",
    description: "Set password protection, expiration dates, UTM automation, and stay GDPR and SOC 2 compliant.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100/70"
  }
];

export default function Features() {
  return (
    <section className="bg-slate-50/50 py-18 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-violet-500/20 bg-violet-500/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-violet-750">
            Powerful Features
          </div>
          <h2 className="mb-5 text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Everything you need to manage links at scale
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 leading-relaxed font-medium">
            From custom domains to real-time analytics, get all the tools your marketing team needs in one powerful platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <div className="flex items-center gap-2 text-sm font-bold text-violet-650 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 cursor-pointer">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
