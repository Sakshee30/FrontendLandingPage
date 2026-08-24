import React from "react";
import { getPlans, type PublicPlan } from "../../../../app/services/public";
import PlansSkeleton from "./PlansSkeleton";
import PlanCard from "./PlanCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Plans = () => {
    const [plans, setPlans] = React.useState<PublicPlan[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [currentPage, setCurrentPage] = React.useState(0);

    const pageSize = 3;

    React.useEffect(() => {
        getPlans()
            .then((data) => {
                const sorted = [...data].sort((a, b) => a.sortOrder - b.sortOrder);
                setPlans(sorted);
            })
            .catch((err) => console.error("Failed to load plans:", err))
            .finally(() => setLoading(false));
    }, []);

    const totalPages = Math.ceil(plans.length / pageSize);
    const startIndex = currentPage * pageSize;
    const currentPlans = plans.slice(startIndex, startIndex + pageSize);

    return (
        <section className="bg-slate-50/30 py-20 px-6 border-b border-slate-100">
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <PlansSkeleton />
                ) : plans.length === 0 ? (
                    <p className="text-center text-slate-500 font-medium py-12">
                        Plans coming soon.
                    </p>
                ) : (
                    <>
                        {plans.length > pageSize && (
                            <div className="flex justify-end gap-3 mb-8">
                                <button
                                    disabled={currentPage === 0}
                                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Previous plans"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    disabled={currentPage >= totalPages - 1}
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Next plans"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch justify-center">
                            {currentPlans.map((plan) => (
                                <PlanCard key={plan.id} plan={plan} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Plans;