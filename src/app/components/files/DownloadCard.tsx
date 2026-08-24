interface Props {
    description: string;
    password: string;
    downloadLimit: string;
    subscribeGate: boolean;
    status: string;
    setDescription: (description: string) => void;
    setPassword: (password: string) => void;
    setDownloadLimit: (downloadLimit: string) => void;
    setSubscribeGate: (subscribeGate: boolean) => void;
    setStatus: (status: string) => void;
}

export default function DownloadCard({ description, password, downloadLimit, subscribeGate, status, setDescription, setPassword, setDownloadLimit, setSubscribeGate }: Props) {
    return (
        <>
            <section className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4 m-0">Download page settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_160px_140px] gap-3 items-end">
                    <label className="grid gap-1.5 text-xs font-semibold text-slate-500">
                        Description
                        <input
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="What visitors see before downloading"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
                        />
                    </label>
                    <label className="grid gap-1.5 text-xs font-semibold text-slate-500">
                        Password
                        <input
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Optional"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
                        />
                    </label>
                    <label className="grid gap-1.5 text-xs font-semibold text-slate-500">
                        Download limit
                        <input
                            value={downloadLimit}
                            onChange={(event) => setDownloadLimit(event.target.value)}
                            placeholder="0 unlimited"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
                        />
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 h-[38px] mb-0.5 mt-0 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={subscribeGate}
                            onChange={(event) => setSubscribeGate(event.target.checked)}
                            className="accent-blue-650"
                        />
                        Subscribe gate
                    </label>
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