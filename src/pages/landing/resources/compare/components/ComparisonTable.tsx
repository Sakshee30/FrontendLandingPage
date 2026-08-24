import { Check, X } from "lucide-react";
import { CompetitorData } from "../alternativesData";

interface ComparisonTableProps {
  data: CompetitorData;
}

export default function ComparisonTable({ data }: ComparisonTableProps) {
  return (
    <div className="max-w-7xl mx-auto bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xl shadow-slate-100/50 mb-20 text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th className="py-6 px-8 w-[40%]">Feature</th>
              <th className="py-6 px-6 bg-indigo-500/5 text-indigo-700 border-x border-indigo-100/50 w-[30%]">Ziplin (Alternative)</th>
              <th className="py-6 px-6 w-[30%]">{data.name}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
            {data.features.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                <td className="py-5.5 px-8 font-bold text-slate-800">{row.feature}</td>
                <td className="py-5.5 px-6 bg-indigo-500/[0.01] border-x border-indigo-100/50">
                  <div className="flex items-start gap-2.5">
                    <div className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-slate-900 font-bold leading-tight">{row.ziplin.val}</span>
                  </div>
                </td>
                <td className="py-5.5 px-6">
                  <div className="flex items-start gap-2.5">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      row.competitor.ok
                        ? "bg-emerald-50 border border-emerald-100 text-emerald-600"
                        : "bg-slate-50 border border-slate-200 text-slate-400"
                    }`}>
                      {row.competitor.ok ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                    </div>
                    <span className={`${row.competitor.ok ? "text-slate-700" : "text-slate-500"} leading-tight`}>
                      {row.competitor.val}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

