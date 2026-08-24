import {
  Check,
  Palette,
  BarChart3,
  ShoppingBag
} from "lucide-react";

const benefits = [
  {
    title: "Make your brand unforgettable",
    description: "Build a fully customizable link in bio or full website to promote your links, products, email list, and all social platforms—in minutes.",
    icon: Palette
  },
  {
    title: "Screw the algorithm & market direct",
    description: "Stop renting your audience—own it. Build a subscriber list, send emails, and turn followers into fans.",
    icon: BarChart3
  },
  {
    title: "Sell your own products & services",
    description: "Sell digital products, courses, appointments, and link to affiliates right from your link in bio.",
    icon: ShoppingBag
  }
];

export default function Showcase() {
  return (
    <section className="bg-white py-18 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 items-center lg:grid-cols-2 mb-28">
          <div>
            <div className="mb-6 inline-block rounded-full border border-purple-500/20 bg-purple-500/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-purple-750">
              Bio Page Builder
            </div>
            <h3 className="mb-6 text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Easy to use, powerful results
            </h3>
            <p className="mb-8 text-base text-slate-600 leading-relaxed font-medium">
              Creating a beautiful bio page takes seconds. Use our simple drag-and-drop editor to effortlessly manage your content and customize your design.
            </p>
            <div className="space-y-4">
              {[
                "Drag & drop link management",
                "100+ pre-built templates",
                "Advanced analytics & insights",
                "Custom domains & branding"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-purple-150 bg-purple-50 text-purple-600 shadow-sm">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold text-slate-650">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)]">
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-purple-500 flex items-center justify-center text-3xl font-black text-white shadow-md shadow-purple-500/20">
                  CJ
                </div>
                <h3 className="text-lg font-extrabold text-slate-850">Chloe Johnson</h3>
                <p className="text-xs font-semibold text-slate-450 mt-1">Content Creator & Designer</p>
              </div>
              <div className="space-y-3">
                {["✨ New Portfolio Update", "🎨 Design Services", "📺 YouTube Channel", "📧 Newsletter"].map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-white border border-slate-100 p-4 text-center"
                  >
                    <span className="text-sm font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center gap-3">
                {["Instagram", "TikTok", "Twitter", "LinkedIn"].map((item, index) => (
                  <div key={index} className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-sm">
                    <span className="text-xs font-bold">{item.charAt(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-pink-100 bg-pink-50 text-pink-650">
                <benefit.icon className="w-7 h-7" />
              </div>
              <h4 className="mb-3 text-lg font-bold text-slate-850">
                {benefit.title}
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
