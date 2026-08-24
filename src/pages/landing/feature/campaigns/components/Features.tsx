import {
  Layers,
  Calendar,
  Users,
  BarChart3,
  Link2,
  Shield,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Organize by Campaigns",
    description: "Group all your links, QR codes, and bio pages into logical campaigns for easy management.",
    color: "from-purple-500 to-pink-600",
    bg: "bg-purple-500/10",
    border: "border-purple-500/25",
    hoverBorder: "hover:border-purple-500/40",
  },
  {
    icon: Calendar,
    title: "Schedule & Automate",
    description: "Plan your link changes ahead of time and schedule updates to go live automatically.",
    color: "from-indigo-500 to-blue-600",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/25",
    hoverBorder: "hover:border-indigo-500/40",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Invite teammates to collaborate on campaigns, assign roles, and share insights.",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    hoverBorder: "hover:border-emerald-500/40",
  },
  {
    icon: BarChart3,
    title: "Roll-up Analytics",
    description: "View combined analytics across all links in a campaign to see overall performance.",
    color: "from-orange-500 to-amber-600",
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    hoverBorder: "hover:border-orange-500/40",
  },
  {
    icon: Link2,
    title: "Smart UTMs",
    description: "Auto-append consistent UTM parameters to all links in a campaign for perfect tracking.",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-500/10",
    border: "border-purple-500/25",
    hoverBorder: "hover:border-purple-500/40",
  },
  {
    icon: Shield,
    title: "Access Controls",
    description: "Fine-grained permissions to ensure only the right team members can edit campaigns.",
    color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    hoverBorder: "hover:border-blue-500/40",
  },
];

export default function Features() {
  return (
    <section className="bg-slate-50 py-18 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-purple-700">
            Features
          </div>
          <h2 className="mb-5 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Everything you need for
            <br />
            powerful campaign management
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 leading-relaxed">
            From planning to optimization, Ziplin has all the tools to make your campaigns a success.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-200 hover:shadow-lg`}
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
