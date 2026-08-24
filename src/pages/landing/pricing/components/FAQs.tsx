const faqs = [
  {
    q: "Can I use my own domain?",
    a: "Yes. On paid plans you can connect any custom domain for all your short links.",
  },
  {
    q: "Is there a free plan?",
    a: "The Free plan is available forever with no credit card needed.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely — no long-term contracts. Cancel at any time from your account settings.",
  },
  {
    q: "Do you offer team plans?",
    a: "Yes. Paid plans support multiple members with role-based access.",
  },
];

export default function PricingFAQs() {
  return (
    <section className="bg-white py-20 px-6 border-b border-slate-100">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight text-center mb-12">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-slate-100 border-y border-slate-100">
          {faqs.map((item) => (
            <div key={item.q} className="py-6 text-left">
              <h3 className="font-bold text-slate-800 text-base mb-2">
                {item.q}
              </h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
