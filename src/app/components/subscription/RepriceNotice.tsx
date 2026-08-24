import { RefreshCw, X } from "lucide-react";

interface Props {
    onDismiss: () => void;
}
export default function RepriceNotice({
    onDismiss,
}: Props) {
    return (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
            <RefreshCw
                size={17}
                className="mt-0.5 shrink-0 text-amber-800"
            />
            <div className="flex-1">
                <h4 className="text-sm font-extrabold text-amber-800">
                    Plan price has been updated
                </h4>

                <p className="mt-1 text-sm leading-relaxed text-amber-700">
                    Your plan price has changed. Please
                    re-subscribe below to continue at the
                    updated rate.
                </p>
            </div>
            <button
                onClick={onDismiss}
                className="shrink-0 rounded-md p-1 text-amber-700 transition-colors hover:bg-amber-100 hover:text-amber-900"
            >
                <X size={16} />
            </button>
        </div>
    );
}