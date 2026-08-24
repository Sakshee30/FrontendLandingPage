export default function Stats() {
  const stats = [
    { value: "100M+", label: "Clicks Redirected", color: "text-violet-600 bg-violet-50 border-violet-100/50" },
    { value: "50K+", label: "Active Brands", color: "text-emerald-600 bg-emerald-50 border-emerald-100/50" },
    { value: "< 20ms", label: "Average Latency", color: "text-pink-600 bg-pink-50 border-pink-100/50" },
    { value: "99.99%", label: "Platform Uptime", color: "text-blue-600 bg-blue-50 border-blue-100/50" }
  ];

  return (
    <section className="py-20 px-6 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 p-8 text-center shadow-sm hover:shadow transition-shadow">
              <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-3 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
