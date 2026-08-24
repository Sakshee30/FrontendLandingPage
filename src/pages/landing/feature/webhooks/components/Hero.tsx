import { Link } from "react-router";
import {
  Webhook,
  ArrowRight,
  Zap,
  Shield,
  RefreshCw,
  CheckCircle2,
  Terminal,
  Activity
} from "lucide-react";

export default function Hero() {
  const events = [
    { name: "link.clicked", status: "Active", icon: CheckCircle2, active: true },
    { name: "link.created", status: "Active", icon: CheckCircle2, active: true },
    { name: "qr.scanned", status: "Active", icon: CheckCircle2, active: true },
    { name: "campaign.updated", status: "Inactive", icon: RefreshCw, active: false },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/50 py-20 lg:py-24 px-6 border-b border-slate-100">
      <div className="relative z-10 mx-auto max-w-7xl grid gap-16 items-center lg:grid-cols-2">
        <div className="text-left">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-5 py-2 text-sm font-semibold text-purple-700">
            <Webhook className="w-4 h-4 text-purple-600" />
            Webhooks
          </div>

          {/* Headline */}
          <h1 className="mb-8 text-balance text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight text-slate-900 leading-[1.08]">
            Integrate Ziplin with
            <span className="text-purple-600 block mt-2">
              your workflow
            </span>
          </h1>

          <p className="mb-12 max-w-xl text-lg text-slate-650 leading-relaxed font-medium">
            Get real-time notifications when clicks happen, links are created, or campaigns are updated. Build powerful integrations with your existing tools.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-5 mb-14">
            <Link
              to="/signup"
              className="rounded-lg bg-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-600/20 hover:shadow-violet-600/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Start for free
            </Link>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, label: "Real-time" },
              { icon: Shield, label: "Secure" },
              { icon: RefreshCw, label: "Retries" },
              { icon: CheckCircle2, label: "Reliable" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-sm hover:shadow transition-shadow duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-650 border border-purple-100/30 flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-700 leading-tight">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Webhook visual */}
        <div className="relative">
          <div className="relative mx-auto max-w-md rounded-[2.5rem] border border-slate-200/80 bg-white/85 backdrop-blur-md p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)]">
            <div className="flex items-center gap-1.5 mb-6 pb-4 border-b border-slate-100">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
              <span className="ml-4 text-[10px] font-mono text-slate-400">ziplin.io/settings/webhooks</span>
            </div>

            {/* Webhook header */}
            <div className="mb-6 text-left">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Webhook Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Listen for events in real-time</p>
            </div>

            {/* Events list */}
            <div className="space-y-3 mb-6 text-left">
              {events.map((event, index) => (
                <div key={index} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg border ${event.active
                      ? "bg-emerald-50 border-emerald-100/50 text-emerald-600"
                      : "bg-slate-50 border-slate-100 text-slate-400"
                      }`}>
                      <event.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{event.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${event.active
                    ? "bg-purple-50 text-purple-750 border-purple-100/30"
                    : "bg-slate-50 text-slate-500 border-slate-100"
                    }`}>{event.status}</span>
                </div>
              ))}
            </div>

            {/* Log entry */}
            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5 text-left shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-purple-700 mb-3">
                <Terminal className="w-4 h-4" />
                Recent Webhook Dispatch
              </div>
              <div className="text-xs font-mono text-slate-700 bg-white border border-purple-100/30 rounded-xl p-3.5 break-all shadow-inner">
                <span className="text-purple-600 font-bold">POST</span> /webhook/xyz → <span className="text-emerald-600 font-bold">200 OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
