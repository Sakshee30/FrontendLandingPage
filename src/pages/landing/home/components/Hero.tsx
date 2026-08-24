import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  Check,
  Link2,
  TrendingUp,
  QrCode,
  User,
  Download,
  Search,
  Bell,
  Compass,
  Target,
  FileText,
  Eye,
  Settings,
  CreditCard,
  HelpCircle,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import QRCode from "qrcode";

interface ClickEvent {
  id: number;
  link: string;
  target: string;
  geo: string;
  time: string;
}

const Hero = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [activeTab, setActiveTab] = useState<"dashboard" | "analytics" | "qr" | "bio">("dashboard");
  const [isAutoCycling, setIsAutoCycling] = useState(true);
  const [clicksCount, setClicksCount] = useState(128492);
  const [linksCreated, setLinksCreated] = useState(42);
  const [qrScans, setQrScans] = useState(18);
  const [bioClicks, setBioClicks] = useState(0);

  const [qrColor, setQrColor] = useState("#8b5cf6"); // default purple
  const [bioClickedMsg, setBioClickedMsg] = useState("");

  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([
    { id: 1, link: "ziplin.io/sale", target: "shop.com/summer-sale", geo: "USA 🇺🇸", time: "just now" },
    { id: 2, link: "ziplin.io/app", target: "apps.apple.com/ziplin", geo: "Germany 🇩🇪", time: "3s ago" },
    { id: 3, link: "ziplin.io/docs", target: "gitbook.io/ziplin-docs", geo: "Japan 🇯🇵", time: "8s ago" },
  ]);

  useEffect(() => {
    if (!isAutoCycling) return;
    const interval = setInterval(() => {
      setActiveTab((current) => {
        if (current === "dashboard") return "analytics";
        if (current === "analytics") return "qr";
        if (current === "qr") return "bio";
        return "dashboard";
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoCycling]);

  useEffect(() => {
    const interval = setInterval(() => {
      setClickEvents((prev) => {
        const geos = ["France 🇫🇷", "Brazil 🇧🇷", "Canada 🇨🇦", "UK 🇬🇧", "Australia 🇦🇺", "India 🇮🇳", "Singapore 🇸🇬"];
        const links = ["ziplin.io/blog", "ziplin.io/meeting", "ziplin.io/newsletter", "ziplin.io/pricing", "ziplin.io/demo"];
        const targets = ["medium.com/ziplin", "calendly.com/ziplin", "subscribepage.com/zp", "ziplin.io/pricing-plans", "youtube.com/watch"];
        const randomIndex = Math.floor(Math.random() * geos.length);
        const newEvent = {
          id: Date.now(),
          link: links[Math.floor(Math.random() * links.length)],
          target: targets[Math.floor(Math.random() * targets.length)],
          geo: geos[randomIndex],
          time: "just now",
        };
        const updatedPrev = prev.map((e, idx) => ({
          ...e,
          time: idx === 0 ? "3s ago" : idx === 1 ? "6s ago" : "9s ago",
        }));
        return [newEvent, updatedPrev[0], updatedPrev[1]];
      });
      setClicksCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  function shorten() {
    if (!url.trim()) return;
    setLoading(true);
    setResult("");
    setIsAutoCycling(false); // pause auto rotation
    setTimeout(() => {
      const code = Math.random().toString(36).slice(2, 8);
      const shortLink = `ziplin.io/${code}`;
      setResult(shortLink);
      setLoading(false);
      setLinksCreated((prev) => prev + 1);

      setClickEvents((prev) => [
        {
          id: Date.now(),
          link: shortLink,
          target: url,
          geo: "You 🚀",
          time: "just now",
        },
        prev[0],
        prev[1],
      ]);

      setActiveTab("qr");
    }, 800);
  }

  function copy() {
    navigator.clipboard?.writeText(`https://${result}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const renderQrSvg = (value: string, color: string = "#7c3aed") => {
    try {
      const qr = QRCode.create(value || "https://ziplin.io", { errorCorrectionLevel: "M" });
      const moduleCount = qr.modules.size;
      const margin = 2;
      const viewSize = moduleCount + margin * 2;
      const cells = Array.from(qr.modules.data);
      const finderOrigins = [
        { row: 0, col: 0 },
        { row: 0, col: moduleCount - 7 },
        { row: moduleCount - 7, col: 0 },
      ];
      const isFinder = (row: number, col: number) =>
        finderOrigins.some(
          (origin) =>
            row >= origin.row &&
            row < origin.row + 7 &&
            col >= origin.col &&
            col < origin.col + 7
        );

      return (
        <svg
          id="hero-qr-svg"
          width="120"
          height="120"
          viewBox={`0 0 ${viewSize} ${viewSize}`}
          className="mx-auto transition-all duration-300"
        >
          <rect width={viewSize} height={viewSize} fill="#ffffff" rx={2} />
          {cells.map((enabled, index) => {
            if (!enabled) return null;
            const row = Math.floor(index / moduleCount);
            const col = index % moduleCount;
            if (isFinder(row, col)) return null;
            const x = col + margin;
            const y = row + margin;
            return (
              <rect
                key={index}
                x={x + 0.05}
                y={y + 0.05}
                width={0.9}
                height={0.9}
                rx={0.2}
                fill={color}
              />
            );
          })}
          {finderOrigins.map((origin, idx) => {
            const x = origin.col + margin;
            const y = origin.row + margin;
            return (
              <g key={idx}>
                <rect x={x} y={y} width={7} height={7} rx={1} fill={color} />
                <rect x={x + 1} y={y + 1} width={5} height={5} rx={0.5} fill="#ffffff" />
                <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.5} fill={color} />
              </g>
            );
          })}
        </svg>
      );
    } catch {
      return <div className="text-slate-400 text-xs">Generating QR...</div>;
    }
  };

  const downloadQr = () => {
    const svgEl = document.getElementById("hero-qr-svg");
    if (!svgEl) return;
    const source = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "ziplin-qr.svg";
    anchor.click();
    URL.revokeObjectURL(objectUrl);
    setQrScans((prev) => prev + 1);
    setIsAutoCycling(false);
  };

  const triggerBioClick = (name: string) => {
    setBioClicks((prev) => prev + 1);
    setClicksCount((prev) => prev + 1);
    setBioClickedMsg(`Logged: +1 click on "${name}"`);
    setIsAutoCycling(false);
    setTimeout(() => setBioClickedMsg(""), 2000);

  };

  const OVERVIEW_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: Compass },
    { id: "links", label: "Links", icon: Link2 },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "qr", label: "QR Codes", icon: QrCode },
    { id: "bio", label: "Bio Pages", icon: User },
  ] as const;

  const ADVANCED_ITEMS = [
    { id: "campaigns", label: "Campaigns", icon: Target },
    { id: "files", label: "Files", icon: FileText },
    { id: "previews", label: "Link Previews", icon: Eye },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  const ACCOUNT_ITEMS = [
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "help", label: "Help Center", icon: HelpCircle },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 py-18 px-6">
      <div className="pointer-events-none absolute inset-0 opacity-15" style={{
        backgroundImage: "linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }}></div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 xl:col-span-5 text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-1.5 text-xs font-semibold tracking-wide text-violet-700">
              <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse"></span>
              TRUSTED BY 50,000+ WORLDWIDE
            </div>
            <h1 className="mb-6 text-balance text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl leading-[1.08]">
              Shorten Links.
              <br />
              <span className="text-purple-700">
                Amplify Results.
              </span>
            </h1>
            <p className="mb-8 text-base text-slate-600 md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Smart URLs, dynamic QR codes, profile bio pages, and real-time analytics — everything your brand needs in one premium dashboard.
            </p>
            <div className="mb-6 flex flex-col sm:flex-row items-stretch gap-2 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-100/30 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/5 transition-all">
              <div className="flex flex-1 items-center gap-2.5 px-3 py-2 sm:py-0">
                <Link2 className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <input
                  type="url"
                  placeholder="Paste your long URL here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={() => setIsAutoCycling(false)}
                  onKeyDown={(e) => e.key === "Enter" && shorten()}
                  className="w-full bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 text-sm md:text-base"
                />
              </div>
              <button
                onClick={shorten}
                disabled={loading || !url.trim()}
                className="rounded-lg bg-purple-700 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-[0.98] transition-all disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-1.5 flex-shrink-0"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    <span>Shortening...</span>
                  </>
                ) : (
                  <>
                    <span>Shorten</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="mb-8 overflow-hidden"
                >
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-emerald-700">Link shortened successfully!</p>
                        <p className="text-sm font-bold text-slate-800 break-all">https://{result}</p>
                      </div>
                    </div>
                    <button
                      onClick={copy}
                      className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.97] shadow-sm"
                    >
                      {copied ? "Copied!" : "Copy URL"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mb-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/contact"
                className="px-8 py-4 bg-purple-700 text-white hover:bg-[#4338ca] font-bold rounded-lg text-base transition-all shadow-md shadow-indigo-500/10"
              >
                Start for free
              </Link>
              <Link
                to="/pricing"
                className="rounded-lg border border-slate-200 bg-slate-50 px-8 py-4 text-base font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                View pricing
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 text-amber-400">
                  {"★★★★★".split("").map((char, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
                <span className="text-slate-600 font-medium">4.9/5 (2,000+ reviews)</span>
              </div>
              <span className="hidden sm:inline text-slate-300 text-lg">|</span>
              <span className="text-slate-500 font-medium">Free plan available</span>
            </div>
          </div>
          <div className="lg:col-span-6 xl:col-span-7 w-full">
            <div className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl border border-slate-200 bg-slate-50 shadow-[0_0_30px_rgba(0,0,0,0.24)] overflow-hidden text-slate-850">
              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                </div>
                <div className="flex items-center gap-1 rounded bg-slate-100 px-3 py-0.5 text-[9px] text-slate-400 font-mono border border-slate-200/60">
                  <span className="text-slate-300">https://</span>ziplin.io/dashboard
                </div>
                {isAutoCycling ? (
                  <span className="text-[8px] bg-violet-50 text-violet-600 border border-violet-100 rounded px-1.5 py-0.5 font-bold tracking-tight animate-pulse flex items-center gap-1">
                    <span className="h-1 w-1 bg-violet-500 rounded-full animate-ping"></span>
                    Live Demo
                  </span>
                ) : (
                  <div className="w-12"></div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0 min-h-[440px]">
                <div className="hidden md:flex md:col-span-3 flex-col gap-4 border-r border-slate-200 bg-white p-3 text-left">
                  <div className="flex items-center gap-2 px-1">
                    <div className="h-6 w-6 rounded bg-violet-600 flex items-center justify-center font-black text-white text-[10px]">ZP</div>
                    <div>
                      <div className="text-[10px] font-black text-slate-800 leading-none">Ziplin</div>
                      <div className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">unisys</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider px-2">Overview</div>
                    <div className="space-y-0.5 mt-1">
                      {OVERVIEW_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id || (item.id === "links" && activeTab === "dashboard");
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id === "links" ? "dashboard" : item.id);
                              setIsAutoCycling(false);
                            }}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-[9px] font-extrabold transition-all ${isActive
                              ? "bg-violet-50 text-violet-600"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                              }`}
                          >
                            <Icon className="h-3 w-3" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider px-2">Advanced</div>
                    <div className="space-y-0.5 mt-1">
                      {ADVANCED_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setIsAutoCycling(false)}
                            className="w-full flex items-center gap-2 px-2 py-1 text-left text-[9px] font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
                          >
                            <Icon className="h-3 w-3" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-1 mt-auto">
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider px-2">Account</div>
                    <div className="space-y-0.5 mt-1">
                      {ACCOUNT_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setIsAutoCycling(false)}
                            className="w-full flex items-center gap-2 px-2 py-1 text-left text-[9px] font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
                          >
                            <Icon className="h-3 w-3" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex md:hidden items-center justify-between border-b border-slate-200 bg-white px-3 py-2">
                  {[
                    { id: "dashboard", label: "Dashboard", icon: Compass },
                    { id: "analytics", label: "Analytics", icon: TrendingUp },
                    { id: "qr", label: "QR Codes", icon: QrCode },
                    { id: "bio", label: "Bio Pages", icon: User },
                  ].map((tab: any) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsAutoCycling(false);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${isActive ? "bg-violet-50 text-violet-600" : "text-slate-500"
                          }`}
                      >
                        <Icon className="h-3 w-3" />
                        <span>{tab.label.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="col-span-1 md:col-span-9 flex flex-col bg-slate-50/50">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-slate-900 capitalize">
                        {activeTab === "qr" ? "QR Codes" : activeTab === "bio" ? "Bio Pages" : activeTab}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAutoCycling(false)}
                        className="hidden sm:flex items-center gap-1 rounded bg-violet-600 px-2 py-0.5 text-[9px] font-bold text-white shadow hover:bg-violet-700 transition-colors"
                      >
                        <Plus className="h-2.5 w-2.5" />
                        <span>New Link</span>
                      </button>
                      <Search className="h-3 w-3 text-slate-400 cursor-pointer" />
                      <Bell className="h-3 w-3 text-slate-400 cursor-pointer" />
                      <div className="flex items-center gap-1.5 border-l border-slate-200 pl-2">
                        <div className="h-5 w-5 rounded-full bg-violet-500 flex items-center justify-center font-bold text-white text-[9px]">T</div>
                        <div className="hidden sm:block text-left">
                          <div className="text-[9px] font-black text-slate-800 leading-none">test uni</div>
                          <div className="text-[7px] text-slate-400 font-bold mt-0.5">ADMIN</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-3 overflow-y-auto max-h-[390px] flex flex-col justify-start space-y-3">
                    <AnimatePresence mode="wait">
                      {activeTab === "dashboard" && (
                        <motion.div
                          key="dashboard"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                          <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-2.5 flex items-center justify-between gap-3 text-left">
                            <div className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="h-3 w-3" />
                              </div>
                              <p className="text-[9px] text-violet-850 leading-tight">
                                You're on the <span className="font-extrabold">Free plan</span> — unlock unlimited links, custom domains, advanced analytics, and more.
                              </p>
                            </div>
                            <button
                              onClick={() => setIsAutoCycling(false)}
                              className="rounded bg-violet-600 px-2 py-0.5 text-[8px] font-bold text-white hover:bg-violet-750 transition-colors flex-shrink-0"
                            >
                              Upgrade
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h4 className="text-xs font-black text-slate-900 leading-none">Good afternoon, test 👋</h4>
                              <p className="text-[8px] text-slate-400 mt-1 font-medium">Thursday, June 11 · Here's what's happening with your links.</p>
                            </div>
                            <button
                              onClick={() => setIsAutoCycling(false)}
                              className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[9px] font-bold text-slate-700 hover:bg-slate-50 transition-all flex-shrink-0 shadow-sm"
                            >
                              Create Link
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { label: "Total Clicks", value: clicksCount.toLocaleString(), color: "bg-violet-500/10 text-violet-600" },
                              { label: "Links Created", value: linksCreated, color: "bg-sky-500/10 text-sky-600" },
                              { label: "QR Scans", value: qrScans, color: "bg-emerald-500/10 text-emerald-600" },
                              { label: "Bio Views", value: bioClicks, color: "bg-amber-500/10 text-amber-600" },
                            ].map((card, idx) => (
                              <div key={idx} className="rounded-xl border border-slate-200/80 bg-white p-2.5 text-left shadow-sm flex flex-col justify-between min-h-[60px]">
                                <div className="flex items-center justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                                  <span>{card.label}</span>
                                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                </div>
                                <div className="text-sm font-black text-slate-900 font-mono tracking-tight mt-1">
                                  {card.value}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="rounded-xl border border-slate-200/85 bg-white p-3 shadow-sm text-left">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Clicks over time</div>
                                <div className="text-[8px] text-slate-400 mt-1">Daily click volume</div>
                              </div>
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-[8px] font-mono text-slate-500">~{clicksCount.toLocaleString()} total</span>
                            </div>
                            <div className="relative h-20 w-full flex items-end">
                              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                                <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                                <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                                <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
                              </div>
                              <svg className="w-full h-16 relative z-10 overflow-visible" viewBox="0 0 340 100" fill="none">
                                <path
                                  d="M 0 90 Q 40 80, 80 85 T 160 55 T 240 70 T 320 20 T 340 10"
                                  fill="none"
                                  stroke="rgb(139, 92, 246)"
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M 0 90 Q 40 80, 80 85 T 160 55 T 240 70 T 320 20 T 340 10 L 340 100 L 0 100 Z"
                                  fill="url(#chart-grad-light)"
                                />
                                <defs>
                                  <linearGradient id="chart-grad-light" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(139, 92, 246)" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0" />
                                  </linearGradient>
                                </defs>
                                <circle cx="340" cy="10" r="4" fill="rgb(139, 92, 246)" />
                              </svg>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      {activeTab === "analytics" && (
                        <motion.div
                          key="analytics"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
                          <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-left shadow-sm">
                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                              <span>Redirection Event Log</span>
                              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            </div>
                            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                              {clickEvents.map((event) => (
                                <div key={event.id} className="flex items-center justify-between text-[10px] py-1.5 border-b border-slate-100 last:border-0">
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-slate-800 font-bold truncate max-w-[100px]">{event.link}</span>
                                    <span className="text-[7.5px] text-slate-400 truncate max-w-[125px] mt-0.5">→ {event.target}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <span className="bg-slate-50 border border-slate-100 px-1 py-0.5 rounded text-[8.5px] font-bold text-slate-500">{event.geo}</span>
                                    <span className="text-[7.5px] text-slate-400 font-mono">{event.time}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-left shadow-sm flex flex-col justify-between">
                            <div>
                              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Top Referrers</div>
                              <div className="space-y-2.5">
                                {[
                                  { name: "Direct / Email", percent: 62, count: "8.2k clicks", color: "bg-violet-500" },
                                  { name: "google.com", percent: 21, count: "2.7k clicks", color: "bg-sky-500" },
                                  { name: "twitter.com", percent: 12, count: "1.5k clicks", color: "bg-cyan-500" },
                                  { name: "linkedin.com", percent: 5, count: "650 clicks", color: "bg-indigo-500" },
                                ].map((ref, idx) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex items-center justify-between text-[9px] font-bold text-slate-700">
                                      <span>{ref.name}</span>
                                      <span className="text-slate-400 font-normal">{ref.count} ({ref.percent}%)</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                      <div className={`h-full ${ref.color} rounded-full`} style={{ width: `${ref.percent}%` }}></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <p className="text-[7px] text-slate-400 text-center mt-3">Live traffic referrals breakdown</p>
                          </div>
                        </motion.div>
                      )}
                      {activeTab === "qr" && (
                        <motion.div
                          key="qr"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-col items-center justify-center space-y-3 py-1"
                        >
                          <div className="p-3 bg-white rounded-xl shadow border border-slate-200/80 flex items-center justify-center">
                            {renderQrSvg(result ? `https://${result}` : "https://ziplin.io", qrColor)}
                          </div>

                          <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-700">
                              {result ? `https://${result}` : "ziplin.io/demo"}
                            </p>
                            <p className="text-[8px] text-slate-400 mt-0.5">
                              Dynamic QR updates code destination in 1-click.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Accent:</span>
                            <div className="flex gap-1.5">
                              {[
                                { value: "#8b5cf6", name: "violet" },
                                { value: "#06b6d4", name: "cyan" },
                                { value: "#10b981", name: "emerald" },
                                { value: "#d946ef", name: "fuchsia" },
                              ].map((col) => (
                                <button
                                  key={col.value}
                                  onClick={() => {
                                    setQrColor(col.value);
                                    setIsAutoCycling(false);
                                  }}
                                  className={`h-4.5 w-4.5 rounded-full transition-transform ${qrColor === col.value ? "scale-125 ring-2 ring-slate-200" : "hover:scale-110"
                                    }`}
                                  style={{ backgroundColor: col.value }}
                                />
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={downloadQr}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 bg-white text-[9px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                          >
                            <Download className="h-3 w-3" /> Download SVG
                          </button>
                        </motion.div>
                      )}
                      {activeTab === "bio" && (
                        <motion.div
                          key="bio"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-col items-center justify-center py-0.5"
                        >
                          <div className="mx-auto w-[190px] rounded-[24px] border-4 border-slate-800 bg-white p-2.5 shadow-xl text-center overflow-hidden border-slate-800/90">
                            <div className="mx-auto mb-2.5 h-3.5 w-14 rounded-b bg-slate-800"></div>

                            <div className="mx-auto mb-1 h-8 w-8 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 flex items-center justify-center text-[10px] font-black text-white shadow-inner">
                              ZP
                            </div>
                            <div className="text-[10px] font-extrabold text-slate-900 leading-none">@ziplin_brand</div>
                            <div className="text-[7.5px] text-slate-400 mb-2.5 font-medium">Smart link-in-bio page</div>

                            <div className="space-y-1 mb-2">
                              {[
                                { label: "🛒 Shop Summer Sale" },
                                { label: "🎙️ Listen to Podcast" },
                                { label: "📅 Book Consulting" },
                              ].map((link, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => triggerBioClick(link.label.slice(2))}
                                  className="w-full py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-[7.5px] font-bold text-slate-700 transition-all active:scale-[0.97]"
                                >
                                  {link.label}
                                </button>
                              ))}
                            </div>

                            <div className="h-5 flex items-center justify-center">
                              {bioClickedMsg ? (
                                <span className="text-[8px] text-emerald-600 font-extrabold animate-pulse">{bioClickedMsg}</span>
                              ) : (
                                <span className="text-[6.5px] text-slate-400 font-medium">Click buttons to simulate tracking</span>
                              )}
                            </div>
                          </div>

                          <div className="mt-2 text-center">
                            <p className="text-[9px] text-slate-400">
                              Logged <span className="text-slate-700 font-bold">{bioClicks} redirects</span> in this session.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
