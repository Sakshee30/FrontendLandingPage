export default function PlansSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-3xl p-8 h-[420px] animate-pulse"
        />
      ))}
    </div>
  );
}
