import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How long does it take to create a bio page?",
    answer: "You can create a beautiful bio page in less than 2 minutes! Just sign up, choose a template, and add your links. No coding required."
  },
  {
    question: "Can I use my own custom domain?",
    answer: "Yes! On our Pro plan, you can connect your own custom domain to your bio page for a fully branded experience."
  },
  {
    question: "Do I get analytics for my links?",
    answer: "Absolutely! All plans include real-time analytics so you can track clicks, locations, devices, and more."
  },
  {
    question: "Can I sell products directly from my bio page?",
    answer: "Yes! On our paid plans, you can add digital products, courses, appointments, and affiliate links directly to your bio page."
  },
  {
    question: "Is there a free plan?",
    answer: "Yes! We offer a free plan that includes all the basic features you need to get started. You can upgrade anytime for more advanced features."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Of course! You can cancel your subscription at any time with no questions asked."
  }
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-18 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-purple-500/20 bg-purple-500/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-purple-750">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5">
            Frequently asked questions
          </h2>
          <p className="text-base text-slate-600 font-medium">
            Everything you need to know about Ziplin's smart bio pages.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow transition-shadow"
            >
              <button
                className="w-full px-7 py-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-base md:text-lg font-bold text-slate-800">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-purple-650 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-7 pb-6">
                  <p className="text-sm md:text-base text-slate-500 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
