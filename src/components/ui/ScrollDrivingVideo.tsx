import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';

export function ScrollDrivingVideo({ progress }: { progress: MotionValue<number> }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const syncVideo = (value: number) => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;
      const targetTime = Math.max(0, Math.min(video.duration - 0.04, value * (video.duration - 0.04)));
      if (Math.abs(video.currentTime - targetTime) > 0.035) video.currentTime = targetTime;
    };

    const onMetadata = () => syncVideo(progress.get());
    video.addEventListener('loadedmetadata', onMetadata);
    const unsubscribe = progress.on('change', syncVideo);

    return () => {
      unsubscribe();
      video.removeEventListener('loadedmetadata', onMetadata);
    };
  }, [progress]);

  return (
    <video
      ref={videoRef}
      src="/figma-assets/ziplin-driving-road.mp4"
      muted
      playsInline
      preload="auto"
      className="h-full w-full scale-[1.12] object-cover object-center"
    />
  );
}
