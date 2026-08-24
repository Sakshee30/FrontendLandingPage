import { XCircle } from "lucide-react";

export default function PaymentErrorScreen({
    planName,
    message,
    onRetry,
    onDismiss,
}: {
    planName: string;
    message: string;
    onRetry: () => void;
    onDismiss: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-slate-900/55 p-6 backdrop-blur-sm">
            <div
                className="
          w-full max-w-[440px]
          rounded-3xl bg-white
          px-6 py-8 md:px-10 md:py-12
          text-center
          shadow-[0_32px_80px_rgba(0,0,0,0.22)]
          animate-in fade-in zoom-in-95 duration-300
        "
            >
                {/* Error Icon */}
                <div
                    className="
            mx-auto mb-6
            flex h-20 w-20 items-center justify-center
            rounded-full
            bg-gradient-to-br from-red-500 to-red-600
            shadow-[0_12px_32px_rgba(239,68,68,0.4)]
          "
                >
                    <XCircle
                        size={38}
                        className="text-white"
                    />
                </div>

                {/* Title */}
                <h2 className="mb-2 text-3xl font-black text-slate-900">
                    Payment failed
                </h2>

                {/* Description */}
                <p className="mb-2 text-sm leading-6 text-slate-500">
                    We couldn't activate your{" "}
                    <span className="font-bold text-slate-900">
                        {planName}
                    </span>{" "}
                    plan.
                </p>

                {/* Error Message */}
                <div className="mb-7 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                    {message}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={onDismiss}
                        className="
              flex-1 rounded-xl
              border border-slate-200
              bg-white px-4 py-3
              text-sm font-semibold text-slate-600
              transition-colors
              hover:bg-slate-50
            "
                    >
                        Dismiss
                    </button>

                    <button
                        onClick={onRetry}
                        className="
              flex-1 rounded-xl
              bg-red-500 px-4 py-3
              text-sm font-semibold text-white
              shadow-lg shadow-red-500/25
              transition-all
              hover:bg-red-600
              hover:shadow-red-500/35
              active:scale-[0.98]
            "
                    >
                        Try again
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-4 text-xs text-slate-400">
                    If this keeps happening,{" "}
                    <a
                        href="mailto:support@ziplin.io"
                        className="font-semibold text-slate-600 hover:text-slate-900"
                    >
                        contact support
                    </a>
                </p>
            </div>
        </div>
    );
}