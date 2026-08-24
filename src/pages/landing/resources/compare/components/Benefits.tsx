import { Globe, Zap, Code2 } from "lucide-react";
import { CompetitorData } from "../alternativesData";

const iconMap: Record<string, any> = {
  Globe: Globe,
  Zap: Zap,
  Code2: Code2
};

interface BenefitsProps {
  data: CompetitorData;
}

export default function Benefits({ data }: BenefitsProps) {
  return (
    <div className="max-w-7xl mx-auto mb-20">
      <div className="text-center mb-14">
        <h2 className="text-3xl font-black text-slate-900">Built for modern marketing teams</h2>
        <p className="text-sm text-slate-500 mt-2 font-medium">Why switching to Ziplin unlocks new campaign growth opportunities</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {data.benefits.map((benefit, i) => {
          const Icon = iconMap[benefit.iconName] || Globe;
          return (
            <div key={i} className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300 text-left">
              <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border ${benefit.border} ${benefit.bg} ${benefit.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{benefit.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

