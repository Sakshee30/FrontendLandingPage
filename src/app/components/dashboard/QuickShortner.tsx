import { useState } from "react";
import { Copy, Link2, Zap } from "lucide-react";
import { createPublicShortLink, ZiplinLink } from "../../services/links";

export function QuickShortener({
    onCreated,
}: {
    onCreated: () => void;
}) {
    const [url, setUrl] = useState("");
    const [link, setLink] = useState<ZiplinLink | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    async function handleShorten(e: React.FormEvent) {
        e.preventDefault();

        setError("");
        setCopied(false);
        setLoading(true);

        try {
            const created = await createPublicShortLink(url);
            setLink(created);
            setUrl("");
            onCreated();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Could not shorten this link"
            );
        } finally {
            setLoading(false);
        }
    }

    async function copy() {
        if (!link?.shortUrl) return;

        await navigator.clipboard.writeText(link.shortUrl);

        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
    }

    return (
        <div className="mb-5 grid gap-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-[#FFF6CC] to-[#EEF4FF] p-5 lg:grid-cols-[220px_1fr] lg:items-center lg:gap-8">
            <div>
                <span className="mb-3 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <Zap size={10} />
                    Free feature
                </span>
                <div className="mb-2 flex items-center gap-2">
                    <Link2 size={16} className="text-primary" />
                    <span className="text-base font-bold text-slate-900">
                        Quick Shortener
                    </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                    Paste any URL to create a tracked short link instantly.
                </p>
            </div>
            <div>
                <form
                    onSubmit={handleShorten}
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm sm:flex-row"
                >
                    <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        type="url"
                        required
                        placeholder="https://example.com/your-very-long-url-here"
                        className="flex-1 rounded-lg border-0 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-all whitespace-nowrap
              ${loading
                                ? "cursor-not-allowed bg-slate-400"
                                : "bg-gradient-to-r from-[#081C45] to-[#0E2F73] shadow-lg shadow-[#081C45]/20 hover:opacity-95"
                            }`}
                    >
                        {loading ? "Shortening..." : "Shorten →"}
                    </button>
                </form>
                {error && (
                    <p className="mt-2 text-sm font-semibold text-red-600">
                        {error}
                    </p>
                )}
                {link && (
                    <div className="mt-3 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-2">
                            <span className="shrink-0 text-sm font-semibold text-emerald-700">
                                ✓ Ready:
                            </span>
                            <a
                                href={link.shortUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="break-all text-sm font-bold text-emerald-700 hover:underline"
                            >
                                {link.shortUrl}
                            </a>
                        </div>
                        <button
                            onClick={copy}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                        >
                            <Copy size={13} />
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
