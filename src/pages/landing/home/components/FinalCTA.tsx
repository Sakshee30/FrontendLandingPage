import { Link } from "react-router";
import { Check } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-18 px-6 text-center">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-9 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-5 py-2 text-sm font-medium text-violet-700">
          Free forever on the starter plan
        </div>
        <h2 className="mb-5 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
          Ready to grow{" "}
          <span className="text-purple-600">
            with every link?
          </span>
        </h2>
        <p className="mx-auto mb-12 max-w-3xl text-lg text-slate-600 leading-relaxed">
          Join 50,000+ teams already using Ziplin to shorten, share, and track
          their links.
        </p>
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/signup"
            className="relative overflow-hidden rounded-2xl bg-purple-700 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-600/20 hover:shadow-violet-600/30 hover:scale-105 transition-all duration-200"
          >
            <span className="relative z-10">Start for free — no card needed</span>
            <div className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </Link>

        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
          {[
            "Free plan included",
            "Cancel anytime",
            "Custom domains on Pro",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-slate-600"
            >
              <Check className="h-4 w-4 text-violet-600" /> {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;