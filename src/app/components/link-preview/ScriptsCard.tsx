import { Copy, Trash2 } from "lucide-react";
import { LinkPreviewSite } from "../../services/linkPreviews";

interface Props {
    sites: LinkPreviewSite[]
    scriptFor: (site: LinkPreviewSite) => string
    remove: (id: string) => void
}
export default function ScriptsCard({ sites, scriptFor, remove }: Props) {
    return (
        <>
            <section className="bg-white border border-slate-200 rounded-xl p-5 mt-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4 m-0">Install scripts</h2>
                {!sites.length ? (
                    <p className="text-sm text-slate-400 font-medium py-2 m-0">
                        No websites registered yet.
                    </p>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {sites.map((site) => (
                            <div key={site.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                                <strong className="w-[180px] text-sm font-semibold text-slate-800 truncate">
                                    {site.domain}
                                </strong>
                                <code className="flex-1 bg-slate-50 border border-slate-100/50 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 truncate leading-none">
                                    {scriptFor(site)}
                                </code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(scriptFor(site))}
                                    className="bg-transparent border-none cursor-pointer text-blue-600 hover:text-blue-700 p-1.5 focus:outline-none transition-colors rounded-lg"
                                >
                                    <Copy size={15} />
                                </button>
                                <button
                                    onClick={() => remove(site.id)}
                                    className="bg-transparent border-none cursor-pointer text-red-500 hover:text-red-650 p-1.5 focus:outline-none transition-colors rounded-lg"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    )
}