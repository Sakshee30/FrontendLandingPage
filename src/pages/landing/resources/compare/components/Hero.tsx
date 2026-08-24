import { Link2 } from "lucide-react";
import { CompetitorData } from "../alternativesData";

interface HeroProps {
  data: CompetitorData;
}

export default function Hero({ data }: HeroProps) {
  return (
    <div className="text-center mb-10 max-w-4xl mx-auto">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-5 py-2 text-sm font-semibold text-indigo-700 shadow-sm">
        <Link2 className="w-4 h-4 text-indigo-600" />
        Comparison Guide
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
        Why brands choose Ziplin over
        <span className="bg-gradient-to-r from-violet-650 via-indigo-600 to-violet-550 bg-clip-text text-transparent block mt-2 font-black">
          {data.name}
        </span>
      </h1>
      <p className="text-base md:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
        {data.heroSubtitle}
      </p>
    </div>
  );
}

