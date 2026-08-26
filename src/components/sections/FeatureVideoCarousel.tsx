import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { Link } from 'react-router-dom';

const featureSlides = [
  {
    name: 'Link Shortener',
    title: 'LINK SHORTENER',
    description: 'Create clean, memorable links and track every click in real time.',
    video: '/figma-assets/feature-link-shortener-20260826-v5.mp4',
    to: '/features/url-shortener',
    cta: 'Own Your Link',
  },
  {
    name: 'UTM Tracking',
    title: 'UTM TRACKING',
    description: 'Build consistent campaign links and understand which channels drive results.',
    video: '/figma-assets/feature-utm-tracking-20260825.mp4',
    to: '/features/utm-tracking',
    cta: "Let's Analyze",
  },
  {
    name: 'QR Code Generator',
    title: 'QR CODE GENERATOR',
    description: 'Create dynamic QR codes you can update, customize, and measure anytime.',
    video: '/figma-assets/feature-qr-generator-20260825.mp4',
    to: '/features/qr-code-generator',
    cta: 'Launch Your QR',
  },
  {
    name: '2D Barcode',
    title: '2D BAR CODE',
    description: 'Connect products and packaging to rich, trackable digital experiences.',
    video: '/figma-assets/feature-2d-barcode-20260825-v3.mp4',
    to: '/features/2d-barcode',
    cta: 'Code It Up',
  },
  {
    name: 'File Sharing',
    title: 'FILE SHARING',
    description: 'Share large files securely through branded links with complete control.',
    video: '/figma-assets/feature-file-sharing-20260825-v2.mp4',
    to: '/features/file-sharing',
    cta: 'Share the Magic',
  },
] as const;

const swipeThreshold = 48;

export function FeatureVideoCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const slide = featureSlides[currentSlide];

  const goTo = useCallback((index: number) => {
    setCurrentSlide((index + featureSlides.length) % featureSlides.length);
  }, []);
  const previous = useCallback(() => goTo(currentSlide - 1), [currentSlide, goTo]);
  const next = useCallback(() => goTo(currentSlide + 1), [currentSlide, goTo]);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
  };

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) >= swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) next();
      else previous();
    }
  };

  return (
    <section
      id="landing-hero"
      role="region"
      aria-roledescription="carousel"
      aria-label="Ziplin features"
      aria-live="polite"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="feature-video-carousel relative select-none overflow-hidden bg-transparent text-white outline-none"
    >
      <div className="relative mx-auto min-h-[640px] w-full max-w-[1440px] overflow-hidden sm:aspect-[800/375] sm:min-h-0">
        <video
          key={slide.video}
          src={slide.video}
          aria-label={`${slide.name} animated feature`}
          className="absolute inset-0 size-full object-cover [filter:contrast(1.035)_saturate(1.04)]"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />

        <div
          className="relative z-10 flex min-h-[330px] w-full flex-col justify-center bg-transparent px-7 pb-24 pt-12 shadow-none backdrop-blur-0 sm:absolute sm:inset-y-0 sm:left-0 sm:min-h-0 sm:w-[43%] sm:px-[5.5%] sm:pb-[8%] sm:pt-[5%]"
          style={{
            background: 'transparent',
            backdropFilter: 'none',
            transform: slide.name === 'UTM Tracking' || slide.name === '2D Barcode' ? 'translateY(13%)' : 'translateY(16%)',
          }}
        >
          <p className="font-mono text-[11px] font-bold uppercase tracking-[.14em] text-[#ffc60a] sm:text-[13px]">ZIPLIN FEATURES</p>
          <h1 className="mt-4 max-w-[430px] font-display text-[38px] leading-[1.02] text-white sm:text-[clamp(34px,4vw,64px)]">
            {slide.title}
          </h1>
          <p className="mt-5 max-w-[390px] text-sm leading-6 text-white/75 sm:text-[clamp(13px,1.2vw,18px)] sm:leading-[1.45]">
            {slide.description}
          </p>
          <Link
            to={slide.to}
            aria-label={`${slide.cta} — open ${slide.name}`}
            className="mt-7 inline-flex h-11 w-fit items-center justify-center rounded-[7px] border-2 border-[#081c45] bg-[#ffc60a] px-5 text-sm font-bold text-[#081c45] shadow-[4px_4px_0_rgba(255,255,255,.16)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {slide.cta}
          </Link>
        </div>

        <span className="sr-only">{slide.name}, feature {currentSlide + 1} of {featureSlides.length}</span>

        <div className="absolute inset-x-0 bottom-[5.8%] z-20 flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Previous feature"
            onClick={previous}
            className="flex size-9 items-center justify-center rounded-[7px] border border-[#4d7799] bg-[#315875]/85 text-white/85 shadow-[0_0_18px_rgba(255,198,10,.12)] transition hover:border-[#ffc60a] hover:bg-[#f4b400] hover:text-[#081c45] sm:size-11"
          >
            <ChevronLeft className="size-5 sm:size-7" strokeWidth={3} />
          </button>

          <div className="flex items-center gap-2.5 rounded-full bg-[#071b39]/45 px-2 py-2 backdrop-blur-sm">
            {featureSlides.map((item, index) => (
              <button
                key={item.name}
                type="button"
                aria-label={`Go to ${item.name} feature`}
                aria-current={currentSlide === index ? 'true' : undefined}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full border transition-[width,background-color,border-color] duration-300 ${
                  currentSlide === index
                    ? 'w-8 border-[#fff2a8] bg-[#ffc60a]'
                    : 'w-2.5 border-[#7891aa] bg-[#5d7893]/75 hover:border-[#ffc60a]'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next feature"
            onClick={next}
            className="flex size-9 items-center justify-center rounded-[7px] border border-[#4d7799] bg-[#315875]/85 text-white/85 shadow-[0_0_18px_rgba(255,198,10,.12)] transition hover:border-[#ffc60a] hover:bg-[#f4b400] hover:text-[#081c45] sm:size-11"
          >
            <ChevronRight className="size-5 sm:size-7" strokeWidth={3} />
          </button>
        </div>
      </div>
    </section>
  );
}
