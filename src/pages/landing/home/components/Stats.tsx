const Stats = () => {
  const stats = [
    { value: "10M+", label: "Links shortened" },
    { value: "2M+", label: "QR codes generated" },
    { value: "50K+", label: "Teams using Ziplin" },
    { value: "190+", label: "Countries reached" },
  ];
  return (
    <section className="bg-slate-50 py-20 px-6">
      <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="py-6 text-center first:md:pl-0 md:px-8 md:py-0"
          >
            <div className="mb-1 bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 bg-clip-text text-4xl font-black tracking-tighter text-transparent md:text-5xl">
              {s.value}
            </div>
            <div className="text-sm text-slate-600">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;