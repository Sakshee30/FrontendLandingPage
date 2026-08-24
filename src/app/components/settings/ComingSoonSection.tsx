import { Globe } from "lucide-react";

interface Tab {
    key: string;
    label: string;
    desc: string;
}

export function ComingSoonSection({ tab }: { tab: Tab }) {
    return (
        <div className="bg-white border border-[#D9E2EC] rounded-xl p-9 text-center max-w-2xl mx-auto shadow-sm">
            <Globe className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h2 className="text-[#1C2433] text-xl font-bold mb-2">{tab.label}</h2>
            <p className="text-[#667085] text-sm leading-relaxed mb-5 max-w-md mx-auto">{tab.desc}</p>
            <button
                onClick={() => alert(`${tab.label} is queued after settings storage.`)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#081C45] text-white font-bold text-sm cursor-pointer active:scale-[0.98] transition-all shadow-sm"
            >
                Configure {tab.label}
            </button>
        </div>
    );
}

