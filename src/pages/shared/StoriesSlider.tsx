import { Link } from "react-router";

interface Story {
  title: string;
  quote: string;
  avatar: string;
  name: string;
  role: string;
}

const STORIES: Story[] = [
  {
    title: "Easy To Manage",
    quote: "Ziplin makes managing our product links seamless. Dynamic QR codes and custom domains keep our customers engaged, motivated, and on track with our promotions every day.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Aman Sharma",
    role: "Founder | StudyIAS",
  },
  {
    title: "My Go-To Platform",
    quote: "We switched from Linktree to Ziplin's custom bio pages and saw a 35% click increase. Setup took less than a minute — it is easily our go-to link platform.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Ankur Warikoo",
    role: "Coach",
  },
  {
    title: "Everything In One Place",
    quote: "With Ziplin, we've scaled our product links to reach millions of buyers across countries. The ease of managing redirects allowed us to focus more on creation and less on operations.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Aarushi Bedi",
    role: "Founder | The Fluent Flyers",
  },
  {
    title: "Reliable Partner",
    quote: "This is a reliable partner you can depend on. Instant redirects, real-time UTM analytics, and clean short links have saved our marketing team time and money.",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Atish Mathur",
    role: "Educator",
  },
  {
    title: "Deep Insights",
    quote: "We track everything in real-time. Knowing exactly where our clicks are coming from globally helps us run hyper-targeted campaigns and double our conversion rates.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    name: "Sarah Chen",
    role: "Digital Marketer",
  },
];

export default function StoriesSlider() {
  // Duplicate stories to make infinite marquee effect seamless
  const duplicatedStories = [...STORIES, ...STORIES, ...STORIES];

  return (
    <section className="bg-white py-18 px-6 overflow-hidden relative border-b border-slate-100">
      {/* Styles for infinite scrolling marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl text-center mb-16">

        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
          Everything Creators Need<br />To Monetize Their Audience
        </h2>
        <p className="max-w-3xl mx-auto text-slate-500 font-medium leading-relaxed text-sm md:text-base mb-8">
          From bio pages and link shorteners to QR codes and deep analytics—Ziplin gives you everything you need to grow your online presence and earn from your content.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="rounded-lg border border-slate-200 bg-slate-50 px-8 py-4 text-base font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
          >
            Start Your Free Trial
          </Link>
          <Link
            to="/contact"
            className="px-8 py-4 bg-purple-700 text-white hover:bg-[#4338ca] font-bold rounded-lg text-base transition-all shadow-md shadow-indigo-500/10"
          >
            Book A Demo
          </Link>
        </div>
      </div>

      {/* Infinite slider container */}
      <div className="relative w-full overflow-hidden">
        {/* Left/Right soft fading gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 hidden md:block"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 hidden md:block"></div>

        <div className="flex gap-6 animate-marquee w-max py-4">
          {duplicatedStories.map((story, idx) => (
            <div
              key={idx}
              className="w-[340px] flex-shrink-0 rounded-[32px] bg-[#f8fafc] border border-slate-100/50 p-8 shadow-sm flex flex-col justify-between h-[320px] transition-all hover:scale-[1.01] hover:shadow-md"
            >
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {story.title}
                </h3>
                <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                  {story.quote}
                </p>
              </div>

              {/* Author footer */}
              <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-200/50">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-12 h-12 rounded-full object-cover shadow-sm bg-slate-100"
                  loading="lazy"
                />
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900">
                    {story.name}
                  </div>
                  <div className="text-xs font-semibold text-slate-400 mt-0.5">
                    {story.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
