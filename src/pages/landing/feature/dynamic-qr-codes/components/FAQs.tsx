import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is a dynamic QR code?",
    answer: "A dynamic QR code contains a short URL that redirects to your actual content. This means you can update the destination at any time without reprinting the QR code, and track scan analytics."
  },
  {
    question: "Can I change the QR code destination after printing?",
    answer: "Yes! That's the biggest advantage of dynamic QR codes. You can log into your dashboard and change where your QR code points to at any time, even after it's been printed or distributed."
  },
  {
    question: "What file formats can I download?",
    answer: "You can download your QR codes in high-quality formats including PNG, SVG, PDF, and EPS. This ensures your QR codes look perfect at any size, from business cards to billboards."
  },
  {
    question: "What kind of analytics do you provide?",
    answer: "We provide detailed analytics including total scans, unique visitors, scan locations, device types, operating systems, browsers, and time-of-day data for each QR code."
  },
  {
    question: "Do you offer a free plan?",
    answer: "Yes! We offer a free plan that includes basic dynamic QR codes and limited analytics. Upgrade to one of our paid plans for advanced features like custom domains and white-labeling."
  },
  {
    question: "Is there a limit to how many times I can update my QR codes?",
    answer: "No, there's no limit! You can update your QR codes as often as you'd like. Whether you're changing a weekly promotion or a daily menu, it's all included in your plan."
  }
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-18 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-emerald-500/20 bg-emerald-500/5 px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-emerald-750">
            FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            Everything you need to know about Ziplin's dynamic QR codes.
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
                  <ChevronUp className="w-5 h-5 text-emerald-650 flex-shrink-0" />
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