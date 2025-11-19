"use client";

import { useEffect, useState } from "react";
import { ConsultantCard } from "./Consultants-Card";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

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
    <section className="p-4">
      <Card className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4 pb-4 animate-pulse">
          <div className="relative h-16 w-16 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1 animate-pulse">
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>

          <div className="space-y-2 pt-3">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-11/12" />
            <div className="h-3 bg-gray-200 rounded w-10/12" />
          </div>
        </CardContent>

        <CardFooter className="pt-4 mt-auto animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-full" />
        </CardFooter>
      </Card>
    </section>
  );
}

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);





  useEffect(() => {
    async function fetchConsultants() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/getallconsultants?user_type=5`
        );
        const json = await res.json();

        const mapped: Consultant[] = json.data.map((c: APIConsultant) => ({
          id: String(c.id),
          name: c.name,
          years: Number(c.consultantPic?.years_of_experience) || 0,
          millsSupported: c.consultantPic?.mills_supported || "N/A",
          description: c.consultantPic?.description || "No description available",
          photoUrl: c.consultantPic?.prof_pic
            ? c.consultantPic.prof_pic.startsWith("http")
              ? c.consultantPic.prof_pic
              : `${process.env.NEXT_PUBLIC_API_URL}/${c.consultantPic.prof_pic}`
            : "/placeholder.svg?height=112&width=112&query=consultant",
          photoAlt: c.name,
        }));

        setConsultants(mapped);
      } catch (err) {
        console.error("Error fetching consultants:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchConsultants();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <ConsultantCardSkeleton />
      ) : consultants.length > 0 ? (
        consultants.map((c) => <ConsultantCard key={c.id} consultant={c} />)
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No consultants found.
        </p>
      )}
    </div>
  );
}
