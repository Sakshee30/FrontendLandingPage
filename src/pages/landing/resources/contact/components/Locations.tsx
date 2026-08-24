import { Clock, Globe } from "lucide-react";

export default function Locations() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto bg-slate-50/50 border border-slate-200 p-8 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-650 shadow-inner">
          <Globe className="w-7 h-7" />
        </div>
        <div className="text-left flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Global Support Coverage</h3>
          <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4">
            Our platform engineers are distributed across US Eastern (EST), European Central (CET), and Asia Pacific (SGT) timezones to monitor Ziplin's edge redirects and provide support coverage round-the-clock.
          </p>
          <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-450" />
              Active Uptime: 24/7/365
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-450" />
              Response SLA: &lt; 1 Hour
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
