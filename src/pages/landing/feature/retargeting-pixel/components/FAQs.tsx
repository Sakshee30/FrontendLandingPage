import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is link retargeting?",
    answer: "Link retargeting allows you to add retargeting pixels (such as Meta Pixel or Google Analytics) to your short links. When a visitor clicks the link, they are automatically added to your custom advertising audience list, allowing you to show them ads later, even if the destination page points to a third-party site you don't own."
  },
  {
    question: "Does it slow down the link redirection?",
    answer: "No, not at all! Ziplin executes retargeting pixels asynchronously in the background. The visitor is routed to the destination URL instantly, while pixel tags fire behind the scenes in under 20ms with no delay to the user experience."
  },
  {
    question: "Can I attach multiple pixels to a single short link?",
    answer: "Yes, absolutely! You can attach multiple pixel configurations (e.g. Meta, Google Analytics 4, and LinkedIn Insight Tag simultaneously) to a single short link, allowing you to capture audiences across different marketing channels simultaneously."
  },
  {
    question: "Do I need access to the destination website's code?",
    answer: "No! This is the primary benefit of link retargeting. You can target audiences clicking links that point to Amazon products, YouTube videos, medium articles, or news publications, and build custom lists without having to embed code on the final site."
  },
  {
    question: "Is this GDPR and CCPA compliant?",
    answer: "Yes, Ziplin includes built-in configurations to respect 'Do Not Track' headers, configure user cookie consent prompts, and support platform-specific data privacy guidelines to ensure compliance."
  }
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-32 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-indigo-500/20 bg-indigo-500/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-indigo-750">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-650 font-medium">
            Everything you need to know about Ziplin's retargeting pixels.
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
                  <ChevronUp className="w-5 h-5 text-indigo-650 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-7 pb-6 text-left">
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
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
export default FAQs;