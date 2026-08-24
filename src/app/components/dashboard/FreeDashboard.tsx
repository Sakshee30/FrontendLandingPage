import { useMemo, useState } from "react";
import { Check, Copy, Link2, Loader2, QrCode, Zap } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import { createPublicShortLink } from "../../services/links";
import { createQrCode, QrCodeRecord } from "../../services/qr";

type FreeDashboardProps = {
  onCreated?: () => void;
};

type Result = { label: string; url: string; qr?: QrCodeRecord | null };

export function FreeDashboard({ onCreated }: FreeDashboardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [url, setUrl] = useState("");
  const [alsoQr, setAlsoQr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const firstName = user?.name?.split(" ")[0] || user?.firstName || "there";

  const today = useMemo(
    () => new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date()),
    [],
  );

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);
    setCopied(false);

    const destinationUrl = url.trim();
    if (!destinationUrl) {
      setError("Enter a URL to continue.");
      return;
    }

    setSaving(true);
    try {
      const created = await createPublicShortLink(destinationUrl);
      let qr: QrCodeRecord | null = null;
      if (alsoQr) {
        qr = await createQrCode({
          name: `${created.title || "Short link"} QR`,
          qrType: "URL",
          destinationUrl: created.shortUrl || destinationUrl,
          dynamic: true,
          design: defaultQrDesign(),
        });
      }
      setResult({ label: "Short link created", url: created.shortUrl, qr });
      setUrl("");
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create this item.");
    } finally {
      setSaving(false);
    }
  }

  async function copyResult() {
    if (!result?.url) return;
    await navigator.clipboard.writeText(result.url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-full bg-[#DCE7F5] px-5 pb-10 pt-8 text-[#081C45] lg:px-8">
      <div className="mx-auto max-w-[860px] text-center">
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-black">
          Good afternoon, {firstName}
        </h1>
        <p className="mt-1.5 text-[14px] font-normal text-[#7B7B7B]">
          {today}. See how your links are performing.
        </p>

        <div className="mt-7 flex items-end justify-center gap-8">
          <button
            type="button"
            className="relative z-10 flex min-w-[180px] items-center justify-center gap-2 rounded-t-[18px] border border-slate-300 border-b-white bg-white px-6 py-4 text-[18px] font-semibold text-[#081C45]"
          >
            <Link2 size={17} />
            Short Link
          </button>
          <button
            type="button"
            onClick={() => navigate("/qr")}
            className="relative z-10 flex min-w-[170px] items-center justify-center gap-2 rounded-t-[18px] border border-transparent px-6 py-4 text-[17px] font-medium text-[#0E2F73] transition-colors hover:bg-white/60"
          >
            <QrCode size={17} />
            QR Codes
          </button>
        </div>

        <form
          onSubmit={submit}
          className="relative -mt-px rounded-[18px] border border-slate-300 bg-white px-5 py-5 text-left shadow-sm sm:px-6"
        >
          <label className="mb-3 block text-[16px] font-semibold text-black">Enter the URL</label>
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            type="url"
            required
            disabled={saving}
            placeholder="https://example.com/my-long-url"
            className="h-[46px] w-full rounded border border-transparent bg-[#EEEEEE] px-4 text-[15px] font-normal text-[#081C45] outline-none placeholder:text-[#C8C8C8] focus:border-[#164BB7] focus:bg-white"
          />

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_280px] lg:items-center">
            <label className="flex cursor-pointer items-center gap-3 text-[16px] font-normal text-black">
              <input
                type="checkbox"
                checked={alsoQr}
                onChange={(event) => setAlsoQr(event.target.checked)}
                className="h-4 w-4 accent-[#081C45]"
              />
              Also create a QR code for this link
            </label>

            <button
              type="submit"
              disabled={saving}
              className="flex h-[46px] items-center justify-center gap-2 rounded bg-[#081C45] px-5 text-[16px] font-normal text-white transition-colors hover:bg-[#0E2F73] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {saving && <Loader2 size={18} className="animate-spin" />}
              Create the short link
            </button>
          </div>

          {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}

          {result && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2 text-sm font-extrabold text-emerald-700">
                    <Check size={16} />
                    {result.label}
                  </div>
                  <a href={result.url} target="_blank" rel="noreferrer" className="break-all text-sm font-bold text-[#0E2F73] hover:underline">
                    {result.url}
                  </a>
                  {result.qr && (
                    <p className="mt-1 text-xs font-semibold text-emerald-700">QR code was created for this short link.</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={copyResult}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
                >
                  <Copy size={14} />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </form>

        <button
          type="button"
          onClick={() => navigate("/subscription")}
          className="mt-8 hidden items-center gap-2 rounded-full border border-white/40 bg-[#081C45] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#081C45]/20 hover:bg-[#0E2F73]"
        >
          <Zap size={16} className="fill-white" />
          Upgrade to unlock all features
        </button>
      </div>
    </div>
  );
}

function defaultQrDesign() {
  return {
    fgColor: "#F4B400",
    bgColor: "#081C45",
    margin: 2,
    errorCorrectionLevel: "H",
    matrixStyle: "square",
    eyeFrameStyle: "square",
    gradientMode: "solid",
    frame: "none",
    frameText: "Scan me",
  };
}
