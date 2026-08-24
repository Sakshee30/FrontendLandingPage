import { Link } from "react-router";
import { Check, ArrowRight } from "lucide-react";

const Showcase = () => {
  const bars = [55, 72, 48, 88, 65, 95, 78, 60, 82, 70, 91, 58, 74, 86];
  return (
    <section className="bg-slate-50 py-18 px-6">
      <div className="mx-auto max-w-6xl grid gap-16 items-center lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_0_30px_rgba(0,0,0,0.24)] overflow-hidden">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900">
                Link Analytics
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Last 14 days
              </div>
            </div>
            <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-700">
              ↑ 24.3%
            </div>
          </div>
          <div className="mb-8 grid grid-cols-3 gap-4">
            {[
              { label: "Total Clicks", value: "24,891" },
              { label: "Unique", value: "18,234" },
              { label: "CTR", value: "73.2%" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {s.value}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mb-3 flex h-24 items-end gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg transition-all duration-300"
                style={{
                  height: `${h}%`,
                  background:
                    i === bars.length - 3
                      ? "linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)"
                      : "rgba(124,58,237,0.25)",
                }}
              />
            ))}
          </div>
          <div className="pt-5 border-t border-slate-200">
            <div className="mb-4 text-xs font-semibold text-slate-500">
              Top links
            </div>
            {[
              { slug: "ziplin.io/sale23", clicks: "8.2k" },
              { slug: "ziplin.io/launch", clicks: "5.1k" },
              { slug: "ziplin.io/app", clicks: "4.4k" },
            ].map((link) => (
              <div
                key={link.slug}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-violet-500"></div>
                  <span className="text-sm text-slate-600">
                    {link.slug}
                  </span>
                </div>
                <span className="text-sm font-semibold text-violet-600">
                  {link.clicks}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-5 inline-block rounded-full border border-violet-500/25 bg-violet-500/10 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-violet-700">
            Analytics
          </div>
          <h2 className="mb-6 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Know exactly who's
            <br />
            clicking your links
          </h2>
          <p className="mb-10 text-base text-slate-600 leading-relaxed">
            Real-time dashboards give you a complete picture — click volume,
            unique visitors, top countries, devices, referrers, and more.
          </p>
          {[
            "Live click tracking updated every second",
            "Country, city, device & browser breakdown",
            "Referrer & UTM campaign attribution",
            "Export reports to CSV or PDF",
          ].map((item) => (
            <div
              key={item}
              className="mb-4 flex items-center gap-4"
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-700">
                <Check className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm text-slate-600">
                {item}
              </span>
            </div>
          ))}
          <Link
            to="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-purple-700 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 transition-all hover:scale-105"
          >
            Explore analytics
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Showcase;