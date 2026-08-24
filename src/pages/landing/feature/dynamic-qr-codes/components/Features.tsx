import {
  RefreshCw,
  Palette,
  BarChart3,
  Download,
  Shield,
  Zap,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    title: "Editable Anytime",
    description: "Change your QR code's destination URL or content at any time without reprinting the physical QR code.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100/70"
  },
  {
    icon: Palette,
    title: "Full Customization",
    description: "Design beautiful QR codes with custom colors, brand logos, shapes, frames, and call-to-action text.",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100/70"
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track every scan with detailed analytics - location, device type, time of scan, and campaign performance.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100/70"
  },
  {
    icon: Download,
    title: "High-res Downloads",
    description: "Download your QR codes in high-quality formats like PNG, SVG, PDF, and EPS for perfect printing at any size.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100/70"
  },
  {
    icon: Shield,
    title: "Security & Control",
    description: "Add password protection, expiration dates, and geofencing to control who can scan your QR codes.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100/70"
  },
  {
    icon: Zap,
    title: "Multiple Types",
    description: "Create QR codes for URLs, vCards, WiFi, menus, PDFs, social media, app downloads, and more.",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100/70"
  }
];

export default function Features() {
  return (
    <section className="bg-slate-50/50 py-18 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-750">
            Features
          </div>
          <h2 className="mb-5 text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Everything you need for smart QR campaigns
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600 leading-relaxed font-medium">
            Powerful features to help you create, customize, and track QR codes that drive real results for your business.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:border-slate-355 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-100/50"
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${feature.border} ${feature.bg}`}
              >
                <feature.icon className={`h-7 w-7 `} />
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