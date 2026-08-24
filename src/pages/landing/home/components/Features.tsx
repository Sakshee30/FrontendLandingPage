import {
  Zap,
  Smartphone,
  CreditCard,
  BarChart3,
  Target,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    hoverBorder: "hover:border-violet-500/40",
    title: "URL Shortener",
    desc: "Create branded short links in one click. Add custom slugs, expiry dates, and password protection.",
  },
  {
    icon: Smartphone,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    hoverBorder: "hover:border-blue-500/40",
    title: "Dynamic QR Codes",
    desc: "Generate scannable QR codes for any link. Update the destination anytime without reprinting.",
  },
  {
    icon: CreditCard,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    hoverBorder: "hover:border-emerald-500/40",
    title: "Bio Pages",
    desc: "Build stunning link-in-bio pages in minutes. Perfect for creators, brands, and portfolios.",
  },
  {
    icon: BarChart3,
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    hoverBorder: "hover:border-amber-500/40",
    title: "Deep Analytics",
    desc: "See who clicks, where they're from, what device they use, and when — with real-time dashboards.",
  },
  {
    icon: Target,
    color: "from-red-500 to-rose-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    hoverBorder: "hover:border-red-500/40",
    title: "Campaign Tracking",
    desc: "Auto-append UTM parameters and measure every campaign's performance from one place.",
  },
  {
    icon: Lock,
    color: "from-purple-500 to-violet-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    hoverBorder: "hover:border-purple-500/40",
    title: "Custom Domains",
    desc: "Use your own branded domain for all your short links to build trust and recognition.",
  },
];

const Features = () => {
  return (
    <section className="bg-white py-18 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-5 inline-block rounded-full border border-violet-500/25 bg-violet-500/10 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-violet-700">
            Features
          </div>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Everything you need to
            <br />
            manage links at scale
          </h2>
          <p className="mx-auto max-w-xl text-base text-slate-600 leading-relaxed">
            One platform. All the link tools your team will ever need.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group rounded-3xl border border-slate-100 bg-gray-50 p-8 transition-all duration-200`}
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border ${f.border} ${f.bg}`}
              >
                <f.icon className={`h-7 w-7 bg-gradient-to-r ${f.color} bg-clip-text text-black`} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">
                {f.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;