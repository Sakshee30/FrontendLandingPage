import { HelpCircle, FileText } from "lucide-react";

const popularArticles = [
  { title: "How to connect a custom brand domain", category: "Account & Settings", readTime: "4 min read" },
  { title: "Installing Meta conversion pixels on short links", category: "Link Management", readTime: "3 min read" },
  { title: "Understanding dynamic redirection rules by location", category: "UTM Campaigns", readTime: "5 min read" },
  { title: "Formatting dynamic QR codes for print marketing", category: "Dynamic QR Codes", readTime: "4 min read" }
];

export function PopularArticles() {
  return (
    <section className="pb-20 px-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-xl shadow-slate-150/40">
        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-violet-600" />
          Popular Articles
        </h3>

        <div className="divide-y divide-slate-100">
          {popularArticles.map((article, index) => (
            <div
              key={index}
              className="py-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group/article cursor-pointer first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 text-left">
                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-800 group-hover/article:text-violet-650 transition-colors">
                  {article.title}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 self-end sm:self-auto">
                <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100">{article.category}</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
