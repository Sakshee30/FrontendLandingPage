import {
  Check,
  MousePointerClick,
  Zap,
  Target,
  Sparkles,
  ArrowDown
} from "lucide-react";

const Showcase = () => {
  const steps = [
    {
      title: "1. Visitor Clicks Link",
      desc: "User clicks your short link (e.g. ziplin.co/summer-deal) shared on Twitter, email, or a forum.",
      icon: MousePointerClick,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100/50"
    },
    {
      title: "2. Instant Routing",
      desc: "Ziplin redirects the visitor to the final destination page in less than 20ms, ensuring zero user lag.",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100/50"
    },
    {
      title: "3. Asynchronous Execution",
      desc: "Meta, Google, and LinkedIn pixels load in the background, registering the conversion event instantly.",
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100/50"
    },
    {
      title: "4. Target Ads Served",
      desc: "The visitor is added to your retargeting list and sees customized ads on Facebook, LinkedIn, or Google.",
      icon: Sparkles,
      color: "text-pink-600",
      bg: "bg-pink-50",
      border: "border-pink-100/50"
    }
  ];

  return (
    <section className="bg-white py-18 px-6 border-b border-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 items-center lg:grid-cols-2">
          {/* Left info column */}
          <div>
            <div className="mb-6 inline-block rounded-full border border-purple-200 bg-purple-50 px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-purple-700">
              Workflow Sequence
            </div>
            <h3 className="mb-8 text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Fire pixels in milliseconds, zero latency
            </h3>
            <p className="mb-10 text-lg text-slate-650 leading-relaxed">
              When a user clicks your Ziplin short link, our high-speed edge redirects load the retargeting pixels asynchronously in the background. Your visitors get redirected instantly to the destination page while tracking events fire in under 20ms.
            </p>
            <div className="space-y-4">
              {[
                "Asynchronous pixel loading (zero redirect delay)",
                "Edge network latency protection",
                "Multiple platform triggers per single click",
                "Built-in compliance headers and cookie consent templates"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-purple-650">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual sequence column */}
          <div className="relative">

            <div className="relative space-y-6 max-w-md mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow transition-shadow flex items-start gap-4 z-10 relative">
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${step.border} ${step.bg}`}>
                      <step.icon className={`w-5 h-5 ${step.color}`} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-extrabold text-slate-900">{step.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {/* Arrow connector between steps */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-2 text-slate-300">
                      <ArrowDown className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Showcase;