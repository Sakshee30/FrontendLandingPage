import { CheckCircle2, Zap, Code2, Shield } from "lucide-react";

export default function Showcase() {
  return (
    <section className="bg-white py-18 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-20 items-center lg:grid-cols-2 mb-28">
          <div>
            <div className="mb-6 inline-block rounded-full border border-purple-500/25 bg-purple-500/10 px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-purple-700">
              Webhook Logs
            </div>
            <h3 className="mb-8 text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Full visibility into
              <br />
              every webhook
            </h3>
            <p className="mb-10 text-lg text-slate-600 leading-relaxed">
              See every webhook delivery, retry, and failure in one place. Replay failed webhooks and debug issues quickly.
            </p>
            <div className="space-y-4">
              {[
                "Replay failed webhooks with one click",
                "View full request and response details",
                "Inspect payloads and headers",
                "Monitor webhook health in real-time"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logs mockup */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)]">
              <div className="mb-8 flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-900">Recent Deliveries</h4>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
                    Last 24h
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { event: "link.clicked", status: "Success", time: "2min ago", color: "emerald" },
                  { event: "qr.scanned", status: "Success", time: "15min ago", color: "emerald" },
                  { event: "link.created", status: "Success", time: "1h ago", color: "emerald" },
                  { event: "campaign.updated", status: "Failed", time: "2h ago", color: "red" },
                ].map((log, index) => (
                  <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-800">{log.event}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${log.color === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }`}>{log.status}</span>
                        <span className="text-xs text-slate-500">{log.time}</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 font-mono bg-slate-50 rounded-lg p-2">
                      POST https://your-domain.com/webhook
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "Real-time Delivery",
              description: "Webhooks are delivered instantly as events happen in your Ziplin workspace.",
            },
            {
              icon: Code2,
              title: "Developer Friendly",
              description: "Well-documented API, SDKs, and examples for every popular programming language.",
            },
            {
              icon: Shield,
              title: "Enterprise Ready",
              description: "Security, reliability, and scalability to power your most important integrations.",
            },
          ].map((item, index) => (
            <div key={index} className="rounded-3xl border border-slate-200 bg-white p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                <item.icon className="w-7 h-7" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-slate-900">
                {item.title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
