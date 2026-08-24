import clsx from 'clsx';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Sparkles, Target, Zap } from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import type { FeatureDefinition } from '@/data/types';
import { Reveal } from '@/components/ui/Reveal';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { DrivingMascotCar } from '@/components/ui/DrivingMascotCar';

const tones = {
  cream: 'bg-[#fffcf0] border-[#f2e6bb]',
  lilac: 'bg-[#f1efff] border-[#ded8ff]',
  mint: 'bg-[#ecfbf2] border-[#ccefd9]',
};

const VEHICLE_WIDTH = 164;
const VEHICLE_HEIGHT = 131;
// The perspective render's wheelbase is left of the bitmap center.
const VEHICLE_AXLE_X = 57;
const VEHICLE_AXLE_Y = 98;
const VEHICLE_AXLE_ORIGIN = `${(VEHICLE_AXLE_X / VEHICLE_WIDTH) * 100}% ${(VEHICLE_AXLE_Y / VEHICLE_HEIGHT) * 100}%`;

function normalizeAngle(angle: number) {
  return ((angle + 180) % 360 + 360) % 360 - 180;
}

export function FeatureRoadmap({ feature }: { feature: FeatureDefinition }) {
  const roadmapRef = useRef<HTMLDivElement>(null);
  const mascotPathRef = useRef<SVGPathElement>(null);
  const previousProgressRef = useRef(0);
  const scrollDirectionRef = useRef<1 | -1>(1);
  const turnRevolutionsRef = useRef(0);
  const [connector, setConnector] = useState({ path: '', width: 1120, height: 1500 });
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: roadmapRef,
    offset: ['start 82%', 'end 38%'],
  });
  const connectorProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.35,
  });
  const mascotX = useMotionValue(0);
  const mascotY = useMotionValue(0);
  const mascotHeading = useMotionValue(0);
  const mascotSpinTarget = useMotionValue(0);
  const mascotRoadAngleTarget = useMotionValue(0);
  const mascotFacing = useSpring(mascotHeading, { stiffness: 300, damping: 26, mass: 0.36 });
  const mascotSpin = useSpring(mascotSpinTarget, { stiffness: 105, damping: 18, mass: 0.7 });
  const mascotRoadAngle = useSpring(mascotRoadAngleTarget, { stiffness: 230, damping: 29, mass: 0.42 });
  const scrollVelocity = useVelocity(connectorProgress);
  const suspensionTarget = useTransform(scrollVelocity, (velocity) => reduceMotion ? 0 : -Math.min(2.2, Math.abs(velocity) * 3.2));
  const suspension = useSpring(suspensionTarget, { stiffness: 240, damping: 24, mass: 0.38 });
  const accelerationPitchTarget = useTransform(scrollVelocity, (velocity) => reduceMotion ? 0 : Math.max(-2.5, Math.min(2.5, velocity * -4.5)));
  const accelerationPitch = useSpring(accelerationPitchTarget, { stiffness: 190, damping: 25, mass: 0.42 });
  const roadProgress = useTransform(connectorProgress, (progress) => reduceMotion ? 1 : Math.min(1, progress + 0.16));
  const drivingBounce = useTransform(connectorProgress, (progress) => reduceMotion ? 0 : Math.abs(Math.sin(progress * Math.PI * 44)) * -0.9);
  const laneDashOffset = useTransform(connectorProgress, (progress) => reduceMotion ? 0 : progress * -260);

  useLayoutEffect(() => {
    const roadmap = roadmapRef.current;
    if (!roadmap) return;

    const measure = () => {
      const cards = Array.from(roadmap.querySelectorAll<HTMLElement>('[data-roadmap-card]'));
      if (cards.length < 2) return;

      const points = cards.map((card, index) => {
        const row = card.parentElement as HTMLElement;
        return {
          x: index % 2 === 0 ? card.offsetLeft + card.offsetWidth : card.offsetLeft,
          y: row.offsetTop + card.offsetTop + card.offsetHeight / 2,
        };
      });

      const path = points.slice(1).reduce((value, point, index) => {
        const previous = points[index];
        const controlX = (previous.x + point.x) / 2;
        return `${value} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
      }, `M ${points[0].x} ${points[0].y}`);

      setConnector({ path, width: roadmap.clientWidth, height: roadmap.clientHeight });
    };

    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(roadmap);
    roadmap.querySelectorAll<HTMLElement>('[data-roadmap-card]').forEach((card) => resizeObserver.observe(card));
    return () => resizeObserver.disconnect();
  }, [feature]);

  useLayoutEffect(() => {
    let frame = 0;

    const placeMascot = (progress: number) => {
      const path = mascotPathRef.current;
      if (!path || !connector.path) return;

      const totalLength = path.getTotalLength();
      const distance = Math.max(0, Math.min(totalLength, progress * totalLength));
      const point = path.getPointAtLength(distance);
      const progressChange = progress - previousProgressRef.current;
      if (Math.abs(progressChange) > 0.00015) {
        const nextDirection = progressChange > 0 ? 1 : -1;
        if (nextDirection !== scrollDirectionRef.current) {
          if (nextDirection === -1 && !reduceMotion) {
            turnRevolutionsRef.current += 360;
            mascotSpinTarget.set(turnRevolutionsRef.current);
          }
          scrollDirectionRef.current = nextDirection;
        }
      }
      const sampleDistance = 22;
      const behindDistance = Math.max(0, Math.min(totalLength, distance - scrollDirectionRef.current * sampleDistance));
      const aheadDistance = Math.max(0, Math.min(totalLength, distance + scrollDirectionRef.current * sampleDistance));
      const behindPoint = path.getPointAtLength(behindDistance);
      const aheadPoint = path.getPointAtLength(aheadDistance);
      const travelAngle = Math.atan2(aheadPoint.y - behindPoint.y, aheadPoint.x - behindPoint.x) * (180 / Math.PI);

      let uprightAngle = travelAngle;
      let facing = 0;
      if (uprightAngle > 90) {
        uprightAngle -= 180;
        facing = 180;
      } else if (uprightAngle < -90) {
        uprightAngle += 180;
        facing = 180;
      }

      const curveLookahead = 38;
      const curveStart = path.getPointAtLength(Math.max(0, distance - curveLookahead));
      const curveMiddle = path.getPointAtLength(distance);
      const curveEnd = path.getPointAtLength(Math.min(totalLength, distance + curveLookahead));
      const incomingAngle = Math.atan2(curveMiddle.y - curveStart.y, curveMiddle.x - curveStart.x) * (180 / Math.PI);
      const outgoingAngle = Math.atan2(curveEnd.y - curveMiddle.y, curveEnd.x - curveMiddle.x) * (180 / Math.PI);
      const curvatureBank = Math.max(-5, Math.min(5, normalizeAngle(outgoingAngle - incomingAngle) * 0.16));

      mascotX.set(point.x - VEHICLE_AXLE_X);
      mascotY.set(point.y - VEHICLE_AXLE_Y);
      mascotHeading.set(facing);
      mascotRoadAngleTarget.set(uprightAngle + curvatureBank);
      previousProgressRef.current = progress;
    };

    frame = requestAnimationFrame(() => placeMascot(reduceMotion ? 0 : connectorProgress.get()));
    const unsubscribe = reduceMotion ? undefined : connectorProgress.on('change', placeMascot);

    return () => {
      cancelAnimationFrame(frame);
      unsubscribe?.();
    };
  }, [connector.path, connectorProgress, mascotHeading, mascotRoadAngleTarget, mascotSpinTarget, mascotX, mascotY, reduceMotion]);

  return (
    <section className="overflow-hidden bg-white py-20 sm:py-28">
      <div className="site-container">
        <Reveal className="text-center">
          <SectionEyebrow>FEATURE</SectionEyebrow>
          <h2 className="display-2 mx-auto mt-6 max-w-[1060px] text-ziplin-navy">
            {feature.featureHeading.includes('smarter') ? <>{feature.featureHeading.split('smarter')[0]}<span className="text-ziplin-yellow">smarter{feature.featureHeading.split('smarter')[1]}</span></> : feature.featureHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-[760px] text-lg leading-8 text-[#60708e]">{feature.featureIntro}</p>
        </Reveal>

        <div ref={roadmapRef} className="relative mx-auto mt-16 max-w-[1120px] lg:mt-24">
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" viewBox={`0 0 ${connector.width} ${connector.height}`} preserveAspectRatio="none">
            <motion.path
              d={connector.path}
              fill="none"
              stroke="#cbd3de"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="74"
              style={{ pathLength: roadProgress }}
            />
            <motion.path
              d={connector.path}
              fill="none"
              stroke="#394656"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="64"
              style={{ pathLength: roadProgress }}
            />
            <motion.path
              ref={mascotPathRef}
              d={connector.path}
              fill="none"
              stroke="#ffffff"
              strokeDasharray="20 22"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="5"
              style={{ pathLength: roadProgress, strokeDashoffset: laneDashOffset }}
            />
          </svg>
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[131px] w-[164px] origin-[50%_75%] lg:block"
            style={{ x: mascotX, y: mascotY }}
          >
            <motion.div
              className="h-full w-full [perspective:900px] [transform-style:preserve-3d]"
              style={{ rotate: mascotRoadAngle, y: suspension, rotateX: accelerationPitch, transformOrigin: VEHICLE_AXLE_ORIGIN }}
            >
              <motion.div
                className="h-full w-full [transform-style:preserve-3d]"
                style={{ rotateY: mascotFacing, transformOrigin: VEHICLE_AXLE_ORIGIN }}
              >
                <motion.div
                  className="h-full w-full drop-shadow-[0_9px_7px_rgba(8,28,69,.3)] [transform-style:preserve-3d]"
                  style={{ rotateY: mascotSpin, transformOrigin: VEHICLE_AXLE_ORIGIN }}
                >
                  <motion.div className="h-full w-full" style={{ y: drivingBounce }}>
                    <DrivingMascotCar />
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="space-y-8 lg:space-y-16">
            {feature.cards.map((card, index) => (
              <Reveal key={card.title} delay={index * .05} className={clsx('relative z-10 flex', index % 2 === 0 ? 'justify-start' : 'justify-end')}>
                <motion.article data-roadmap-card whileHover={{ y: -8, rotate: index % 2 === 0 ? -1 : 1 }} transition={{ duration: .3 }} className={clsx('w-full max-w-[475px] rounded-[20px] border p-7 shadow-[12px_12px_0_rgba(8,28,69,.07)] sm:p-9', tones[card.tone])}>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-[.12em] text-ziplin-yellow">WITH ZIPLIN</span>
                  <h3 className="mt-4 font-display text-2xl leading-tight text-ziplin-navy">{card.title}</h3>
                  <p className="mt-4 text-base leading-7 text-[#64718a]">{card.description}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeatureBenefits({ feature }: { feature: FeatureDefinition }) {
  const items = [
    { icon: Target, title: 'Track performance across every channel', body: 'See email, social, paid, organic, QR, and partner traffic side by side with consistent campaign context.' },
    { icon: Sparkles, title: 'Get more clicks and conversions', body: 'Build trust with branded experiences and guide every visitor to the most relevant destination.' },
    { icon: ShieldCheck, title: 'Keep control of every campaign', body: 'Update destinations, set expiration, protect access, and standardize how your team publishes.' },
  ];
  return (
    <section className="site-container py-20 sm:py-28">
      <Reveal className="text-center">
        <SectionEyebrow>WHY ZIPLIN</SectionEyebrow>
        <h2 className="display-2 mx-auto mt-6 max-w-[800px]">Turn {feature.name.toLowerCase()} into a <span className="text-ziplin-yellow">measurable growth channel</span></h2>
      </Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {items.map((item, index) => <Reveal key={item.title} delay={index * .08}><motion.article whileHover={{ y: -7 }} className="h-full rounded-[20px] border border-[#dce4ef] bg-white p-7 shadow-[0_14px_45px_rgba(8,28,69,.08)]"><div className="flex size-12 items-center justify-center rounded-xl bg-[#fff4c7] text-ziplin-yellow"><item.icon /></div><h3 className="mt-6 font-display text-2xl leading-tight">{item.title}</h3><p className="mt-4 text-base leading-7 text-[#66718a]">{item.body}</p><div className="mt-6 flex items-center gap-2 text-sm text-ziplin-blue"><CheckCircle2 className="size-4 text-[#14a956]" /> Ready for your whole team</div></motion.article></Reveal>)}
      </div>
      <Reveal delay={.16} className="mt-10 rounded-[22px] bg-ziplin-navy p-7 text-white sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div><span className="font-mono text-[11px] uppercase tracking-[.16em] text-ziplin-yellow">FAST BY DESIGN</span><h3 className="mt-3 font-display text-3xl">Launch in minutes. Optimize continuously.</h3><p className="mt-3 max-w-[760px] text-base leading-7 text-white/70">Every interaction is built around instant publishing, safe editing, actionable analytics, and simple collaboration.</p></div>
          <div className="flex size-24 items-center justify-center rounded-full border border-white/20 bg-white/10"><Zap className="size-10 text-ziplin-yellow" /></div>
        </div>
      </Reveal>
    </section>
  );
}
