import { CheckCircle2, Clipboard, ExternalLink, FolderOpen, Puzzle, Settings, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { HelpButton } from "../HelpButton";

const extensionPath = "C:\\Users\\shaik\\Downloads\\ziplin\\chrome-extension";

export function ChromeExtension() {
    const [copied, setCopied] = useState<string | null>(null);
    const apiBase = useMemo(() => `${window.location.origin}/api/v1`, []);

    async function copy(value: string, label: string) {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(label);
            window.setTimeout(() => setCopied(null), 1600);
        } catch {
            setCopied("Could not copy");
            window.setTimeout(() => setCopied(null), 1600);
        }
    }

    return (
        <main className="p-8 font-sans max-w-[1600px]">
            <section className="bg-gradient-to-br from-white to-[#EEF7F1] border border-[#D9E2EC] rounded-[20px] p-[28px] flex flex-col md:flex-row justify-between gap-6 mb-[22px]">
                <div>
                    <div className="inline-flex items-center gap-2 text-[#0F6B4F] text-[13px] font-black mb-[10px]"><Puzzle size={15} /> Browser extension</div>
                    <h1 className="text-[#1C2433] text-[30px] font-black m-0 tracking-[-0.04em]">Create Ziplin links from any webpage <HelpButton topicId="extension" label="Chrome Extension" /></h1>
                    <p className="text-[#516581] text-[15px] leading-[1.6] mt-[10px] max-w-[650px]">
                        Install the local Chrome/Brave extension, open any tab, and create a tracked short link without coming back to the dashboard.
                    </p>
                </div>
                <div className="min-w-[260px] bg-white border border-[#D9E2EC] rounded-2xl p-4 flex gap-3 items-start shadow-[0_18px_45px_rgba(28,36,51,0.08)]">
                    <CheckCircle2 size={22} className="text-[#12B76A]" />
                    <div>
                        <strong className="text-[#1C2433] font-bold">Extension package ready</strong>
                        <p className="mt-1 text-[#667085] text-[13px]">Use Load unpacked and select the folder below.</p>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px] mb-[18px]">
                <section className="bg-white border border-[#D9E2EC] rounded-[18px] p-[22px] mb-[18px]">
                    <h2 className="text-[#1C2433] text-[18px] font-black mb-[10px] flex items-center gap-2"><FolderOpen size={18} /> Install folder</h2>
                    <p className="text-[#667085] text-sm leading-[1.55] mb-3">Chrome needs this folder when you click Load unpacked.</p>
                    <code className="block bg-[#F4F7FB] border border-[#D9E2EC] rounded-xl p-[12px_14px] text-[#1C2433] text-[13px] break-all mb-3.5">{extensionPath}</code>
                    <button onClick={() => copy(extensionPath, "Extension path copied")} className="inline-flex items-center gap-2 rounded-md bg-[#0F6B4F] text-white py-[11px] px-4 font-black cursor-pointer hover:bg-[#0d5c44] active:scale-[0.98] transition-all"><Clipboard size={16} /> Copy folder path</button>
                </section>

                <section className="bg-white border border-[#D9E2EC] rounded-[18px] p-[22px] mb-[18px]">
                    <h2 className="text-[#1C2433] text-[18px] font-black mb-[10px] flex items-center gap-2"><Settings size={18} /> API base</h2>
                    <p className="text-[#667085] text-sm leading-[1.55] mb-3">The extension uses this endpoint to create links in the running app.</p>
                    <code className="block bg-[#F4F7FB] border border-[#D9E2EC] rounded-xl p-[12px_14px] text-[#1C2433] text-[13px] break-all mb-3.5">{apiBase}</code>
                    <button onClick={() => copy(apiBase, "API base copied")} className="inline-flex items-center gap-2 rounded-md bg-[#081C45] text-white py-[11px] px-4 font-black cursor-pointer active:scale-[0.98] transition-all"><Clipboard size={16} /> Copy API base</button>
                </section>
            </div>

            <section className="bg-white border border-[#D9E2EC] rounded-[18px] p-[22px] mb-[18px]">
                <h2 className="text-[#1C2433] text-[18px] font-black mb-[10px] flex items-center gap-2"><Zap size={18} /> Setup steps</h2>
                <div className="grid gap-2.5">
                    {[
                        "Open Chrome or Brave and go to chrome://extensions.",
                        "Turn on Developer mode in the top-right corner.",
                        "Click Load unpacked.",
                        `Select ${extensionPath}.`,
                        "Open any website, click the Ziplin extension icon, review the auto-filled fields, and create the smart link.",
                    ].map((step, index) => (
                        <div key={step} className="flex gap-3 items-center text-[#1C2433] text-sm py-2.5 border-b border-[#EEF2F6] last:border-b-0">
                            <span className="w-[26px] h-[26px] rounded-full bg-[#EEF7F1] text-[#0F6B4F] grid place-items-center font-black shrink-0">{index + 1}</span>
                            <span>{step}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-white border border-[#D9E2EC] rounded-[18px] p-[22px] mb-[18px]">
                <h2 className="text-[#1C2433] text-[18px] font-black mb-[10px] flex items-center gap-2"><ExternalLink size={18} /> What it can do</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                        "Auto-detect current tab URL",
                        "Auto-fill title and notes",
                        "Add folder, campaign, and tags",
                        "Use current login session or API key",
                        "Create a short link instantly",
                        "Copy the new short link automatically",
                    ].map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-[#1C2433] text-sm bg-[#F8FAFC] border border-[#E5EAF1] rounded-xl p-3"><CheckCircle2 size={16} className="text-[#12B76A]" /> {feature}</div>
                    ))}
                </div>
            </section>

            {copied && <div className="fixed right-6 bottom-6 bg-[#0F6B4F] text-white rounded-xl py-3 px-4 font-black shadow-[0_16px_40px_rgba(15,107,79,0.28)] z-[100]">{copied}</div>}
        </main>
    );
}

