import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CompetitorData } from "../alternativesData";

interface FAQsProps {
  data: CompetitorData;
}

export default function FAQs({ data }: FAQsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto mb-20 text-left">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-900">Migration FAQ</h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">Common questions about moving your links to Ziplin</p>
      </div>

      <div className="space-y-4">
        {data.faqs.map((faq, index) => (
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
              <div className="px-7 pb-6">
                <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

