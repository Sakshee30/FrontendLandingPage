import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What are UTM parameters?",
    answer: "UTM parameters are tags added to the end of URLs that help track where traffic comes from. The main ones are utm_source, utm_medium, utm_campaign, utm_term, and utm_content.",
  },
  {
    question: "Can I create UTM presets for my team?",
    answer: "Absolutely! You can create and share UTM templates with your team to ensure consistent naming conventions across all your links.",
  },
  {
    question: "Can I import existing links with UTM parameters?",
    answer: "Yes! You can import links in bulk using our CSV import feature, and we'll preserve all existing UTM parameters.",
  },
  {
    question: "Can I see which UTM combinations convert best?",
    answer: "Yes! You can filter analytics by any combination of UTM parameters to find your highest-converting traffic sources.",
  },
  {
    question: "Do you support UTM parameters with QR codes and bio pages?",
    answer: "Definitely! All our products (short links, QR codes, and bio pages) support full UTM tracking.",
  },
  {
    question: "Can I export UTM data to Google Analytics?",
    answer: "Yes! You can export reports, or use our direct integration to send data to Google Analytics and other platforms.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-18 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-cyan-500/25 bg-cyan-500/10 px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-cyan-700">
            FAQs
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about UTM tracking in Ziplin.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden"
            >
              <button
                className="w-full px-7 py-6 text-left flex items-center justify-between gap-4"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-base md:text-lg font-semibold text-slate-800">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-6 h-6 text-cyan-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-500 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-7 pb-6">
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">
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
