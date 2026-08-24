const testimonials = [
  {
    quote: 'Fast, stable, and the support is incredible. I’ve never seen a SaaS respond so quickly. Ziplin has become indispensable for all my campaigns.',
    lines: ['“Fast, stable, and the support is incredible.', 'I’ve never seen a SaaS respond so quickly.', 'Ziplin has become indispensable for all my', 'campaigns.”'],
    name: 'Jacob D.',
    role: 'Small Business Owner',
    tone: 'border-[rgba(253,106,94,.4)] bg-[rgba(253,106,94,.03)]',
    avatar: { width: 30, imageWidth: '501.96%', imageHeight: '257.93%', left: '-101.31%', top: '-11.34%' },
  },
  {
    quote: 'The most affordable fully-featured URL shortener I’ve found. It even supports non-English slugs and has working splash pages. A truly complete product.',
    lines: ['“The most affordable fully-featured URL', 'shortener I’ve found. It even supports non-', 'English slugs and has working splash', 'pages. A truly complete product.”'],
    name: 'Jimmy G.',
    role: 'Marketing Manager',
    tone: 'border-[rgba(59,130,246,.4)] bg-[rgba(59,130,246,.03)]',
    avatar: { width: 31, imageWidth: '502.51%', imageHeight: '257.41%', left: '-196.85%', top: '-128.52%' },
  },
  {
    quote: 'Switched from Linktree and Bitly and never looked back. Custom domains, bio pages, branded downloads, tracking pixels — it’s all here. Support is lightning fast.',
    lines: ['“Switched from Linktree and Bitly and', 'never looked back. Custom domains, bio', 'pages, branded downloads, tracking pixels', '— it’s all here. Support is lightning fast.”'],
    name: 'Travis L.',
    role: 'Digital Marketing Manager',
    tone: 'border-[rgba(168,85,247,.4)] bg-[rgba(168,85,247,.03)]',
    avatar: { width: 31, imageWidth: '502.51%', imageHeight: '257.41%', left: '-294.04%', top: '-128.13%' },
  },
  {
    quote: 'So much more than a link shortener. The dashboard is intuitive and all features are presented in a design that just makes sense.',
    lines: ['“So much more than a link shortener. The', 'dashboard is intuitive and all features are', 'presented in a design that just makes', 'sense.”'],
    name: 'Jeff B.',
    role: 'Small Business Owner',
    tone: 'border-[rgba(16,185,129,.4)] bg-[rgba(16,185,129,.03)]',
    avatar: { width: 31, imageWidth: '502.51%', imageHeight: '257.41%', left: '-391.53%', top: '-129.13%' },
  },
];

export function Testimonials() {
  const reviewRail = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-14 overflow-hidden bg-white px-8 py-20 xl:flex-row xl:items-center xl:justify-between xl:gap-14 xl:pb-0 xl:pt-28">
      <style>{`
        @keyframes ziplin-testimonial-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }

        #testimonials .testimonial-review-rail {
          animation: ziplin-testimonial-scroll 24s linear infinite;
        }

        #testimonials .testimonial-review-rail:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="flex w-full max-w-[576px] shrink-0 flex-col gap-[72px] xl:w-[576px]">
        <div className="w-full p-2">
          <span className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-base leading-6 text-ziplin-navy shadow-[1px_1px_.05px_rgba(0,0,0,.25)]">
            <span className="size-[9px] rounded-full bg-[#ffc83d]" />
            TESTIMONIAL
          </span>
          <h2 className="mt-16 w-full max-w-[552px] font-display text-[38px] leading-tight text-ziplin-navy sm:text-[48px] sm:leading-[60px]">
            Creators are <span className="text-ziplin-yellow">obsessed<br />with Ziplin</span>
          </h2>
        </div>

        <div className="relative h-[576px] w-full max-w-[448px] shrink-0 overflow-hidden">
          <img
            src="/figma-assets/testimonial-mascot.png"
            alt="Ziplin mascot giving a thumbs-up beside a five-star rating"
            className="absolute left-[-50.86%] top-0 h-full w-[160.6%] max-w-none"
          />
        </div>
      </div>

      <div className="h-[840px] w-full max-w-[352px] shrink-0 overflow-hidden xl:w-[352px]">
        <div className="testimonial-review-rail flex flex-col gap-14">
          {reviewRail.map((item, railIndex) => (
            <article key={`${item.name}-${railIndex}`} className={`h-[192px] w-full shrink-0 rounded-xl border-[1.2px] p-6 ${item.tone}`}>
              <p className="w-[288px] max-w-full text-base leading-6 text-[#4b5563] xl:hidden">“{item.quote}”</p>
              <p className="hidden w-[288px] max-w-full text-[14px] leading-6 text-[#4b5563] xl:block">
                {item.lines.map((line, index) => (
                  <span key={line}>{line}{index < item.lines.length - 1 ? <br /> : null}</span>
                ))}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="relative h-10 shrink-0 overflow-hidden rounded-full" style={{ width: item.avatar.width }}>
                  <img
                    src="/figma-assets/testimonial-avatars.png"
                    alt=""
                    className="absolute max-w-none"
                    style={{
                      width: item.avatar.imageWidth,
                      height: item.avatar.imageHeight,
                      left: item.avatar.left,
                      top: item.avatar.top,
                    }}
                  />
                </div>
                <div>
                  <strong className="block text-[11px] font-semibold leading-5 text-[#111827]">{item.name}</strong>
                  <span className="block text-[10px] leading-4 text-[#6b7280]">{item.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
