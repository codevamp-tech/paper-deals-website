"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "@/hooks/use-theme";

/* -----------------------------------
   Image Carousel - Updated Design
------------------------------------ */
export default function ImageCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const [images, setImages] = useState<{ id: number; title: string; imageUrl: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images`);
        const json = await res.json();
        if (Array.isArray(json?.data)) {
          const mapped = json.data.map((img: any) => ({
            id: img.id,
            title: img.title || "",
            imageUrl: img.url,
          }));
          setImages(mapped.filter((i) => i.imageUrl));
        }
      } catch (err) {
        console.error("Image fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || images.length === 0) return;

    let pos = 0;
    let raf: number;
    let isPaused = false;

    const animate = () => {
      if (!isPaused) {
        pos += 0.6; // Slightly faster for smoother feel on high-refresh screens
        const width = el.scrollWidth / 2;
        if (pos >= width) pos = 0;
        el.style.transform = `translateX(-${pos}px)`;
      }
      raf = requestAnimationFrame(animate);
    };

    const pause = () => (isPaused = true);
    const resume = () => (isPaused = false);

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [images]);

  return (
    <section className={`w-full py-16 overflow-hidden `}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight ">
              Events Gallery
            </h2>
            <p className="text-slate-500 mt-2">Handpicked inspirations for your next project</p>
          </div>
        </div>

        {/* Outer Container with Gradient Masks */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 w-20 z-10 rounded-sm  pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-20 z-10 rounded-sm  pointer-events-none" />

          <div className="overflow-hidden cursor-grab active:cursor-grabbing">
            <div
              ref={scrollRef}
              className="flex gap-8 will-change-transform"
              style={{ width: "fit-content" }}
            >
              {loading
                ? [...Array(4)].map((_, i) => <ImageSkeleton key={i} />)
                : [...Array(2)].map((_, dup) => (
                  <div key={dup} className="flex gap-8">
                    {images.map((img) => (
                      <ImageCard key={`${img.id}-${dup}`} {...img} />
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -----------------------------------
   Image Card - Refined Style
------------------------------------ */
function ImageCard({ title, imageUrl }: { title: string; imageUrl: string }) {
  return (
    <div className="group relative w-[300px] md:w-[400px] flex-shrink-0">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:ring-slate-800 transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:-translate-y-2">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 300px, 400px"
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          unoptimized={imageUrl.startsWith('http')} // Toggle based on domain config
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Title Tag */}
        {title && (
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-3 rounded-xl">
              <h3 className="text-white font-medium text-sm md:text-base truncate">
                {title}
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -----------------------------------
   Skeleton Loader - Polished
------------------------------------ */
function ImageSkeleton() {
  return (
    <div className="w-[300px] md:w-[400px] flex-shrink-0 space-y-4">
      <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3 animate-pulse" />
    </div>
  );
}