import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Globe2,
  KeyRound,
  Pause,
  Play,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Upload,
} from "lucide-react";
import { TOKEN_COLOR } from "../utils/constants/colors.constants";
import {
  completeCutover,
  createMigration,
  getMigrationReport,
  listMigrations,
  preflightMigration,
  resumeMigration,
  resolveMigrationItems,
  startMigration,
  verifyCutover,
  type MigrationDetails,
  type MigrationJob,
  type MigrationLinkInput,
  type MigrationMode,
  type MigrationProvider,
} from "../app/services/migrations";
import { parseImportRows } from "../utils/helpers/parseImportRows";

const MIGRATION_TYPES: Array<{
  id: MigrationMode;
  provider: MigrationProvider;
  title: string;
  description: string;
  icon: React.ElementType;
}> = [
  {
    id: "custom_domain",
    provider: "custom_domain",
    title: "Custom domain cutover",
    description: "Zero-downtime migration for links on a domain you own.",
    icon: Globe2,
  },
  {
    id: "csv",
    provider: "csv",
    title: "CSV import",
    description: "Import exported links, slugs, tags, folders, and UTM data.",
    icon: Upload,
  },
  {
    id: "public_resolver",
    provider: "public_resolver",
    title: "Public resolver",
    description: "Resolve old public short links and recreate them in Ziplin.",
    icon: RefreshCw,
  },
  {
    id: "provider_api",
    provider: "bitly",
    title: "Provider API",
    description: "Prepare Bitly, Rebrandly, Short.io, or Switchy migrations.",
    icon: KeyRound,
  },
];

const PROVIDER_OPTIONS: MigrationProvider[] = ["bitly", "rebrandly", "shortio", "switchy"];
const ONE_CLICK_OPTIONS: Array<{
  provider: MigrationProvider;
  mode: MigrationMode;
  label: string;
}> = [
  { provider: "csv", mode: "csv", label: "CSV export" },
  { provider: "public_resolver", mode: "public_resolver", label: "Public short links" },
  { provider: "custom_domain", mode: "custom_domain", label: "Custom domain + CSV" },
  { provider: "bitly", mode: "provider_api", label: "Bitly API" },
  { provider: "rebrandly", mode: "provider_api", label: "Rebrandly API" },
  { provider: "shortio", mode: "provider_api", label: "Short.io API" },
  { provider: "switchy", mode: "provider_api", label: "Switchy API" },
];

const ITEM_STATUS_FILTERS = ["all", "conflict", "failed", "ready", "imported", "skipped"] as const;
type ItemStatusFilter = (typeof ITEM_STATUS_FILTERS)[number];

function statusColor(status: string) {
  if (["imported", "completed", "ready", "preflight_passed", "verified", "cutover_complete"].includes(status)) return TOKEN_COLOR.SUCCESS;
  if (["failed", "conflict", "blocked"].includes(status)) return TOKEN_COLOR.DANGER;
  if (["needs_review", "pending_verification"].includes(status)) return TOKEN_COLOR.WARNING;
  return TOKEN_COLOR.MUTED;
}

function csvCell(value: unknown) {
  if (value === null || value === undefined) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
  const columns = Array.from(rows.reduce((set, row) => {
    Object.keys(row).forEach((key) => set.add(key));
    return set;
  }, new Set<string>()));
  const csv = [
    columns.map(csvCell).join(","),
    ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
  ].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildReportCsvRows(report: any) {
  const job = report?.job ?? {};
  const base = {
    generated_at: report?.generatedAt ?? "",
    job_id: job.id ?? "",
    provider: job.provider ?? "",
    mode: job.mode ?? "",
    job_status: job.status ?? "",
    cutover_status: job.cutoverStatus ?? "",
  };
  const itemRows = [
    ...(report?.imported ?? []),
    ...(report?.conflicts ?? []),
    ...(report?.failed ?? []),
  ].map((item: any) => ({
    ...base,
    row_type: "migration_item",
    item_id: item.id ?? "",
    item_status: item.status ?? "",
    source_url: item.sourceUrl ?? "",
    source_domain: item.sourceDomain ?? "",
    source_slug: item.sourceSlug ?? "",
    target_url: item.targetUrl ?? "",
    destination_url: item.normalizedData?.destinationUrl ?? "",
    title: item.normalizedData?.title ?? "",
    conflict_strategy: item.conflictStrategy ?? "",
    error: item.error ?? "",
    unsupported_data: Object.keys(item.rawSourcePayload ?? {}).length ? item.rawSourcePayload : "",
  }));
  const domainRows = (report?.domains ?? []).map((domain: any) => ({
    ...base,
    row_type: "domain",
    domain: domain.domain ?? "",
    domain_status: domain.status ?? "",
    dns_target: domain.dnsTarget ?? "",
    domain_error: domain.error ?? "",
  }));
  const metricRows = (report?.metrics ?? []).map((metric: any) => ({
    ...base,
    row_type: "metric_snapshot",
    item_id: metric.itemId ?? "",
    metric_type: metric.metricType ?? "",
    period_start: metric.periodStart ?? "",
    period_end: metric.periodEnd ?? "",
    metric_value: metric.value ?? "",
  }));
  const summaryRows = Object.entries(report?.summary ?? {}).map(([key, value]) => ({
    ...base,
    row_type: "summary",
    summary_key: key,
    summary_value: value,
  }));
  return [...summaryRows, ...domainRows, ...itemRows, ...metricRows];
}

export default function MigrationCenterPage() {
  const [jobs, setJobs] = useState<MigrationJob[]>([]);
  const [details, setDetails] = useState<MigrationDetails | null>(null);
  const [workflow, setWorkflow] = useState<"one_click" | "advanced">("one_click");
  const [mode, setMode] = useState<MigrationMode>("custom_domain");
  const [provider, setProvider] = useState<MigrationProvider>("custom_domain");
  const [oneClickSource, setOneClickSource] = useState<(typeof ONE_CLICK_OPTIONS)[number]>(ONE_CLICK_OPTIONS[0]);
  const [domain, setDomain] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [providerDomain, setProviderDomain] = useState("");
  const [providerWorkspace, setProviderWorkspace] = useState("");
  const [providerGroupGuid, setProviderGroupGuid] = useState("");
  const [switchyEndpoint, setSwitchyEndpoint] = useState("https://graphql.switchy.io/v1/graphql");
  const [sourceLinks, setSourceLinks] = useState("");
  const [links, setLinks] = useState<MigrationLinkInput[]>([]);
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, { action: "skip" | "rename" | "replace"; slug: string }>>({});
  const [itemStatusFilter, setItemStatusFilter] = useState<ItemStatusFilter>("all");
  const [itemSearch, setItemSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listMigrations().then(setJobs).catch(() => {});
  }, []);

  const totals = details?.job.totals ?? {};
  const jobErrorMessage = typeof details?.job.errorSummary?.message === "string"
    ? details.job.errorSummary.message
    : "";
  const selectedType = MIGRATION_TYPES.find((item) => item.id === mode) ?? MIGRATION_TYPES[0];
  const zeroDowntime = mode === "custom_domain";
  const filteredItems = useMemo(() => {
    const search = itemSearch.trim().toLowerCase();
    return (details?.items ?? []).filter((item) => {
      if (itemStatusFilter !== "all" && item.status !== itemStatusFilter) return false;
      if (!search) return true;
      return [
        item.normalizedData?.slug,
        item.sourceSlug,
        item.normalizedData?.destinationUrl,
        item.sourceUrl,
        item.sourceDomain,
        item.error,
        item.status,
      ].some((value) => String(value || "").toLowerCase().includes(search));
    });
  }, [details?.items, itemSearch, itemStatusFilter]);
  const conflictItems = useMemo(() => {
    return (details?.items ?? []).filter((item) => item.status === "conflict");
  }, [details?.items]);
  const visibleConflictItems = useMemo(() => {
    const visibleIds = new Set(filteredItems.map((item) => item.id));
    return conflictItems.filter((item) => visibleIds.has(item.id));
  }, [filteredItems, conflictItems]);

  const sourceLinkRows = useMemo(
    () => sourceLinks.split(/\r?\n/).map((line) => line.trim()).filter(Boolean),
    [sourceLinks],
  );

  function chooseType(nextMode: MigrationMode, nextProvider: MigrationProvider) {
    setMode(nextMode);
    setProvider(nextProvider);
    setDetails(null);
    setError(null);
    setItemStatusFilter("all");
    setItemSearch("");
  }

  async function handleCsv(file: File | null) {
    if (!file) return;
    setError(null);
    try {
      const rows = parseImportRows(await file.text());
      setLinks(rows.filter((row) => row.destinationUrl).map((row) => ({
        title: row.title,
        destinationUrl: row.destinationUrl,
        slug: row.slug,
        shortDomain: row.shortDomain,
        folder: row.folder,
        tags: row.tags,
        notes: row.notes,
        utm: row.utm,
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : "CSV parsing failed");
    }
  }

  async function runOneClickMigration() {
    setBusy(true);
    setError(null);
    try {
      const job = await createMigration({
        provider: oneClickSource.provider,
        mode: oneClickSource.mode,
        targetDomain: domain,
        credentials: apiKey ? { apiKey } : undefined,
        options: {
          workflow: "one_click",
          domain: providerDomain,
          workspace: providerWorkspace,
          groupGuid: providerGroupGuid,
          endpoint: switchyEndpoint,
        },
      });
      const preflight = await preflightMigration(job.id, {
        sourceLinks: sourceLinkRows,
        links,
        domain,
        targetDomain: domain,
      });
      setJobs((current) => [preflight.job, ...current.filter((item) => item.id !== preflight.job.id)]);

      const hasBlockers = preflight.items.some((item) => ["conflict", "failed"].includes(item.status));
      if (hasBlockers || preflight.job.status === "failed") {
        setDetails(preflight);
        return;
      }

      const imported = await startMigration(preflight.job.id);
      setDetails(imported);
      setJobs((current) => [imported.job, ...current.filter((item) => item.id !== imported.job.id)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "One-click migration failed");
    } finally {
      setBusy(false);
    }
  }

  async function runPreflight() {
    setBusy(true);
    setError(null);
    try {
      const job = await createMigration({
        provider,
        mode,
        targetDomain: domain,
        credentials: apiKey ? { apiKey } : undefined,
        options: {
          domain: providerDomain,
          workspace: providerWorkspace,
          groupGuid: providerGroupGuid,
          endpoint: switchyEndpoint,
        },
      });
      const result = await preflightMigration(job.id, {
        sourceLinks: sourceLinkRows,
        links,
        domain,
        targetDomain: domain,
      });
      setDetails(result);
      setJobs((current) => [result.job, ...current.filter((item) => item.id !== result.job.id)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preflight failed");
    } finally {
      setBusy(false);
    }
  }

  async function runStart() {
    if (!details) return;
    setBusy(true);
    setError(null);
    try {
      const result = await startMigration(details.job.id);
      setDetails(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Migration failed");
    } finally {
      setBusy(false);
    }
  }

  async function resolveItem(itemId: string) {
    if (!details) return;
    const draft = resolutionDrafts[itemId] ?? { action: "skip", slug: "" };
    setBusy(true);
    setError(null);
    try {
      const result = await resolveMigrationItems(details.job.id, [{
        itemId,
        action: draft.action,
        slug: draft.action === "rename" ? draft.slug : undefined,
      }]);
      setDetails(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conflict resolution failed");
    } finally {
      setBusy(false);
    }
  }

  async function replaceConflictItems(scope: "all" | "visible") {
    if (!details) return;
    const items = scope === "visible" ? visibleConflictItems : conflictItems;
    if (items.length === 0) {
      setError("No conflict rows found to replace.");
      return;
    }
    const label = scope === "visible" ? "visible conflicts" : "conflicts";
    const ok = window.confirm(`Replace ${items.length} ${label}? Replaceable rows will be marked ready. Rows that cannot be replaced will stay blocked for rename or skip.`);
    if (!ok) return;

    setBusy(true);
    setError(null);
    try {
      const result = await resolveMigrationItems(details.job.id, items.map((item) => ({
        itemId: item.id,
        action: "replace",
      })));
      setDetails(result);
      setResolutionDrafts((current) => {
        const next = { ...current };
        items.forEach((item) => delete next[item.id]);
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk replace failed");
    } finally {
      setBusy(false);
    }
  }

  async function runResume() {
    if (!details) return;
    setBusy(true);
    setError(null);
    try {
      setDetails(await resumeMigration(details.job.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resume failed");
    } finally {
      setBusy(false);
    }
  }

  async function runVerify() {
    if (!details) return;
    setBusy(true);
    setError(null);
    try {
      const result = await verifyCutover(details.job.id);
      setDetails((current) => current ? { ...current, job: result.job, domains: result.domains } : current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cutover verification failed");
    } finally {
      setBusy(false);
    }
  }

  async function runCompleteCutover() {
    if (!details) return;
    setBusy(true);
    setError(null);
    try {
      const result = await completeCutover(details.job.id);
      setDetails((current) => current ? { ...current, job: result.job, domains: result.domains } : current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cutover completion failed");
    } finally {
      setBusy(false);
    }
  }

  async function runReport() {
    if (!details) return;
    const report = await getMigrationReport(details.job.id);
    downloadCsv(`ziplin-migration-${details.job.id}.csv`, buildReportCsvRows(report));
  }

  function renderConflictAction(item: MigrationDetails["items"][number]) {
    if (item.status !== "conflict" && item.status !== "failed") return null;
    const draft = resolutionDrafts[item.id] ?? { action: "skip", slug: item.normalizedData?.slug || item.sourceSlug || "" };
    return (
      <div className="flex flex-col sm:flex-row gap-2 min-w-[320px]">
        <select
          value={draft.action}
          onChange={(event) => setResolutionDrafts((current) => ({
            ...current,
            [item.id]: { ...draft, action: event.target.value as "skip" | "rename" | "replace" },
          }))}
          className="border border-slate-200 rounded-lg px-2 py-2 text-xs font-semibold"
        >
          <option value="skip">Skip</option>
          <option value="rename">Rename</option>
          <option value="replace">Replace</option>
        </select>
        {draft.action === "rename" && (
          <input
            value={draft.slug}
            onChange={(event) => setResolutionDrafts((current) => ({
              ...current,
              [item.id]: { ...draft, slug: event.target.value },
            }))}
            placeholder="new-slug"
            className="border border-slate-200 rounded-lg px-2 py-2 text-xs min-w-[120px]"
          />
        )}
        <button
          onClick={() => resolveItem(item.id)}
          disabled={busy}
          className="rounded-lg bg-[#081C45] text-white border-none px-3 py-2 text-xs font-bold cursor-pointer disabled:opacity-50"
        >
          Apply
        </button>
      </div>
    );
  }

  function renderItemFilters() {
    if (!details) return null;
    return (
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {ITEM_STATUS_FILTERS.map((status) => {
            const active = itemStatusFilter === status;
            const count = status === "all" ? details.items.length : totals[status] ?? 0;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setItemStatusFilter(status)}
                className={`rounded-lg border px-3 py-2 text-xs font-bold capitalize cursor-pointer ${
                  active ? "bg-[#081C45] text-white border-[#081C45]" : "bg-white text-[#475569] border-slate-200 hover:bg-slate-50"
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          {conflictItems.length > 0 && (
            <button
              type="button"
              onClick={() => replaceConflictItems(itemStatusFilter !== "all" || itemSearch ? "visible" : "all")}
              disabled={busy || (itemStatusFilter !== "all" || itemSearch ? visibleConflictItems.length === 0 : conflictItems.length === 0)}
              className="rounded-lg border border-[#F4B400] bg-[#FFF6CC] text-[#081C45] px-3 py-2 text-sm font-bold cursor-pointer disabled:opacity-50"
            >
              Replace {itemStatusFilter !== "all" || itemSearch ? "visible" : "all"} conflicts ({itemStatusFilter !== "all" || itemSearch ? visibleConflictItems.length : conflictItems.length})
            </button>
          )}
          <input
            value={itemSearch}
            onChange={(event) => setItemSearch(event.target.value)}
            placeholder="Search slug, URL, issue"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm min-w-[240px]"
          />
          {(itemStatusFilter !== "all" || itemSearch) && (
            <button
              type="button"
              onClick={() => {
                setItemStatusFilter("all");
                setItemSearch("");
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-8">
      <div className="mb-7">
        <h1 className="text-[26px] font-extrabold text-[#0f172a] m-0">Migration Center</h1>
        <p className="text-sm text-[#64748b] mt-2 mb-0">
          Move links into Ziplin with preflight checks, slug preservation, conflict review, and custom-domain cutover tracking.
        </p>
      </div>

      <div className="mb-5 inline-flex rounded-lg border border-slate-200 bg-white p-1">
        <button
          onClick={() => setWorkflow("one_click")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold border-none cursor-pointer ${workflow === "one_click" ? "bg-[#0E2F73] text-white" : "bg-transparent text-[#64748b]"}`}
        >
          <Sparkles size={15} /> One-Click Migration
        </button>
        <button
          onClick={() => setWorkflow("advanced")}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-bold border-none cursor-pointer ${workflow === "advanced" ? "bg-[#0E2F73] text-white" : "bg-transparent text-[#64748b]"}`}
        >
          Advanced Migration
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {workflow === "one_click" && (
        <section className="bg-white border border-[#e2e8f0] rounded-lg p-5 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <div className="max-w-[620px]">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF6CC] text-[#081C45] px-3 py-1 text-xs font-bold mb-3">
                <Sparkles size={14} /> Recommended
              </div>
              <h2 className="text-xl font-extrabold text-[#0f172a] m-0">One-Click Migration</h2>
              <p className="text-sm text-[#64748b] mt-2 mb-0">
                Ziplin will scan, preflight, import safe rows, and stop automatically if conflicts need review.
              </p>
            </div>
            <div className={`rounded-full px-3 py-1 text-xs font-bold ${oneClickSource.mode === "custom_domain" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {oneClickSource.mode === "custom_domain" ? "Same links can stay live" : "New Ziplin links will be created"}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
            <label className="text-sm font-semibold text-[#334155]">
              Source
              <select
                value={`${oneClickSource.provider}:${oneClickSource.mode}`}
                onChange={(event) => {
                  const next = ONE_CLICK_OPTIONS.find((item) => `${item.provider}:${item.mode}` === event.target.value) ?? ONE_CLICK_OPTIONS[0];
                  setOneClickSource(next);
                  setProvider(next.provider);
                  setMode(next.mode);
                  setDetails(null);
                  setError(null);
                }}
                className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                {ONE_CLICK_OPTIONS.map((item) => (
                  <option key={`${item.provider}:${item.mode}`} value={`${item.provider}:${item.mode}`}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            {(oneClickSource.mode === "custom_domain" || oneClickSource.mode === "csv") && (
              <label className="text-sm font-semibold text-[#334155]">
                Short domain
                <input
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  placeholder="go.company.com"
                  className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </label>
            )}

            {oneClickSource.mode === "provider_api" && (
              <label className="text-sm font-semibold text-[#334155]">
                API key
                <input
                  type="password"
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder="Paste provider API key"
                  className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </label>
            )}

            {oneClickSource.mode === "provider_api" && oneClickSource.provider === "bitly" && (
              <label className="text-sm font-semibold text-[#334155]">
                Bitly group GUID
                <input
                  value={providerGroupGuid}
                  onChange={(event) => setProviderGroupGuid(event.target.value)}
                  placeholder="Optional; Ziplin tries first group"
                  className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </label>
            )}

            {oneClickSource.mode === "provider_api" && oneClickSource.provider === "rebrandly" && (
              <label className="text-sm font-semibold text-[#334155]">
                Rebrandly workspace
                <input
                  value={providerWorkspace}
                  onChange={(event) => setProviderWorkspace(event.target.value)}
                  placeholder="Optional workspace id"
                  className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </label>
            )}

            {oneClickSource.mode === "provider_api" && oneClickSource.provider === "shortio" && (
              <label className="text-sm font-semibold text-[#334155]">
                Short.io domain
                <input
                  value={providerDomain}
                  onChange={(event) => setProviderDomain(event.target.value)}
                  placeholder="go.company.com"
                  className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </label>
            )}

            {oneClickSource.mode === "provider_api" && oneClickSource.provider === "switchy" && (
              <label className="text-sm font-semibold text-[#334155]">
                Switchy endpoint
                <input
                  value={switchyEndpoint}
                  onChange={(event) => setSwitchyEndpoint(event.target.value)}
                  placeholder="https://graphql.switchy.io/v1/graphql"
                  className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </label>
            )}

            {(oneClickSource.mode === "custom_domain" || oneClickSource.mode === "csv") && (
              <div className="text-sm font-semibold text-[#334155]">
                CSV export
                <label className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm font-bold cursor-pointer text-[#334155]">
                  <Upload size={15} />
                  {links.length ? `${links.length} rows loaded` : "Upload CSV"}
                  <input type="file" accept=".csv" className="hidden" onChange={(event) => {
                    handleCsv(event.target.files?.[0] ?? null);
                    event.target.value = "";
                  }} />
                </label>
              </div>
            )}
          </div>

          {oneClickSource.mode === "public_resolver" && (
            <label className="block text-sm font-semibold text-[#334155] mt-4">
              Old public short links
              <textarea
                value={sourceLinks}
                onChange={(event) => setSourceLinks(event.target.value)}
                rows={6}
                placeholder={"https://bit.ly/example\nhttps://oldshort.com/a1"}
                className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-y"
              />
            </label>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button
              onClick={runOneClickMigration}
              disabled={
                busy ||
                (["csv", "custom_domain"].includes(oneClickSource.mode) && links.length === 0) ||
                (oneClickSource.mode === "public_resolver" && sourceLinkRows.length === 0) ||
                (oneClickSource.mode === "provider_api" && !apiKey.trim()) ||
                (oneClickSource.provider === "shortio" && !providerDomain.trim())
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#0E2F73] text-white px-4 py-2 text-sm font-bold border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={15} /> Start one-click migration
            </button>
            {details && (
              <button onClick={runReport} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold cursor-pointer">
                <Download size={15} /> Download report
              </button>
            )}
          </div>
        </section>
      )}

      {workflow === "one_click" && details && (
        <section className="bg-white border border-[#e2e8f0] rounded-lg p-5 mb-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#0f172a] m-0">Migration result</h2>
              <p className="text-sm text-[#64748b] mt-1 mb-0">
                {details.job.status === "imported" || details.job.status === "completed"
                  ? "Safe rows were imported. Review any DNS or cutover tasks below."
                  : "Ziplin stopped before importing unsafe rows. Review the issues below."}
              </p>
            </div>
            <span className="text-xs font-bold rounded-full px-3 py-1 bg-slate-100" style={{ color: statusColor(details.job.status) }}>
              {details.job.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={runStart}
              disabled={busy || (totals.conflict ?? 0) > 0 || (totals.failed ?? 0) > 0 || details.job.status === "imported"}
              className="inline-flex items-center gap-2 rounded-lg bg-[#081C45] text-white px-4 py-2 text-sm font-bold border-none cursor-pointer disabled:opacity-50"
            >
              <Play size={15} /> Start import
            </button>
            {((totals.conflict ?? 0) > 0 || (totals.failed ?? 0) > 0) && (
              <span className="text-sm text-[#64748b] self-center">Resolve or skip all blocked rows before importing.</span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
            {["total", "ready", "imported", "conflict", "failed"].map((key) => (
              <div key={key} className="border border-slate-200 rounded-lg p-4">
                <div className="text-xs uppercase font-bold text-[#94a3b8]">{key}</div>
                <div className="text-2xl font-extrabold text-[#0f172a] mt-1">{totals[key] ?? 0}</div>
              </div>
            ))}
          </div>

          {jobErrorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold mb-5">
              {jobErrorMessage}
            </div>
          )}

          {details.domains.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-5">
              <div className="text-sm font-bold text-[#0f172a] mb-1">DNS cutover</div>
              <div className="text-sm text-[#334155]">
                CNAME target: <strong>{details.domains[0]?.dnsTarget || "li.ziplin.io"}</strong>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={runVerify} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">
                  <ShieldAlert size={15} /> Verify DNS
                </button>
                <button onClick={runCompleteCutover} disabled={busy || details.job.cutoverStatus !== "ready"} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm font-bold border-none cursor-pointer disabled:opacity-50">
                  <CheckCircle2 size={15} /> Mark complete
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <div className="p-4 border-b border-slate-200 bg-white">
              {renderItemFilters()}
              <div className="text-xs text-[#64748b] mt-2">
                Showing {filteredItems.length} of {details.items.length} rows.
              </div>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[#64748b]">
                <tr>
                  <th className="text-left px-4 py-3 font-bold">Slug</th>
                  <th className="text-left px-4 py-3 font-bold">Destination</th>
                  <th className="text-left px-4 py-3 font-bold">Status</th>
                  <th className="text-left px-4 py-3 font-bold">Issue</th>
                  <th className="text-left px-4 py-3 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-[#0f172a]">{item.normalizedData?.slug || item.sourceSlug || "-"}</td>
                    <td className="px-4 py-3 text-[#64748b] max-w-[360px] truncate">{item.normalizedData?.destinationUrl || item.sourceUrl || "-"}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: statusColor(item.status) }}>{item.status}</td>
                    <td className="px-4 py-3 text-[#64748b]">{item.error || ""}</td>
                    <td className="px-4 py-3">{renderConflictAction(item)}</td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr className="border-t border-slate-100">
                    <td colSpan={5} className="px-4 py-8 text-center text-[#64748b]">
                      No migration rows match this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className={`grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5 ${workflow === "one_click" ? "hidden" : ""}`}>
        <aside className="space-y-4">
          <section className="bg-white border border-[#e2e8f0] rounded-lg p-4">
            <h2 className="text-sm font-bold text-[#0f172a] m-0 mb-3">Migration type</h2>
            <div className="space-y-2">
              {MIGRATION_TYPES.map((item) => {
                const Icon = item.icon;
                const active = item.id === mode;
                return (
                  <button
                    key={item.id}
                    onClick={() => chooseType(item.id, item.provider)}
                    className={`w-full text-left border rounded-lg p-3 cursor-pointer bg-white transition-colors ${active ? "border-[#081C45] bg-[#FFF6CC]" : "border-slate-200 hover:bg-slate-50"}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon size={18} className={active ? "text-[#081C45]" : "text-slate-500"} />
                      <div>
                        <div className="text-sm font-bold text-[#0f172a]">{item.title}</div>
                        <div className="text-xs text-[#64748b] mt-1 leading-5">{item.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bg-white border border-[#e2e8f0] rounded-lg p-4">
            <h2 className="text-sm font-bold text-[#0f172a] m-0 mb-3">Recent jobs</h2>
            <div className="space-y-2">
              {jobs.length === 0 && <div className="text-sm text-[#64748b]">No migrations yet.</div>}
              {jobs.slice(0, 6).map((job) => (
                <button
                  key={job.id}
                  onClick={() => setDetails({ job, items: [], domains: [] })}
                  className="w-full text-left border border-slate-200 rounded-lg bg-white p-3 hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex justify-between gap-2">
                    <span className="text-sm font-bold text-[#0f172a] capitalize">{job.mode.replace("_", " ")}</span>
                    <span className="text-xs font-bold" style={{ color: statusColor(job.status) }}>{job.status}</span>
                  </div>
                  <div className="text-xs text-[#64748b] mt-1">{new Date(job.createdAt).toLocaleString()}</div>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <main className="space-y-5">
          <section className="bg-white border border-[#e2e8f0] rounded-lg p-5">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-[#0f172a] m-0">{selectedType.title}</h2>
                <p className="text-sm text-[#64748b] mt-1 mb-0">{selectedType.description}</p>
              </div>
              <div className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${zeroDowntime ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {zeroDowntime ? "Zero downtime supported" : "New links will be created"}
              </div>
            </div>

            {mode === "provider_api" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <label className="text-sm font-semibold text-[#334155]">
                  Provider
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value as MigrationProvider)}
                    className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {PROVIDER_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label className="text-sm font-semibold text-[#334155]">
                  API key
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Stored encrypted, never shown again"
                    className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </label>
                {provider === "bitly" && (
                  <label className="text-sm font-semibold text-[#334155]">
                    Bitly group GUID
                    <input
                      value={providerGroupGuid}
                      onChange={(e) => setProviderGroupGuid(e.target.value)}
                      placeholder="Optional; Ziplin tries first group"
                      className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </label>
                )}
                {provider === "rebrandly" && (
                  <label className="text-sm font-semibold text-[#334155]">
                    Rebrandly workspace
                    <input
                      value={providerWorkspace}
                      onChange={(e) => setProviderWorkspace(e.target.value)}
                      placeholder="Optional workspace id"
                      className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </label>
                )}
                {provider === "shortio" && (
                  <label className="text-sm font-semibold text-[#334155]">
                    Short.io domain
                    <input
                      value={providerDomain}
                      onChange={(e) => setProviderDomain(e.target.value)}
                      placeholder="go.company.com"
                      className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </label>
                )}
                {provider === "switchy" && (
                  <label className="text-sm font-semibold text-[#334155]">
                    Switchy endpoint
                    <input
                      value={switchyEndpoint}
                      onChange={(e) => setSwitchyEndpoint(e.target.value)}
                      placeholder="https://graphql.switchy.io/v1/graphql"
                      className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    />
                  </label>
                )}
              </div>
            )}

            {(mode === "custom_domain" || mode === "csv") && (
              <label className="block text-sm font-semibold text-[#334155] mb-4">
                Target short domain
                <input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="go.company.com"
                  className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </label>
            )}

            {(mode === "custom_domain" || mode === "csv") && (
              <div className="border border-dashed border-slate-300 rounded-lg p-5 mb-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-[#0f172a]">CSV file</div>
                    <div className="text-xs text-[#64748b] mt-1">Use columns from the existing Ziplin import template.</div>
                  </div>
                  <label className="inline-flex items-center gap-2 rounded-lg bg-[#081C45] text-white px-3 py-2 text-sm font-bold cursor-pointer">
                    <Upload size={15} />
                    Upload CSV
                    <input type="file" accept=".csv" className="hidden" onChange={(e) => {
                      handleCsv(e.target.files?.[0] ?? null);
                      e.target.value = "";
                    }} />
                  </label>
                </div>
                {links.length > 0 && <div className="text-sm text-emerald-700 font-bold mt-3">{links.length} rows ready for preflight.</div>}
              </div>
            )}

            {mode === "public_resolver" && (
              <label className="block text-sm font-semibold text-[#334155] mb-4">
                Old public short links
                <textarea
                  value={sourceLinks}
                  onChange={(e) => setSourceLinks(e.target.value)}
                  rows={8}
                  placeholder={"https://bit.ly/example\nhttps://oldshort.com/a1"}
                  className="mt-2 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-y"
                />
              </label>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={runPreflight}
                disabled={busy || (["csv", "custom_domain"].includes(mode) && links.length === 0) || (mode === "public_resolver" && sourceLinkRows.length === 0)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0E2F73] text-white px-4 py-2 text-sm font-bold border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Run preflight <ArrowRight size={15} />
              </button>
              {details && (
                <>
                  <button onClick={runStart} disabled={busy || (totals.conflict ?? 0) > 0 || (totals.failed ?? 0) > 0 || details.job.status === "imported"} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">
                    <Play size={15} /> Start import
                  </button>
                  <button onClick={runResume} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">
                    <Pause size={15} /> Resume
                  </button>
                  <button onClick={runReport} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold cursor-pointer">
                    <Download size={15} /> Report
                  </button>
                </>
              )}
            </div>
          </section>

          {details && (
            <>
              <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {["total", "ready", "imported", "conflict", "failed"].map((key) => (
                  <div key={key} className="bg-white border border-[#e2e8f0] rounded-lg p-4">
                    <div className="text-xs uppercase font-bold text-[#94a3b8]">{key}</div>
                    <div className="text-2xl font-extrabold text-[#0f172a] mt-1">{totals[key] ?? 0}</div>
                  </div>
                ))}
              </section>

              <section className="bg-white border border-[#e2e8f0] rounded-lg p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#0f172a] m-0">Cutover readiness</h2>
                    <p className="text-sm text-[#64748b] mt-1 mb-0">Custom domains must be verified before DNS moves to Ziplin.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={runVerify} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold cursor-pointer disabled:opacity-50">
                      <ShieldAlert size={15} /> Verify
                    </button>
                    <button onClick={runCompleteCutover} disabled={busy || details.job.cutoverStatus !== "ready"} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm font-bold border-none cursor-pointer disabled:opacity-50">
                      <CheckCircle2 size={15} /> Complete
                    </button>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-[#334155]">
                  CNAME target: <strong>{details.domains[0]?.dnsTarget || "Configure and verify a custom domain first"}</strong>
                </div>
                <div className="mt-3 space-y-2">
                  {details.domains.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 border border-slate-200 rounded-lg p-3">
                      <span className="text-sm font-bold text-[#0f172a]">{item.domain}</span>
                      <span className="text-xs font-bold" style={{ color: statusColor(item.status) }}>{item.status}</span>
                    </div>
                  ))}
                  {details.domains.length === 0 && <div className="text-sm text-[#64748b]">No custom domains in this migration.</div>}
                </div>
              </section>

              <section className="bg-white border border-[#e2e8f0] rounded-lg overflow-hidden">
                <div className="p-5 border-b border-slate-200 space-y-4">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#0f172a] m-0">Preflight items</h2>
                    <div className="text-xs text-[#64748b] mt-2">
                      Showing {filteredItems.length} of {details.items.length} rows.
                    </div>
                  </div>
                  {renderItemFilters()}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-[#64748b]">
                      <tr>
                        <th className="text-left px-4 py-3 font-bold">Slug</th>
                        <th className="text-left px-4 py-3 font-bold">Destination</th>
                        <th className="text-left px-4 py-3 font-bold">Status</th>
                        <th className="text-left px-4 py-3 font-bold">Issue</th>
                        <th className="text-left px-4 py-3 font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="border-t border-slate-100">
                          <td className="px-4 py-3 font-semibold text-[#0f172a]">{item.normalizedData?.slug || item.sourceSlug || "-"}</td>
                          <td className="px-4 py-3 text-[#64748b] max-w-[360px] truncate">{item.normalizedData?.destinationUrl || item.sourceUrl || "-"}</td>
                          <td className="px-4 py-3 font-bold" style={{ color: statusColor(item.status) }}>{item.status}</td>
                          <td className="px-4 py-3 text-[#64748b]">{item.error || ""}</td>
                          <td className="px-4 py-3">{renderConflictAction(item)}</td>
                        </tr>
                      ))}
                      {filteredItems.length === 0 && (
                        <tr className="border-t border-slate-100">
                          <td colSpan={5} className="px-4 py-8 text-center text-[#64748b]">
                            No migration rows match this filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

