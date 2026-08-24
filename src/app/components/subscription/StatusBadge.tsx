const STATUS_STYLES: Record<
    string,
    {
        badge: string;
        dot: string;
    }
> = {
    active: {
        badge: "bg-emerald-100 text-emerald-600",
        dot: "bg-emerald-500",
    },
    trialing: {
        badge: "bg-yellow-100 text-yellow-700",
        dot: "bg-yellow-500",
    },
    canceled: {
        badge: "bg-red-100 text-red-700",
        dot: "bg-red-500",
    },
    past_due: {
        badge: "bg-red-100 text-red-700",
        dot: "bg-red-500",
    },
    expired: {
        badge: "bg-gray-100 text-gray-500",
        dot: "bg-gray-400",
    },
};
interface Props {
    status: string;
}

export default function StatusBadge({ status }: Props) {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.expired;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${style.badge}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {status.replace("_", " ")}
        </span>
    );
}