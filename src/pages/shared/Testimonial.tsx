import { useRef } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";



const Testimonials = ({ testimonials }: { testimonials: any[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: "left" | "right") => {
        const container = scrollRef.current;
        if (!container) return;
        const cardElement = container.firstElementChild as HTMLElement;
        const cardWidth = cardElement?.clientWidth || 360;
        const gap = 24; // gap-6 is 24px
        const scrollAmount = direction === "left" ? -(cardWidth + gap) : (cardWidth + gap);
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    return (
        <section className="bg-gradient-to-b from-slate-50 to-white py-18 px-6 overflow-hidden relative">
            <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

            <div className="mx-auto max-w-7xl">

                {/* Header and Controls */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
                    <div className="text-left">
                        <div className="mb-4 inline-block rounded-full border border-violet-500/20 bg-violet-500/5 px-5 py-1.5 text-xs font-semibold tracking-wide text-violet-700">
                            TESTIMONIALS
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                            Loved by teams everywhere
                        </h2>
                    </div>
                    <div className="flex gap-3 mt-6 sm:mt-0">
                        <button
                            onClick={() => handleScroll("left")}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm active:scale-95 transition-all cursor-pointer"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => handleScroll("right")}
                            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm active:scale-95 transition-all cursor-pointer"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Track Container */}
                <div className="relative">
                    {/* Edge fades for professional slider aesthetics */}
                    <div className="pointer-events-none absolute inset-y-0 -left-6 w-12 bg-gradient-to-r from-slate-50/20 to-transparent z-10 hidden md:block"></div>
                    <div className="pointer-events-none absolute inset-y-0 -right-6 w-12 bg-gradient-to-l from-white/20 to-transparent z-10 hidden md:block"></div>

                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory py-4"
                    >
                        {testimonials.map((t, idx) => (
                            <div
                                key={idx}
                                className="w-[300px] sm:w-[360px] flex-shrink-0 snap-start relative rounded-3xl border border-slate-200/80 bg-white p-8 shadow-lg shadow-slate-100/30 hover:shadow-xl hover:border-slate-300 hover:scale-[1.01] transition-all flex flex-col justify-between"
                            >
                                {/* Large Decorative Quote icon */}
                                <Quote className="absolute right-6 top-6 h-14 w-14 text-slate-50/80 pointer-events-none z-0" />

                                <div className="relative z-10">
                                    {/* Stars */}
                                    <div className="mb-5 flex gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <span key={i} className="text-amber-400 text-base">
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    {/* Quote text */}
                                    <p className="mb-8 text-base text-slate-600 leading-relaxed italic text-left">
                                        "{t.quote}"
                                    </p>
                                </div>

                                {/* Author Info */}
                                <div className="relative z-10 flex items-center gap-4 mt-auto border-t border-slate-100 pt-5">
                                    <div
                                        className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${t.border} ${t.bg} text-sm font-bold ${t.color}`}
                                    >
                                        {t.avatar}
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-slate-900">
                                            {t.name}
                                        </div>
                                        <div className="text-xs font-semibold text-slate-500 mt-0.5">
                                            {t.role} · {t.company}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Testimonials;