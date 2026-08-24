import {
  Link2,
  User,
  QrCode,
  Target,
  Webhook,
  Settings,
  ArrowRight
} from "lucide-react";

const categories = [
  {
    icon: Link2,
    title: "Link Management",
    description: "Learn how to shorten links, customize social sharing tags, configure alias slugs, and set expiration limits.",
    articles: "14 articles",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100"
  },
  {
    icon: User,
    title: "Smart Bio Pages",
    description: "Deploy and optimize mobile landing directories. Customize avatars, social tags, and grid links.",
    articles: "8 articles",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100"
  },
  {
    icon: QrCode,
    title: "Dynamic QR Codes",
    description: "Generate dynamic scalable vector QR codes. Learn how to update destinations and embed logo shapes.",
    articles: "10 articles",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100"
  },
  {
    icon: Target,
    title: "UTM Campaigns",
    description: "Organize traffic streams into UTM campaign tags, set device OS mappings, and analyze referrer stats.",
    articles: "9 articles",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100"
  },
  {
    icon: Webhook,
    title: "Webhooks & API",
    description: "Connect Ziplin to your workflow. Set up real-time post requests and parse payload logs.",
    articles: "12 articles",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100"
  },
  {
    icon: Settings,
    title: "Account & Settings",
    description: "Manage subscription plans, billing details, configure custom domains, and seat roles.",
    articles: "6 articles",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100"
  }
];

export function Categories() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">
          Browse by category
        </h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          Select a topic to explore detailed guides and platform specs.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 hover:shadow-xl hover:shadow-slate-100/60 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="text-left">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${category.border} ${category.bg} ${category.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6">
                  {category.description}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-400">
                <span>{category.articles}</span>
                <span className="flex items-center gap-1 text-violet-650 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer">
                  View articles
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
