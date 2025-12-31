"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/use-theme";

/* -----------------------------------
   Helper: Extract YouTube Video ID
------------------------------------ */
function extractYouTubeId(url: string) {
  if (!url) return "";

  const patterns = [
    /youtube\.com\/embed\/([^?&]+)/,
    /v=([^?&]+)/,
    /youtu\.be\/([^?&]+)/,
  ];

  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return "";
}

type Video = {
  id: number;
  title: string;
  videoId: string;
};

export default function VideoCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  /* -----------------------------------
     Fetch Videos
  ------------------------------------ */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/videos`
        );
        const json = await res.json();

        const mapped =
          json?.data?.map((v: any) => ({
            id: v.id,
            title: v.video_title,
            videoId: extractYouTubeId(v.video),
          })) || [];

        setVideos(mapped.filter(v => v.videoId));
      } catch (err) {
        console.error("Video fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  /* -----------------------------------
     Auto Scroll using scrollLeft
  ------------------------------------ */
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || videos.length === 0) return;

    let isPaused = false;
    let animationId: number;

    const speed = 0.5;

    const animate = () => {
      if (!isPaused) {
        container.scrollLeft += speed;

        // Infinite loop
        if (
          container.scrollLeft >=
          container.scrollWidth / 2
        ) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(animate);
    };

    const pause = () => (isPaused = true);
    const resume = () => (isPaused = false);

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
    };
  }, [videos]);

  return (
    <section className={`w-full my-12 ${theme.Bg}`}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Event Videos
        </h2>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden py-4"
        >
          {loading
            ? [...Array(4)].map((_, i) => <VideoSkeleton key={i} />)
            : [...videos, ...videos].map((v, i) => (
              <VideoCard key={`${v.id}-${i}`} {...v} />
            ))}
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------
   Video Card
------------------------------------ */
function VideoCard({
  title,
  videoId,
}: {
  title: string;
  videoId: string;
}) {
  return (
    <div className="min-w-[360px] rounded-2xl overflow-hidden bg-white shadow-lg hover:scale-105 transition-transform">
      <div className="relative aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
}

/* -----------------------------------
   Skeleton Loader
------------------------------------ */
function VideoSkeleton() {
  return (
    <div className="min-w-[360px] rounded-2xl bg-white shadow animate-pulse">
      <div className="aspect-video bg-slate-200" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
      </div>
    </div>
  );
}
