import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What events can I listen for with webhooks?",
    answer: "You can listen for many events including link clicks, QR scans, link creation, updates, and deletion, campaign changes, and more.",
  },
  {
    question: "How do I verify that webhooks come from Ziplin?",
    answer: "All webhooks are signed with your secret key using HMAC-SHA256. You can verify the signature to ensure authenticity.",
  },
  {
    question: "What happens if my webhook endpoint is down?",
    answer: "We automatically retry failed webhooks with exponential backoff for up to 24 hours. You can also manually retry failed deliveries from the dashboard.",
  },
  {
    question: "Is there a limit to the number of webhooks I can create?",
    answer: "Free plans include 1 webhook endpoint, while Pro and Enterprise plans include unlimited endpoints and more event types.",
  },
  {
    question: "Do you have SDKs for webhooks?",
    answer: "Yes! We provide official SDKs for Node.js, Python, Ruby, Go, and more, to make integration even easier.",
  },
  {
    question: "Can I test webhooks in development?",
    answer: "Absolutely! Use our test mode to send sample events to your development endpoint, and use tools like ngrok for local testing.",
  },
];

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-18 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-block rounded-full border border-teal-500/25 bg-teal-500/10 px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-teal-700">
            FAQs
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600">
            Everything you need to know about Ziplin webhooks.
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
                  <ChevronUp className="w-6 h-6 text-teal-600 flex-shrink-0" />
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
