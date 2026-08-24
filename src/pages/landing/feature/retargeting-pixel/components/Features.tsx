import {
  Target,
  Layers,
  Activity,
  Zap,
  Tag,
  MessageCircle,
  Heart,
  Image,
  ArrowRight
} from "lucide-react";

const providers = [
  {
    icon: Target,
    title: "Meta Pixel",
    description: "Re-engage Facebook and Instagram users with tracking events like PageView, Lead, or Purchase.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100/70"
  },
  {
    icon: Layers,
    title: "Google Tag Manager",
    description: "Connect your GTM containers directly and manage multiple tags without manual code deployments.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100/70"
  },
  {
    icon: Activity,
    title: "LinkedIn Insight Tag",
    description: "Build high-value professional audiences and target decision-makers based on link click intent.",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-100/70"
  },
  {
    icon: Zap,
    title: "TikTok Pixel",
    description: "Track conversions and tap into custom audiences on the fastest-growing social video platform.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100/70"
  },
  {
    icon: Tag,
    title: "Google Ads",
    description: "Optimize search and display campaign budgets by targeting warm leads who click your shared links.",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-100/70"
  },
  {
    icon: Heart,
    title: "Pinterest Tag",
    description: "Reach visual shoppers and pinners by sending audience conversion signals from click referrals.",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100/70"
  },
  {
    icon: MessageCircle,
    title: "Twitter/X Ads Pixel",
    description: "Retarget conversation drivers and custom audiences across mobile and desktop feeds on X.",
    color: "text-slate-800",
    bg: "bg-slate-50",
    border: "border-slate-200"
  },
  {
    icon: Image,
    title: "Custom Image Pixel",
    description: "Insert generic conversion tracking pixels or custom fallback image tags for any other analytics suite.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100/70"
  }
];

const Features = () => {
  return (
    <section className="bg-slate-50/50 py-18 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-indigo-750">
            Platforms
          </div>
          <h2 className="mb-5 text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Supported Retargeting Platforms
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 leading-relaxed font-medium">
            Quickly attach tracking codes from all major advertising networks in one place without touching any production code.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {providers.map((provider) => (
            <div
              key={provider.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-slate-355 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100/50"
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${provider.border} ${provider.bg}`}
              >
                <provider.icon className={`h-7 w-7 ${provider.color}`} />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-850">
                {provider.title}
              </h3>
              <p className="mb-5 text-sm text-slate-500 leading-relaxed font-medium">
                {provider.description}
              </p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default Features;