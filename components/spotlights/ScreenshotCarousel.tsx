"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Screenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const AUTOPLAY_INTERVAL_MS = 4500;

export function ScreenshotCarousel({
  screenshots,
}: {
  screenshots: Screenshot[];
}) {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const total = screenshots.length;
  const current = screenshots[index];

  // Observe viewport visibility — autoplay only while the carousel is on screen.
  useEffect(() => {
    if (total <= 1 || !containerRef.current) return;
    const node = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.4),
      { threshold: [0, 0.4, 1] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [total]);

  // Respect prefers-reduced-motion.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setUserPaused(true);
    const handler = (e: MediaQueryListEvent) => setUserPaused(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // Autoplay timer.
  useEffect(() => {
    if (total <= 1 || !isVisible || userPaused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i === total - 1 ? 0 : i + 1));
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [isVisible, userPaused, total, index]);

  const goPrev = () => {
    setUserPaused(true);
    setIndex((i) => (i === 0 ? total - 1 : i - 1));
  };
  const goNext = () => {
    setUserPaused(true);
    setIndex((i) => (i === total - 1 ? 0 : i + 1));
  };
  const goTo = (i: number) => {
    setUserPaused(true);
    setIndex(i);
  };

  if (total === 1) {
    return (
      <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200/80 shadow-2xl bg-white">
        <Image
          src={current.src}
          alt={current.alt}
          width={current.width}
          height={current.height}
          className="w-full h-auto"
          priority={false}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200/80 shadow-2xl bg-white">
        <Image
          src={current.src}
          alt={current.alt}
          width={current.width}
          height={current.height}
          className="w-full h-auto"
          priority={false}
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          className="rounded-md p-2 ring-1 ring-gray-200 hover:bg-gray-50 transition active:bg-gray-100"
          aria-label="Previous screenshot"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700" strokeWidth={2.25} />
        </button>
        <div className="flex gap-1.5">
          {screenshots.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-brand-500" : "w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Show screenshot ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={goNext}
          className="rounded-md p-2 ring-1 ring-gray-200 hover:bg-gray-50 transition active:bg-gray-100"
          aria-label="Next screenshot"
        >
          <ChevronRight className="h-4 w-4 text-gray-700" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
