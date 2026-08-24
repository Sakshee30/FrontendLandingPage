import { FileSpreadsheet, Settings, Globe } from "lucide-react";
import { CompetitorData } from "../alternativesData";

const iconMap: Record<string, any> = {
  FileSpreadsheet: FileSpreadsheet,
  Settings: Settings,
  Globe: Globe
};

interface MigrationProps {
  data: CompetitorData;
}

export default function Migration({ data }: MigrationProps) {
  return (
    <div className="max-w-7xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm text-left mb-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/[0.03] via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-xl mb-12">
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Migrate seamlessly in 3 steps</h3>
        <p className="text-sm text-slate-650 font-medium leading-relaxed">
          Moving your active short links and custom domains from {data.name} to Ziplin is simple, secure, and preserves your traffic redirections.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {data.migration.map((step, idx) => {
          const Icon = iconMap[step.iconName] || Globe;
          return (
            <div key={idx} className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-5">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-2">{step.step}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

