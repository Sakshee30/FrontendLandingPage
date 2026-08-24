import { useLocation, useNavigate } from "react-router";
import { alternativesData } from "./alternativesData";
import { paths } from "../../../../app/config/route.config";
import {
  Hero,
  ComparisonTable,
  Benefits,
  Migration,
  FAQs
} from "./components";
import { FinalCTA } from "../../home/components";

export default function ComparePage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Determine active competitor from URL path
  let activeKey = "switchy";
  if (pathname.includes("link-tree-alternative")) activeKey = "linktree";
  else if (pathname.includes("linko-alternative")) activeKey = "linko";
  else if (pathname.includes("rebrandly-alternative")) activeKey = "rebrandly";

  const data = alternativesData[activeKey];

  const handleSelect = (key: string) => {
    if (key === "switchy") navigate(paths.resources.switchyAlternative);
    else if (key === "linktree") navigate(paths.resources.linkTreeAlternative);
    else if (key === "linko") navigate(paths.resources.linkoAlternative);
    else if (key === "rebrandly") navigate(paths.resources.rebrandlyAlternative);
  };

  const competitors = [
    { key: "switchy", name: "Switchy" },
    { key: "linktree", name: "Linktree" },
    { key: "linko", name: "Linko" },
    { key: "rebrandly", name: "Rebrandly" },
  ];

  return (
    <main className="py-12 bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-6">
        <Hero data={data} />
        
        {/* Competitor Selector Tab-Bar */}
        <div className="flex flex-col items-center justify-center mb-16">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Compare alternatives</p>
          <div className="inline-flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/50 shadow-sm relative z-10">
            {competitors.map((comp) => {
              const isActive = activeKey === comp.key;
              return (
                <button
                  key={comp.key}
                  onClick={() => handleSelect(comp.key)}
                  className={`relative px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-white text-violet-600 shadow-md shadow-violet-600/5 border border-slate-200/40"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                  }`}
                >
                  {comp.name}
                </button>
              );
            })}
          </div>
        </div>

        <ComparisonTable data={data} />
        <Benefits data={data} />
        <Migration data={data} />
        <FAQs data={data} />
        <FinalCTA />
      </div>
    </main>
  );
}

