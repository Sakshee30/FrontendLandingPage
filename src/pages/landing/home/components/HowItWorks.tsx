const HowItWorks = () => {
  const steps = [
    {
      n: "01",
      title: "Create your account",
      desc: "Sign up free in under 30 seconds. No credit card, no setup fees.",
      color: "text-violet-600",
      bg: "bg-violet-500/10",
      border: "border-violet-500/25",
    },
    {
      n: "02",
      title: "Shorten your first link",
      desc: "Paste any URL, customize your slug, add a custom domain — done.",
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      border: "border-blue-500/25",
    },
    {
      n: "03",
      title: "Share & track results",
      desc: "Share across any channel and watch real-time analytics pour in.",
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/25",
    },
  ];

  return (
    <section className="bg-white py-28 px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <div className="mb-5 inline-block rounded-full border border-blue-500/25 bg-blue-500/10 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-blue-700">
            Get started
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Up and running in 60 seconds
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="rounded-3xl bg-slate-50 p-9 text-center hover:shadow-lg transition-all"
            >
              <div
                className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border ${step.border} ${step.bg}`}
              >
                <span
                  className={`text-xl font-black tracking-tight ${step.color}`}
                >
                  {step.n}
                </span>
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;