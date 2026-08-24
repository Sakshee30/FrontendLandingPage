import {
  Webhook,
  Shield,
  RefreshCw,
  Filter,
  Code2,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Webhook,
    title: "Multiple Events",
    description: "Listen for clicks, scans, creations, updates, and many more events as they happen.",
    color: "from-purple-500 to-teal-600",
    bg: "bg-purple-500/10",
    border: "border-purple-500/25",
    hoverBorder: "hover:border-purple-500/40",
  },
  {
    icon: Shield,
    title: "Secure Signatures",
    description: "Verify webhook authenticity with HMAC signatures to ensure requests come from Ziplin.",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    hoverBorder: "hover:border-blue-500/40",
  },
  {
    icon: RefreshCw,
    title: "Automatic Retries",
    description: "Failed webhooks are automatically retried with exponential backoff for reliability.",
    color: "from-purple-500 to-pink-600",
    bg: "bg-purple-500/10",
    border: "border-purple-500/25",
    hoverBorder: "hover:border-purple-500/40",
  },
  {
    icon: Filter,
    title: "Event Filtering",
    description: "Subscribe only to the events you care about to keep your integration clean and efficient.",
    color: "from-orange-500 to-amber-600",
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    hoverBorder: "hover:border-orange-500/40",
  },
  {
    icon: Code2,
    title: "Rich Payloads",
    description: "Detailed event payloads include all relevant data for clicks, links, QR codes, and more.",
    color: "from-cyan-500 to-teal-600",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/25",
    hoverBorder: "hover:border-cyan-500/40",
  },
  {
    icon: Shield,
    title: "Webhook Logs",
    description: "Full audit trail of all webhook deliveries, failures, and retries for debugging.",
    color: "from-red-500 to-rose-600",
    bg: "bg-red-500/10",
    border: "border-red-500/25",
    hoverBorder: "hover:border-red-500/40",
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
            Powerful webhook
            <br />
            integrations
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 leading-relaxed">
            Everything you need to build reliable integrations with Ziplin.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-200 hover:shadow-lg ${feature.hoverBorder}`}
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
