"use client";

import React, { useRef, useEffect } from "react";

interface Props {
  src?: string;
  onEnded?: () => void;
}

export default function ShuffleScreen({
  src = "/videos/shuffle.mp4",
  onEnded,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Ensure muted autoplay to maximize autoplay success
    v.muted = true;
    v.playsInline = true;
    try {
      v.volume = 0;
    } catch {}

    const tryPlay = async () => {
      try {
        await v.play();
      } catch (err) {
        // If first attempt fails, ensure muted and retry once
        try {
          v.muted = true;
          v.volume = 0;
          await v.play();
        } catch (err2) {
          // As a last resort, continue the flow so user isn't blocked
          setTimeout(() => onEnded && onEnded(), 600);
        }
      }
    };

    tryPlay();
  }, [onEnded]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        onEnded={onEnded}
        playsInline
        autoPlay
        muted
      />
    </div>
  );
}
