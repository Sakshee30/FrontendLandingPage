
interface Props {
    domain: string;
    placement: string;
    status: string;
    setDomain: (domain: string) => void;
    setPlacement: (placement: string) => void;
    addSite: () => void;
}

export default function RegistarCard({
    domain,
    placement,
    status,
    setDomain,
    setPlacement,
    addSite
}: Props) {
    return (
        <>
            <section className="bg-white border border-slate-200 rounded-xl p-5 mt-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4 m-0">Register website</h2>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_auto] gap-3 items-center">
                    <input
                        value={domain}
                        onChange={(event) => setDomain(event.target.value)}
                        placeholder="example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
                    />
                    <select
                        value={placement}
                        onChange={(event) => setPlacement(event.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
                    >
                        <option value="bottom-right">Bottom right</option>
                        <option value="bottom-center">Bottom center</option>
                        <option value="top-right">Top right</option>
                    </select>
                    <button
                        onClick={addSite}
                        className="px-5 py-2.5 rounded-md border-none bg-[#081C45] text-white font-bold text-sm cursor-pointer transition-colors shadow-sm focus:outline-none"
                    >
                        Generate script
                    </button>
                </div>
                {status && (
                    <p className="text-sm text-slate-500 mt-3 m-0">
                        {status}
                    </p>
                )}
            </section>
        </>
    )
}
