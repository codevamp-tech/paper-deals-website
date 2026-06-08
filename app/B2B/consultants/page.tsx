"use client";

import { useEffect, useState, useRef } from "react";
import { ConsultantCard } from "./Consultants-Card";
import { motion } from "framer-motion";
import { UserCheck, ShieldCheck, Trophy, Search } from "lucide-react";

type APIConsultant = {
  id: number;
  name: string;
  consultantPic?: {
    prof_pic?: string;
    years_of_experience?: string;
    mills_supported?: string;
    description?: string;
  } | null;
};

type Consultant = {
  id: string;
  name: string;
  years: number;
  millsSupported: string;
  description: string;
  photoUrl: string;
  photoAlt: string;
};

// 🦴 ConsultantCard Skeleton Loader
export function ConsultantCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden animate-pulse">
          <div className="h-24 bg-gray-50" />
          <div className="p-6 pt-14 space-y-4">
            <div className="w-16 h-16 bg-white rounded-2xl -mt-16 relative border-4 border-white shadow-md" />
            <div className="h-6 bg-gray-100 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="flex gap-4 pt-2">
              <div className="h-10 bg-gray-50 rounded-xl flex-1" />
              <div className="h-10 bg-gray-50 rounded-xl flex-1" />
            </div>
            <div className="h-20 bg-gray-50 rounded-xl w-full" />
            <div className="h-12 bg-gray-100 rounded-xl w-full mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const observerTargetRef = useRef<HTMLDivElement>(null);

  const fetchConsultants = async (pageNumber: number, isInitial: boolean = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/getallconsultants?user_type=5&page=${pageNumber}&limit=6`
      );
      const json = await res.json();

      const mapped: Consultant[] = (json.data || []).map((c: APIConsultant) => ({
        id: String(c.id),
        name: c.name,
        years: Number(c.consultantPic?.years_of_experience) || 0,
        millsSupported: c.consultantPic?.mills_supported || "N/A",
        description: c.consultantPic?.description || "No description available",
        photoUrl: c.consultantPic?.prof_pic
          ? c.consultantPic.prof_pic.startsWith("http")
            ? c.consultantPic.prof_pic
            : `${process.env.NEXT_PUBLIC_API_URL}/${c.consultantPic.prof_pic}`
          : "/placeholder.svg",
        photoAlt: c.name,
      }));

      if (isInitial) {
        setConsultants(mapped);
      } else {
        setConsultants((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const uniqueNew = mapped.filter((item) => !existingIds.has(item.id));
          return [...prev, ...uniqueNew];
        });
      }

      setTotal(json.total || 0);
      setTotalPages(json.totalPages || 1);
      setHasMore(pageNumber < (json.totalPages || 1));
    } catch (err) {
      console.error("Error fetching consultants:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchConsultants(1, true);
  }, []);

  // Subsequent loads
  useEffect(() => {
    if (page > 1) {
      fetchConsultants(page, false);
    }
  }, [page]);

  // Load more trigger
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      setPage((prev) => prev + 1);
    }
  };

  // IntersectionObserver for Infinite Scroll
  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const target = observerTargetRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, loading, loadingMore, page]);

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20">
      {/* Hero Header */}
      <section className="bg-white border-b border-gray-100 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Verified Experts</span>
              </div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                Industry <span className="text-primary">Consultants</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl">
                Connect with veteran paper industry experts to optimize your mill operations, supply chain, and business strategy.
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200" />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-primary flex items-center justify-center text-white text-xs font-bold">
                  +25
                </div>
              </div>
              <div className="text-sm">
                <p className="font-bold text-gray-900">Expert Network</p>
                <p className="text-gray-500">Trusted by 100+ Mills</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: UserCheck, label: "Verified Experts", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Trophy, label: "Top Rated", color: "text-amber-600", bg: "bg-amber-50" },
              { icon: Search, label: "Market Insights", color: "text-purple-600", bg: "bg-purple-50" },
              { icon: ShieldCheck, label: "Secure Booking", color: "text-green-600", bg: "bg-green-50" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-700">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading && consultants.length === 0 ? (
          <ConsultantCardSkeleton />
        ) : consultants.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {consultants.map((c, index) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (index % 3) * 0.05 }}
                >
                  <ConsultantCard consultant={c} />
                </motion.div>
              ))}
            </div>

            {/* Load More & Infinite Scroll Trigger */}
            <div ref={observerTargetRef} className="mt-16 flex flex-col items-center justify-center min-h-[100px]">
              {loadingMore ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500 font-semibold animate-pulse">Loading more experts...</p>
                </div>
              ) : hasMore ? (
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 font-bold text-gray-700 shadow-sm transition-all active:scale-95"
                >
                  Load More Consultants
                </button>
              ) : (
                <div className="text-center text-gray-400 py-3 font-semibold text-sm bg-gray-50/50 px-6 rounded-full border border-gray-100/60">
                  🎉 You've viewed all {total} verified experts
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No consultants are currently available. Please check back later.</p>
          </div>
        )}
      </main>
    </div>
  );
}
