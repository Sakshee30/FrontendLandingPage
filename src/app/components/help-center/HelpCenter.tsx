import React from "react";
import { BookOpen, CheckCircle2, Search } from "lucide-react";
import { helpTopics } from "./topics";

export function HelpCenter({
    initialTopicId = "dashboard",
}: {
    initialTopicId?: string;
}) {
    const [query, setQuery] = React.useState("");
    const [activeId, setActiveId] = React.useState(initialTopicId);

    React.useEffect(() => {
        setActiveId(initialTopicId);
    }, [initialTopicId]);

    const filtered = React.useMemo(() => {
        const needle = query.trim().toLowerCase();

        if (!needle) return helpTopics;

        return helpTopics.filter((topic) =>
            `${topic.title} ${topic.category} ${topic.summary}`
                .toLowerCase()
                .includes(needle)
        );
    }, [query]);

    const active =
        helpTopics.find((topic) => topic.id === activeId) ||
        filtered[0] ||
        helpTopics[0];

    return (
        <main className="p-4 md:p-8">
            {/* Hero Section */}
            <section className="mb-6 flex flex-col gap-6 rounded-[20px] border border-[#D7E0EE] bg-gradient-to-br from-white to-[#FFF7D6] p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="mb-2 inline-flex items-center gap-2 text-xs font-black text-[#0E2F73]">
                        <BookOpen size={15} />
                        Help Center
                    </div>

                    <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#081C45]">
                        Every Ziplin feature, explained
                    </h1>

                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#0E2F73]">
                        Search a feature, click a topic, or use any tiny question-mark
                        button in the app to jump here.
                    </p>
                </div>

                <label className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#D7E0EE] bg-white px-4 shadow-lg shadow-[#081C45]/5 lg:max-w-sm">
                    <Search size={18} className="text-[#0E2F73]" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search help..."
                        className="flex-1 border-none bg-transparent text-sm text-[#081C45] outline-none placeholder:text-[#6B7A90]"
                    />
                </label>
            </section>

            {/* Layout */}
            <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
                {/* Sidebar */}
                <aside className="max-h-[calc(100vh-230px)] overflow-y-auto rounded-2xl border border-[#D7E0EE] bg-white p-2">
                    {filtered.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => setActiveId(topic.id)}
                            className={`mb-1 grid w-full cursor-pointer gap-1 rounded-xl px-3 py-3 text-left text-sm transition-colors
                ${active.id === topic.id
                                    ? "bg-[#FFF2B8] text-[#081C45]"
                                    : "text-[#081C45] hover:bg-[#FFF7D6]"
                                }`}
                        >
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#0E2F73]">
                                {topic.category}
                            </span>

                            <strong>{topic.title}</strong>
                        </button>
                    ))}
                </aside>

                {/* Content */}
                <article
                    id={`help-${active.id}`}
                    className="min-h-[420px] rounded-2xl border border-[#D7E0EE] bg-white p-6 md:p-8"
                >
                    <span className="inline-flex rounded-full border border-[#F4B400] bg-[#FFF7D6] px-3 py-1 text-xs font-black text-[#081C45]">
                        {active.category}
                    </span>

                    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#081C45]">
                        {active.title}
                    </h2>

                    <p className="mt-2 mb-6 text-base leading-relaxed text-[#0E2F73]">
                        {active.summary}
                    </p>

                    <h3 className="mb-3 text-base font-black text-[#081C45]">
                        How to use it
                    </h3>

                    <div className="grid gap-2">
                        {active.steps.map((step, index) => (
                            <div
                                key={step}
                                className="flex items-center gap-3 border-b border-[#E5ECF6] py-3 text-sm text-[#081C45]"
                            >
                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#FFC60A] font-black text-[#081C45]">
                                    {index + 1}
                                </span>

                                <span>{step}</span>
                            </div>
                        ))}
                    </div>

                    {active.productionNote && (
                        <div className="mt-6 flex gap-3 rounded-xl border border-[#F4B400] bg-[#FFF7D6] p-4 font-semibold leading-relaxed text-[#081C45]">
                            <CheckCircle2
                                size={18}
                                className="mt-0.5 shrink-0 text-[#F4B400]"
                            />
                            <span>{active.productionNote}</span>
                        </div>
                    )}
                </article>
            </div>
        </main>
    );
}
