interface Props {
    value: "monthly" | "yearly";
    onChange: (v: "monthly" | "yearly") => void;
    discount: number;
}

export default function BillingToggle({
    value,
    onChange,
    discount,
}: Props) {
    return (
        <div className="inline-flex items-center rounded-xl bg-slate-100 p-1">
            {(["monthly", "yearly"] as const).map((period) => {
                const isActive = value === period;

                return (
                    <button
                        key={period}
                        onClick={() => onChange(period)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-150 ${isActive
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                            }
            `}
                    >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                        {period === "yearly" && discount > 0 && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-extrabold text-emerald-600">
                                -{discount}%
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}