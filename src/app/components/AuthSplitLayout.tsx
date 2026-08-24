import type { ReactNode } from 'react';
import { Link } from 'react-router';


interface Bullet { icon: string; text: string }
interface Panel {
  badge: string;
  headline: ReactNode;
  bullets?: Bullet[];
  quote?: string;
  quoteAuthor?: string;
  quoteRole?: string;
  accent: string;       // CSS gradient string for the glow blob
  accentColor: string;  // single hex for bullets / badge
}

interface AuthSplitLayoutProps {
  panel: Panel;
  children: ReactNode;
  leftContent?: ReactNode;
}

export function AuthSplitLayout({ panel, children, leftContent }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen font-sans">
      {/* ── Left marketing panel ── */}
      <div
        style={{
          background:
            `radial-gradient(ellipse 80% 60% at 20% 20%, ${panel.accent} 0%, transparent 60%),` +
            'radial-gradient(ellipse 60% 50% at 80% 80%, rgba(6,182,212,0.10) 0%, transparent 60%),' +
            '#06040f',
        }}
        className={`flex-[0_0_52%] hidden min-[900px]:flex flex-col justify-between relative overflow-hidden ${leftContent ? 'p-0' : 'p-12 px-14'}`}
      >
        {leftContent ? (
          leftContent
        ) : (
          <>
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:52px_52px]" />

        {/* Logo */}
        <Link to="/" className="no-underline flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#081C45] to-[#0E2F73] flex items-center justify-center shadow-[0_4px_18px_rgba(8,28,69,0.45)] shrink-0">
            <span className="text-white font-black text-lg tracking-[-0.5px]">Z</span>
          </div>
          <span className="text-slate-100 font-extrabold text-xl tracking-[-0.6px]">Ziplin</span>
        </Link>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center z-10 pt-6">
          {/* Badge */}
          <div
            style={{
              background: `${panel.accentColor}18`,
              borderColor: `${panel.accentColor}38`,
              color: panel.accentColor,
            }}
            className="inline-flex items-center gap-1.5 border rounded-full px-3 py-1 mb-5 w-fit text-xs font-semibold tracking-wider"
          >
            <span className="text-[9px]">✦</span> {panel.badge}
          </div>

          {/* Headline */}
          <h2 className="text-[32px] font-black tracking-[-1px] leading-[1.15] text-slate-50 mb-6 max-w-[440px]">
            {panel.headline}
          </h2>

          {/* ── Dashboard Preview Mockup ── */}
          <div className="relative w-full aspect-[4/3] rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md overflow-hidden shadow-2xl flex flex-col mb-8">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2.5 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500/80"></span>
                <span className="h-2 w-2 rounded-full bg-yellow-500/80"></span>
                <span className="h-2 w-2 rounded-full bg-green-500/80"></span>
              </div>
              <div className="flex items-center gap-1 rounded bg-white/5 px-3 py-0.5 text-[9px] text-slate-400 font-mono border border-white/5">
                <span className="text-slate-600">https://</span>ziplin.io/dashboard
              </div>
              <div className="w-12"></div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-1/4 border-r border-white/10 bg-white/[0.01] p-3 space-y-4 hidden sm:block text-left">
                <div className="space-y-1">
                  <div className="h-2 w-10 bg-white/10 rounded mb-2"></div>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-5.5 rounded-md flex items-center gap-2 px-1.5 ${i === 1 ? 'bg-white/5 text-white' : 'text-slate-500'}`}>
                      <div className="h-2.5 w-2.5 rounded bg-white/20"></div>
                      <div className="h-1.5 w-8 bg-white/10 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 pt-1.5">
                  <div className="h-2 w-14 bg-white/10 rounded mb-2"></div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-5.5 rounded-md flex items-center gap-2 px-1.5 text-slate-500">
                      <div className="h-2.5 w-2.5 rounded bg-white/20"></div>
                      <div className="h-1.5 w-10 bg-white/10 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Area */}
              <div className="flex-1 p-3.5 flex flex-col gap-3.5 overflow-hidden">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "Active Links", val: "1,482", trend: "+12.4%", color: "text-[#164BB7]" },
                    { label: "Total Clicks", val: "94.8K", trend: "+28.1%", color: "text-emerald-400" },
                    { label: "Conversion", val: "4.2%", trend: "+3.5%", color: "text-sky-400" }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-xl p-2 text-left">
                      <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xs font-black text-white font-mono tracking-tight">{stat.val}</span>
                        <span className={`text-[8px] font-bold ${stat.color}`}>{stat.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart section */}
                <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-3 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider">Performance Graph</span>
                    </div>
                    <span className="text-[8px] text-emerald-450 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-450 rounded-full animate-pulse"></span> Live Traffic
                    </span>
                  </div>

                  {/* SVG Curve */}
                  <div className="relative h-14 w-full flex items-end mt-1">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 60" fill="none">
                      <path
                        d="M 0 50 Q 30 45, 60 25 T 120 35 T 185 10 T 240 30 T 300 5"
                        fill="none"
                        stroke="#081C45"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 0 50 Q 30 45, 60 25 T 120 35 T 185 10 T 240 30 T 300 5 L 300 60 L 0 60 Z"
                        fill="url(#mockup-chart-grad)"
                      />
                      <defs>
                        <linearGradient id="mockup-chart-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#081C45" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#081C45" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <circle cx="300" cy="5" r="2.5" fill="#081C45" />
                    </svg>
                  </div>
                </div>

                {/* Recent links log */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2.5 text-left">
                  <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-2">Real-Time Redirects</div>
                  <div className="space-y-1.5">
                    {[
                      { from: "ziplin.io/summer", to: "acme.com/summer-sale", geo: "USA 🇺🇸" },
                      { from: "ziplin.io/guide", to: "gitbook.io/ziplin-docs", geo: "DE 🇩🇪" }
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[9px] py-0.5 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-[#164BB7] font-bold truncate max-w-[80px]">{row.from}</span>
                          <span className="text-slate-600 font-black">→</span>
                          <span className="text-slate-400 truncate max-w-[100px]">{row.to}</span>
                        </div>
                        <span className="text-[8px] bg-white/5 border border-white/10 px-1 py-0.25 rounded text-slate-300 font-bold shrink-0">{row.geo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="flex gap-8 z-10 border-t border-white/5 pt-6">
          {[
            { value: '50K+', label: 'Teams' },
            { value: '10M+', label: 'Links' },
            { value: '190+', label: 'Countries' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xl font-black text-slate-100 tracking-[-0.8px]">{s.value}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
          </>
        )}
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#fafafa] p-12 px-6 overflow-y-auto">
        {/* Mobile-only logo */}
        <div className="mb-8 hidden max-[899px]:block">
          <Link to="/" className="no-underline flex items-center gap-2">
            <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#081C45] to-[#0E2F73] flex items-center justify-center">
              <span className="text-white font-black text-base">Z</span>
            </div>
            <span className="text-slate-800 font-extrabold text-lg tracking-[-0.5px]">Ziplin</span>
          </Link>
        </div>

        <div className="w-full max-w-[420px]">
          {children}
        </div>

        <p className="text-xs text-slate-400 mt-9 text-center">
          © {new Date().getFullYear()} Ziplin · <Link to="/pricing" className="text-slate-400 no-underline hover:underline">Pricing</Link>
        </p>
      </div>
    </div>
  );
}

