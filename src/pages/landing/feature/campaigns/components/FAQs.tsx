import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What's a campaign in Ziplin?",
    answer: "A campaign is a way to group related links, QR codes, and bio pages together. You can view combined analytics, set consistent UTM parameters, and manage everything from one place.",
  },
  {
    question: "Can I schedule changes to links in a campaign?",
    answer: "Yes! You can schedule updates to all links in a campaign, or individual links. Changes will automatically go live at your specified time.",
  },
  {
    question: "Can multiple team members work on the same campaign?",
    answer: "Absolutely! You can invite team members and assign permissions to control who can view and edit each campaign.",
  },
  {
    question: "What kind of reports can I get for campaigns?",
    answer: "You can see roll-up reports for all links in a campaign, compare performance across multiple campaigns, and export data to CSV or PDF.",
  },
  {
    question: "Is there a limit to how many campaigns I can create?",
    answer: "It depends on your plan! Free plans include up to 5 campaigns, while Pro and Enterprise plans include unlimited campaigns.",
  },
  {
    question: "Can I duplicate a campaign?",
    answer: "Yes! You can duplicate any campaign to quickly create new ones with similar settings, links, and configurations.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-32 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-blue-500/25 bg-blue-500/10 px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
            FAQs
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about campaign management in Ziplin.
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
                  <ChevronUp className="w-6 h-6 text-blue-600 flex-shrink-0" />
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
