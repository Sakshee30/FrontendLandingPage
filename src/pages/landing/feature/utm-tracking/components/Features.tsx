import {
  ArrowRightLeft,
  Bookmark,
  BarChart3,
  Filter,
  Shield,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Bookmark,
    title: "UTM Presets",
    description: "Create reusable UTM templates to ensure consistent naming across your team and campaigns.",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    hoverBorder: "hover:border-blue-500/40",
  },
  {
    icon: Filter,
    title: "Smart Filtering",
    description: "Slice and dice your analytics by any UTM parameter to uncover insights about traffic sources.",
    color: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/25",
    hoverBorder: "hover:border-indigo-500/40",
  },
  {
    icon: BarChart3,
    title: "Source Attribution",
    description: "See exactly which campaigns, sources, and mediums are driving the most traffic and conversions.",
    color: "from-cyan-500 to-teal-600",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
    hoverBorder: "hover:border-cyan-500/40",
  },
  {
    icon: Shield,
    title: "Enforce Standards",
    description: "Prevent typos and inconsistent naming with validation rules for UTM parameters.",
    color: "from-pink-500 to-rose-600",
    bg: "bg-pink-500/10",
    border: "border-pink-500/25",
    hoverBorder: "hover:border-pink-500/40",
  },
  {
    icon: ArrowRightLeft,
    title: "Bulk Builder",
    description: "Create multiple UTM-tagged links at once using our bulk creator or CSV import.",
    color: "from-orange-500 to-amber-600",
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    hoverBorder: "hover:border-orange-500/40",
  },
  {
    icon: Filter,
    title: "UTM Explorer",
    description: "Explore all your UTM combinations in one place and see how each performs over time.",
    color: "from-green-500 to-emerald-600",
    bg: "bg-green-500/10",
    border: "border-green-500/25",
    hoverBorder: "hover:border-green-500/40",
  },
];

export default function Features() {
  return (
    <section className="bg-slate-50 py-18 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-indigo-500/25 bg-indigo-500/10 px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-indigo-700">
            Features
          </div>
          <h2 className="mb-5 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Everything you need for
            <br />
            perfect UTM tracking
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 leading-relaxed">
            From presets to analysis, Ziplin has all the tools to make UTM management a breeze.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-200 }`}
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${feature.border} ${feature.bg}`}
              >
                <feature.icon className={`h-7 w-7 bg-gradient-to-r ${feature.color} bg-clip-text text-black`} />
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="mb-5 text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
