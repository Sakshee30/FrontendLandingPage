import { useEffect, useState } from "react";
import { CheckCircle, Clock, Trash2, Copy, Plus } from "lucide-react";
import { createSetting, deleteSetting, getWebhookDelivery, listSettings, listWebhookDeliveries, retryWebhookDelivery, SettingType, testWebhook, verifyDomainSetting, WebhookDelivery, WorkspaceSetting } from "../../services/settings";
import { FrontendConfig, getFrontendConfig } from "../../services/config";
import { DnsSetup } from "./DomainSection";

type SettingForm = Record<string, string | boolean | number>;

interface Tab {
    key: string;
    type: SettingType;
    label: string;
    desc: string;
}

function clean(value: unknown) { return String(value || "").trim(); }

function buildSettingPayload(type: SettingType, form: SettingForm, appConfig?: FrontendConfig | null) {
    const name = clean(form.name);
    if (type === "domain") return { name, config: { dnsTarget: clean(form.dnsTarget) || appConfig?.customDomainCnameTarget || "cname.ziplin.local" } };
    if (type === "pixel") {
        const provider = clean(form.provider) || "custom_image";
        const config: Record<string, unknown> = { provider };
        if (provider === "meta") Object.assign(config, { pixelId: clean(form.pixelId), event: clean(form.event) || "PageView" });
        if (provider === "google_ads") Object.assign(config, { conversionId: clean(form.conversionId), label: clean(form.label) });
        if (provider === "linkedin") Object.assign(config, { partnerId: clean(form.partnerId) });
        if (provider === "custom_image") Object.assign(config, { url: clean(form.url) });
        return { name, config };
    }
    if (type === "utm") return { name, config: { source: clean(form.source), medium: clean(form.medium), campaign: clean(form.campaign) } };
    if (type === "api_key") return { name, config: { scopes: ["links:read", "links:write"] } };
    if (type === "webhook") return { name, config: { url: clean(form.url), event: clean(form.event) || "link.clicked", events: clean(form.events).split(",").map((event) => event.trim()).filter(Boolean), secret: clean(form.secret) } };
    if (type === "privacy") return { name, config: { consentBanner: Boolean(form.consentBanner), cookieRetentionDays: Number(form.cookieRetentionDays) || 180, anonymizeIp: Boolean(form.anonymizeIp) } };
    if (type === "billing") return { name, config: { plan: clean(form.plan) || "Starter", billingEmail: clean(form.billingEmail), renewal: clean(form.renewal) || "Manual billing" } };
    return { name, config: {} };
}

function pixelSettingSummary(item: WorkspaceSetting) {
    const provider = String(item.config.provider || "custom");
    if (provider === "meta") return `Meta ${item.config.pixelId || ""}`;
    if (provider === "google_ads") return `Google Ads ${item.config.conversionId || ""}`;
    if (provider === "linkedin") return `LinkedIn ${item.config.partnerId || ""}`;
    return String(item.config.url || "Custom pixel");
}

function summaryFor(item: WorkspaceSetting) {
    if (item.type === "webhook") return String(item.config.url || "No URL");
    if (item.type === "utm") return Object.entries(item.config).map(([k, v]) => `${k}=${v}`).join("&");
    if (item.type === "pixel") return pixelSettingSummary(item);
    if (item.type === "privacy") return `Consent ${item.config.consentBanner ? "on" : "off"}, ${item.config.cookieRetentionDays || 180} day retention`;
    if (item.type === "billing") return `${item.config.plan || "Plan"} - ${item.config.renewal || "Manual"}`;
    return String(item.config.dnsTarget || "Configured");
}

function defaultSettingForm(type: SettingType, config?: FrontendConfig | null): SettingForm {
    if (type === "domain") return { name: "", dnsTarget: config?.customDomainCnameTarget || "cname.ziplin.local" };
    if (type === "pixel") return { name: "Meta retargeting", provider: "meta", pixelId: "", event: "PageView", conversionId: "", label: "", partnerId: "", url: "" };
    if (type === "utm") return { name: "Launch campaign", source: "", medium: "", campaign: "" };
    if (type === "api_key") return { name: "Production API key" };
    if (type === "webhook") return { name: "Click webhook", url: "", event: "link.clicked", events: "link.clicked, link.expired, link.created, qr.scanned, file.downloaded, form.submitted, bio.viewed", secret: "" };
    if (type === "privacy") return { name: "Default consent policy", consentBanner: true, anonymizeIp: true, cookieRetentionDays: 180 };
    if (type === "billing") return { name: "Starter workspace billing", plan: "Starter", billingEmail: "", renewal: "Manual billing" };
    return { name: "" };
}

export function ResourceSection({ tab }: { tab: Tab }) {
    const [items, setItems] = useState<WorkspaceSetting[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState<SettingForm>(() => defaultSettingForm(tab.type));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
    const [config, setConfig] = useState<FrontendConfig | null>(null);

    async function load(silent = false) {
        if (!silent) setLoading(true);
        setError(null);
        try {
            if (!config) {
                getFrontendConfig().then(setConfig).catch(() => null);
            }
            setItems(await listSettings(tab.type));
            if (tab.type === "webhook") {
                setDeliveries(await listWebhookDeliveries());
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load settings");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [tab.type]);
    useEffect(() => { setForm(defaultSettingForm(tab.type, config)); }, [tab.type, config?.customDomainCnameTarget]);
    useEffect(() => {
        const refreshSilently = () => {
            if (document.visibilityState === "visible" && !showAdd) load(true);
        };

        const interval = window.setInterval(refreshSilently, 6000);
        window.addEventListener("focus", refreshSilently);
        document.addEventListener("visibilitychange", refreshSilently);

        return () => {
            window.clearInterval(interval);
            window.removeEventListener("focus", refreshSilently);
            document.removeEventListener("visibilitychange", refreshSilently);
        };
    }, [tab.type, showAdd, config]);

    async function addItem() {
        const payload = buildSettingPayload(tab.type, form, config);
        const finalName = payload.name.trim();
        if (!finalName) return;
        try {
            const setting = await createSetting(tab.type, payload);
            setItems((current) => [setting, ...current]);
            setForm(defaultSettingForm(tab.type, config));
            setShowAdd(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not save setting");
        }
    }

    async function removeItem(id: string) {
        if (!confirm("Delete this item?")) return;
        try {
            await deleteSetting(id);
            setItems((current) => current.filter((item) => item.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Delete failed");
        }
    }

    async function verifyItem(item: WorkspaceSetting) {
        try {
            const result = await verifyDomainSetting(item.id);
            setItems((current) => current.map((entry) => entry.id === item.id ? result.setting : entry));
            alert(result.verified ? "Domain verified." : `Still pending. Expected CNAME: ${result.expectedTarget}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Verification failed");
        }
    }

    async function testWebhookItem(item: WorkspaceSetting) {
        try {
            const delivery = await testWebhook(item.id);
            alert(`Webhook test ${delivery.status}. Status: ${delivery.statusCode || "n/a"}`);
            await load(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Webhook test failed");
        }
    }

    const isVerified = (item: WorkspaceSetting) => item.status === "verified" || item.status === "active";

    return (
        <div className="space-y-5">
            <div className="bg-white border border-[#D9E2EC] rounded-xl p-6 md:p-7 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[#1C2433] text-xl font-bold mb-1.5">{tab.label}</h2>
                        <p className="text-[#667085] text-sm leading-relaxed">{tab.desc}</p>
                    </div>
                    <button
                        onClick={() => setShowAdd((value) => !value)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#081C45] text-white font-bold text-sm cursor-pointer active:scale-[0.98] transition-all shadow-sm shrink-0"
                    >
                        <Plus size={14} /> Add
                    </button>
                </div>
                {showAdd && (
                    <SettingFields type={tab.type} form={form} setForm={setForm} onSave={addItem} config={config} />
                )}
            </div>

            {error && (
                <div className="bg-[#FEF3F2] border border-[#FDA29B] text-[#B42318] rounded-xl p-3.5 font-bold text-sm">
                    {error}
                </div>
            )}

            {loading ? <div className="bg-white border border-[#D9E2EC] rounded-xl p-4.5 text-[#667085] text-sm">Loading {tab.label.toLowerCase()}...</div> : null}

            <div className="bg-white border border-[#D9E2EC] rounded-xl p-6 md:p-7 shadow-sm">
                <h3 className="text-[#1C2433] text-base font-bold mb-4">Saved {tab.label}</h3>
                {!items.length && !loading ? <p className="text-[#667085] text-sm">No items yet.</p> : null}
                <div className="divide-y divide-[#D9E2EC]">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-3.5 py-3.5">
                            <span className="flex-1 text-sm font-bold text-[#1C2433]">{item.name}</span>
                            <div>
                                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold ${isVerified(item) ? "bg-[#EAFBF3] text-[#12B76A]" : "bg-[#FFF7EC] text-[#F79009]"
                                    }`}>
                                    {isVerified(item) ? <CheckCircle size={13} /> : <Clock size={13} />}
                                    {isVerified(item) ? "Verified" : "Pending"}
                                </span>
                            </div>
                            {item.secret ? (
                                <code className="max-w-[260px] truncate text-xs bg-[#F4F7FB] px-2 py-1.5 rounded text-[#1C2433] font-mono border border-[#D9E2EC]">
                                    {item.secret}
                                </code>
                            ) : (
                                <span className="max-w-[260px] truncate text-[13px] text-[#667085]">
                                    {summaryFor(item)}
                                </span>
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                                {tab.type === "domain" && (
                                    <button
                                        title="Verify DNS"
                                        onClick={() => verifyItem(item)}
                                        className="text-[#081C45]  cursor-pointer font-bold text-sm px-1"
                                    >
                                        Verify
                                    </button>
                                )}
                                {tab.type === "webhook" && (
                                    <button
                                        title="Send test event"
                                        onClick={() => testWebhookItem(item)}
                                        className="text-[#081C45]  cursor-pointer font-bold text-sm px-1"
                                    >
                                        Test
                                    </button>
                                )}
                                <button
                                    title="Copy"
                                    onClick={() => navigator.clipboard.writeText(item.secret || summaryFor(item)).then(() => alert("Copied."))}
                                    className="text-[#081C45]  cursor-pointer p-1"
                                >
                                    <Copy size={15} />
                                </button>
                                <button
                                    title="Delete"
                                    onClick={() => removeItem(item.id)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-[#F04438] hover:bg-[#FEF3F2] cursor-pointer active:scale-[0.98] transition-all"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {tab.type === "domain" && <DnsSetup target={config?.customDomainCnameTarget || "cname.ziplin.local"} />}
            {tab.type === "webhook" && <WebhookDeliveries deliveries={deliveries} onRefresh={load} />}
        </div>
    );
}

function WebhookDeliveries({ deliveries, onRefresh }: { deliveries: WebhookDelivery[]; onRefresh: () => void }) {
    const [selected, setSelected] = useState<WebhookDelivery | null>(null);
    const [retryingId, setRetryingId] = useState("");

    async function showDetails(id: string) {
        try {
            setSelected(await getWebhookDelivery(id));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Could not load delivery");
        }
    }

    async function retry(id: string) {
        setRetryingId(id);
        try {
            const delivery = await retryWebhookDelivery(id);
            setSelected(delivery);
            await onRefresh();
        } catch (err) {
            alert(err instanceof Error ? err.message : "Retry failed");
        } finally {
            setRetryingId("");
        }
    }

    return (
        <div className="bg-white border border-[#D9E2EC] rounded-xl p-6 md:p-7 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
                <h3 className="text-[#1C2433] text-base font-bold">Recent webhook deliveries</h3>
                <button onClick={onRefresh} className="text-[#081C45] cursor-pointer font-bold text-sm">
                    Refresh
                </button>
            </div>
            {!deliveries.length ? (
                <p className="text-[#667085] text-sm">No webhook deliveries yet. Delivery attempts appear here after tracked clicks.</p>
            ) : (
                <div className="divide-y divide-[#D9E2EC]">
                    {deliveries.slice(0, 10).map((delivery) => (
                        <div key={delivery.id} className="flex flex-col sm:grid sm:grid-cols-[100px_2fr_70px_2fr_110px] gap-3 py-3 text-[13px] text-[#1C2433] items-start sm:items-center">
                            <strong className={delivery.status === "delivered" ? "text-[#12B76A]" : "text-[#F04438]"}>
                                {delivery.status}
                            </strong>
                            <span className="truncate w-full" title={delivery.targetUrl}>{delivery.targetUrl}</span>
                            <span>{delivery.statusCode || "-"}</span>
                            <span className="text-[#667085] truncate w-full" title={delivery.error || new Date(delivery.createdAt).toLocaleString()}>
                                {delivery.error || new Date(delivery.createdAt).toLocaleString()}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => showDetails(delivery.id)} className="text-[#081C45]  cursor-pointer font-bold text-xs">
                                    Details
                                </button>
                                <button
                                    onClick={() => retry(delivery.id)}
                                    disabled={retryingId === delivery.id}
                                    className="text-[#081C45] cursor-pointer font-bold text-xs disabled:opacity-65"
                                >
                                    {retryingId === delivery.id ? "Retrying..." : "Retry"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {selected && (
                <div className="mt-4 bg-[#F4F7FB] border border-[#D9E2EC] rounded-lg p-4">
                    <div className="flex items-center justify-between gap-4 mb-2.5">
                        <strong className="text-[#1C2433] text-sm font-bold">Delivery details</strong>
                        <button onClick={() => setSelected(null)} className="text-[#667085] hover:text-slate-800 cursor-pointer font-bold text-xs">
                            Close
                        </button>
                    </div>
                    <pre className="margin-0 overflow-auto max-h-64 color-[#1C2433] text-xs font-mono white-space-pre-wrap bg-white border border-[#D9E2EC] rounded p-3">
                        {JSON.stringify(selected, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}

function SettingFields({ type, form, setForm, onSave, config }: { type: SettingType; form: SettingForm; setForm: (form: SettingForm) => void; onSave: () => void; config?: FrontendConfig | null }) {
    const set = (key: string, value: string | boolean | number) => setForm({ ...form, [key]: value });
    const inputClass = "px-3.5 py-2.5 rounded-lg border border-[#D9E2EC] text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full";
    return (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#F8FAFC] border border-[#E3EBF6] rounded-xl p-5 md:p-6 items-end">
            {type === "domain" && <>
                <Field label="Domain name"><input value={String(form.name || "")} onChange={(event) => set("name", event.target.value)} placeholder="links.yourbrand.com" className={inputClass} /></Field>
                <Field label="CNAME target"><input value={String(form.dnsTarget || config?.customDomainCnameTarget || "")} onChange={(event) => set("dnsTarget", event.target.value)} className={inputClass} /></Field>
            </>}

            {type === "pixel" && <>
                <Field label="Pixel name"><input value={String(form.name || "")} onChange={(event) => set("name", event.target.value)} placeholder="Meta retargeting" className={inputClass} /></Field>
                <Field label="Provider"><select value={String(form.provider || "meta")} onChange={(event) => set("provider", event.target.value)} className={inputClass}><option value="meta">Meta</option><option value="google_ads">Google Ads</option><option value="linkedin">LinkedIn</option><option value="custom_image">Custom image URL</option></select></Field>
                {form.provider === "meta" && <><Field label="Meta pixel ID"><input value={String(form.pixelId || "")} onChange={(event) => set("pixelId", event.target.value)} className={inputClass} /></Field><Field label="Event"><input value={String(form.event || "PageView")} onChange={(event) => set("event", event.target.value)} className={inputClass} /></Field></>}
                {form.provider === "google_ads" && <><Field label="Conversion ID"><input value={String(form.conversionId || "")} onChange={(event) => set("conversionId", event.target.value)} placeholder="AW-123456789" className={inputClass} /></Field><Field label="Label"><input value={String(form.label || "")} onChange={(event) => set("label", event.target.value)} className={inputClass} /></Field></>}
                {form.provider === "linkedin" && <Field label="Partner ID"><input value={String(form.partnerId || "")} onChange={(event) => set("partnerId", event.target.value)} className={inputClass} /></Field>}
                {form.provider === "custom_image" && <Field label="Pixel URL"><input value={String(form.url || "")} onChange={(event) => set("url", event.target.value)} placeholder="https://pixel.example.com/track.gif" className={inputClass} /></Field>}
            </>}

            {type === "utm" && <>
                <Field label="Preset name"><input value={String(form.name || "")} onChange={(event) => set("name", event.target.value)} className={inputClass} /></Field>
                <Field label="Source"><input value={String(form.source || "")} onChange={(event) => set("source", event.target.value)} placeholder="newsletter" className={inputClass} /></Field>
                <Field label="Medium"><input value={String(form.medium || "")} onChange={(event) => set("medium", event.target.value)} placeholder="email" className={inputClass} /></Field>
                <Field label="Campaign"><input value={String(form.campaign || "")} onChange={(event) => set("campaign", event.target.value)} placeholder="launch" className={inputClass} /></Field>
            </>}

            {type === "api_key" && <Field label="Key name"><input value={String(form.name || "")} onChange={(event) => set("name", event.target.value)} className={inputClass} /></Field>}

            {type === "webhook" && <>
                <Field label="Webhook name"><input value={String(form.name || "")} onChange={(event) => set("name", event.target.value)} className={inputClass} /></Field>
                <Field label="Endpoint URL"><input value={String(form.url || "")} onChange={(event) => set("url", event.target.value)} placeholder="https://example.com/webhook" className={inputClass} /></Field>
                <Field label="Events"><input value={String(form.events || "")} onChange={(event) => set("events", event.target.value)} placeholder="link.clicked, file.downloaded" className={inputClass} /></Field>
                <Field label="Signing secret"><input value={String(form.secret || "")} onChange={(event) => set("secret", event.target.value)} placeholder="Auto-generated if empty" className={inputClass} /></Field>
            </>}

            {type === "privacy" && <>
                <Field label="Policy name"><input value={String(form.name || "")} onChange={(event) => set("name", event.target.value)} className={inputClass} /></Field>
                <CheckField label="Show consent banner" checked={Boolean(form.consentBanner)} onChange={(value) => set("consentBanner", value)} />
                <CheckField label="Anonymize IP addresses" checked={Boolean(form.anonymizeIp)} onChange={(value) => set("anonymizeIp", value)} />
                <Field label="Cookie retention days"><input type="number" value={Number(form.cookieRetentionDays || 180)} onChange={(event) => set("cookieRetentionDays", Number(event.target.value))} className={inputClass} /></Field>
            </>}

            {type === "billing" && <>
                <Field label="Billing profile"><input value={String(form.name || "")} onChange={(event) => set("name", event.target.value)} className={inputClass} /></Field>
                <Field label="Plan"><select value={String(form.plan || "Starter")} onChange={(event) => set("plan", event.target.value)} className={inputClass}><option>Starter</option><option>Growth</option><option>Business</option><option>Enterprise</option></select></Field>
                <Field label="Billing email"><input value={String(form.billingEmail || "")} onChange={(event) => set("billingEmail", event.target.value)} placeholder="billing@company.com" className={inputClass} /></Field>
                <Field label="Renewal"><input value={String(form.renewal || "Manual billing")} onChange={(event) => set("renewal", event.target.value)} className={inputClass} /></Field>
            </>}

            <div className="col-span-full flex justify-end">
                <button
                    onClick={onSave}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#081C45] text-white font-bold text-sm cursor-pointer  active:scale-[0.98] transition-all shadow-sm"
                >
                    Save
                </button>
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="flex flex-col gap-1.5 text-[#667085] text-xs font-bold uppercase tracking-wider w-full">
            {label}
            {children}
        </label>
    );
}

function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
    return (
        <label className="flex items-center gap-2.5 text-[#1C2433] text-[13px] font-bold cursor-pointer select-none pb-3">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="w-4 h-4 rounded text-[#081C45] border-[#D9E2EC] focus:ring-blue-500/20"
            />
            {label}
        </label>
    );
}

