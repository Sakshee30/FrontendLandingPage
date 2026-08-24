import { useEffect, useState } from "react";
import { CheckCircle, Clock, Trash2, Copy, Plus, Globe } from "lucide-react";
import { createSetting, deleteSetting, listSettings, verifyDomainSetting, WorkspaceSetting } from "../../services/settings";
import { FrontendConfig, getFrontendConfig } from "../../services/config";

export function DnsSetup({ target }: { target: string }) {
    return (
        <div className="bg-white border border-[#D9E2EC] rounded-xl p-6 md:p-7 mb-5 shadow-sm">
            <h3 className="text-[#1C2433] text-base font-bold mb-1.5">DNS Setup</h3>
            <p className="text-[#667085] text-sm leading-relaxed mb-3">Create a CNAME record pointing your subdomain to Ziplin, then verify DNS.</p>
            <div className="bg-[#F4F7FB] border border-[#D9E2EC] rounded-lg p-3.5 font-mono text-[13px] text-[#1C2433] grid gap-1">
                <div><strong>Type:</strong> CNAME</div>
                <div><strong>Name:</strong> links or your chosen subdomain</div>
                <div><strong>Value:</strong> {target}</div>
            </div>
        </div>
    );
}

export function DomainSection() {
    const [domains, setDomains] = useState<WorkspaceSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newDomain, setNewDomain] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [saving, setSaving] = useState(false);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [config, setConfig] = useState<FrontendConfig | null>(null);

    async function load(silent = false) {
        if (!silent) setLoading(true);
        setError(null);
        try {
            const [items, cfg] = await Promise.all([listSettings("domain"), getFrontendConfig()]);
            setDomains(items);
            setConfig(cfg);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load domains");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function addDomain() {
        const hostname = newDomain.trim().toLowerCase().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
        if (!hostname) return;
        setSaving(true);
        setError(null);
        try {
            const setting = await createSetting("domain", {
                name: hostname,
                config: { dnsTarget: config?.customDomainCnameTarget || "li.ziplin.io" },
            });
            setDomains((prev) => [setting, ...prev]);
            setNewDomain("");
            setShowAdd(false);
            setExpanded(setting.id);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not add domain");
        } finally {
            setSaving(false);
        }
    }

    async function verifyDomain(domain: WorkspaceSetting) {
        setVerifyingId(domain.id);
        setError(null);
        try {
            const result = await verifyDomainSetting(domain.id);
            setDomains((prev) => prev.map((d) => d.id === domain.id ? result.setting : d));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Verification failed");
        } finally {
            setVerifyingId(null);
        }
    }

    async function removeDomain(id: string) {
        if (!confirm("Remove this domain?")) return;
        try {
            await deleteSetting(id);
            setDomains((prev) => prev.filter((d) => d.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
        }
    }

    const cnameTarget = config?.customDomainCnameTarget || "li.ziplin.io";

    return (
        <div className="space-y-5">
            <div className="bg-white border border-[#D9E2EC] rounded-xl p-6 md:p-7 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[#1C2433] text-xl font-bold mb-1.5">Custom Domains</h2>
                        <p className="text-[#667085] text-sm leading-relaxed">Connect your own domain so short links use your brand instead of our default domain.</p>
                    </div>
                    <button
                        onClick={() => setShowAdd((v) => !v)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#081C45] text-white font-bold text-sm cursor-pointer active:scale-[0.98] transition-all shadow-sm shrink-0"
                    >
                        <Plus size={14} /> Add domain
                    </button>
                </div>

                {showAdd && (
                    <div className="mt-5 p-4 md:p-5 bg-[#F8FAFC] rounded-lg border border-[#E3EBF6]">
                        <p className="text-sm font-semibold text-[#1C2433] mb-3">Enter your domain or subdomain</p>
                        <div className="flex gap-2.5">
                            <input
                                value={newDomain}
                                onChange={(e) => setNewDomain(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && addDomain()}
                                placeholder="links.yourbrand.com"
                                className="px-3.5 py-2.5 rounded-lg border border-[#D9E2EC] text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-[#081C45]/20 focus:border-[#081C45] flex-1"
                                autoFocus
                            />
                            <button
                                onClick={addDomain}
                                disabled={saving || !newDomain.trim()}
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-[#081C45] text-white font-bold text-sm cursor-pointer  active:scale-[0.98] transition-all disabled:opacity-65 shadow-sm"
                            >
                                {saving ? "Adding..." : "Add"}
                            </button>
                            <button
                                onClick={() => { setShowAdd(false); setNewDomain(""); }}
                                className="px-3.5 py-2.5 bg-none border-none text-[#667085] hover:text-slate-800 cursor-pointer font-bold text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-[#FEF3F2] border border-[#FDA29B] text-[#B42318] rounded-xl p-3.5 font-bold text-sm">
                    {error}
                </div>
            )}

            {loading && <div className="bg-white border border-[#D9E2EC] rounded-xl p-4.5 text-[#667085] text-sm">Loading domains...</div>}

            <div className="space-y-4">
                {domains.map((domain) => {
                    const isVerified = domain.status === "verified";
                    const isPending = domain.status === "pending";
                    const isOpen = expanded === domain.id;
                    const lastChecked = domain.config.lastCheckedAt ? new Date(domain.config.lastCheckedAt as string).toLocaleString() : null;
                    const verifyError = domain.config.lastVerificationError as string || "";
                    const token = domain.config.verificationToken as string || "";
                    const method = domain.config.verificationMethod as string || "";

                    return (
                        <div key={domain.id} className="bg-white border border-[#D9E2EC] rounded-xl shadow-sm overflow-hidden">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 p-4.5 md:p-6">
                                <Globe size={18} className={isVerified ? "text-[#12B76A]" : "text-[#F79009]"} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-sm font-bold text-[#1C2433]">{domain.name}</span>
                                        {isVerified && (
                                            <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] rounded-full px-2.5 py-0.5">
                                                <CheckCircle size={11} /> Verified {method === "txt" ? "(TXT)" : method === "cname" ? "(CNAME)" : ""}
                                            </span>
                                        )}
                                        {isPending && (
                                            <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#B45309] bg-[#FFFBEB] border border-[#FDE68A] rounded-full px-2.5 py-0.5">
                                                <Clock size={11} /> Pending verification
                                            </span>
                                        )}
                                    </div>
                                    {lastChecked && (
                                        <div className="text-xs text-[#94A3B8] mt-0.5">
                                            Last checked: {lastChecked}
                                            {verifyError && !isVerified && <span className="text-[#F04438] ml-2">· {verifyError}</span>}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 sm:self-center">
                                    <button
                                        onClick={() => verifyDomain(domain)}
                                        disabled={verifyingId === domain.id}
                                        className="text-[#081C45]  cursor-pointer font-bold text-sm disabled:opacity-65"
                                    >
                                        {verifyingId === domain.id ? "Checking..." : "Verify now"}
                                    </button>
                                    <button
                                        onClick={() => setExpanded(isOpen ? null : domain.id)}
                                        className="text-[#667085] hover:text-slate-800 cursor-pointer font-bold text-sm"
                                    >
                                        {isOpen ? "Hide setup" : "DNS setup"}
                                    </button>
                                    <button
                                        onClick={() => removeDomain(domain.id)}
                                        className="inline-flex items-center justify-center p-2 rounded-md text-[#F04438] hover:bg-[#FEF3F2] cursor-pointer active:scale-[0.98] transition-all"
                                        title="Remove domain"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>

                            {isOpen && (
                                <div className="border-t border-[#E3EBF6] bg-[#F8FAFC] p-5 md:p-6 space-y-5">
                                    {/* Step 1 — Routing */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="w-5.5 h-5.5 rounded-full bg-[#081C45] text-white font-extrabold text-[12px] flex items-center justify-center">1</span>
                                            <span className="font-bold text-sm text-[#1C2433]">Point your domain to Ziplin</span>
                                            <span className="text-xs text-white bg-[#F04438] rounded px-2 py-0.5 font-bold">Required</span>
                                        </div>
                                        <p className="text-[#667085] text-[13px] leading-relaxed mb-2.5 ml-7">
                                            Add this CNAME record in your DNS provider so traffic reaches our servers.
                                            Without this, short links <strong>will not redirect</strong> even after verification.
                                        </p>
                                        <div className="ml-7 bg-[#F4F7FB] border border-[#D9E2EC] rounded-lg p-3.5 font-mono text-[13px] text-[#1C2433] grid grid-cols-[70px_1fr] gap-2">
                                            <span className="text-[#667085]">Type</span><strong>CNAME</strong>
                                            <span className="text-[#667085]">Name</span><strong>{domain.name}</strong>
                                            <span className="text-[#667085]">Value</span>
                                            <span className="flex items-center gap-2">
                                                <strong>{cnameTarget}</strong>
                                                <button onClick={() => navigator.clipboard.writeText(cnameTarget)} className="bg-none border-none text-[#081C45] cursor-pointer p-0" title="Copy"><Copy size={12} /></button>
                                            </span>
                                            <span className="text-[#667085]">TTL</span><strong>Auto</strong>
                                        </div>
                                        <p className="text-[#667085] text-xs leading-relaxed mt-2 ml-7">
                                            Some DNS providers ask for the full hostname (<code className="bg-[#E8EDF3] px-1 py-0.5 rounded text-[11px]">{domain.name}</code>), others only want the part before your root domain. Both are correct — enter whatever your provider's form expects.
                                        </p>
                                        <p className="text-[#667085] text-xs leading-relaxed mt-1.5 ml-7">
                                            Using a <strong>root/apex domain</strong> (e.g. <code className="bg-[#E8EDF3] px-1 py-0.5 rounded text-[11px]">examly.one</code> without subdomain)?
                                            {" "}Use an <strong>ALIAS</strong> or <strong>ANAME</strong> record instead — same value, different type.
                                            Not all DNS providers support this.
                                        </p>
                                    </div>

                                    {/* Step 2 — Verification */}
                                    {token && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="w-5.5 h-5.5 rounded-full bg-[#667085] text-white font-extrabold text-[12px] flex items-center justify-center">2</span>
                                                <span className="font-bold text-sm text-[#1C2433]">Verify ownership</span>
                                            </div>
                                            <p className="text-[#667085] text-[13px] leading-relaxed mb-2.5 ml-7">
                                                If your CNAME is active and not proxied (e.g. Cloudflare orange-cloud <strong>off</strong>), clicking <strong>Verify now</strong> is enough — we detect the CNAME automatically.
                                            </p>
                                            <p className="text-[#667085] text-[13px] leading-relaxed mb-2.5 ml-7">
                                                If you use <strong>Cloudflare with proxy enabled</strong> (orange cloud), we cannot read your CNAME. Add this TXT record so we can verify ownership instead:
                                            </p>
                                            <div className="ml-7 bg-[#F4F7FB] border border-[#D9E2EC] rounded-lg p-3.5 font-mono text-[13px] text-[#1C2433] grid grid-cols-[70px_1fr] gap-2">
                                                <span className="text-[#667085]">Type</span><strong>TXT</strong>
                                                <span className="text-[#667085]">Name</span><strong>_ziplin-verify.{domain.name}</strong>
                                                <span className="text-[#667085]">Value</span>
                                                <span className="flex items-center gap-2">
                                                    <strong className="break-all">{token}</strong>
                                                    <button onClick={() => navigator.clipboard.writeText(token)} className="bg-none border-none text-[#081C45] cursor-pointer p-0" title="Copy"><Copy size={12} /></button>
                                                </span>
                                                <span className="text-[#667085]">TTL</span><strong>Auto</strong>
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-[#667085] text-xs leading-relaxed mt-4 pt-3.5 border-t border-[#E3EBF6]">
                                        DNS changes can take up to 24 hours to propagate globally. Click <strong>Verify now</strong> once the records are in place.
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}

                {!loading && !domains.length && (
                    <div className="bg-white border border-[#D9E2EC] rounded-xl p-9 text-center shadow-sm">
                        <Globe size={32} className="text-[#CBD5E1] mx-auto mb-3" />
                        <p className="text-[#667085] text-sm mb-4">No custom domains yet. Add one to use your own brand on short links.</p>
                        <button
                            onClick={() => setShowAdd(true)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#081C45] text-white font-bold text-sm cursor-pointer active:scale-[0.98] transition-all shadow-sm"
                        >
                            <Plus size={14} /> Add your first domain
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

