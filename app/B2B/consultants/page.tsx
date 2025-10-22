"use client";

import { useEffect, useState } from "react";
import { ConsultantCard } from "./Consultants-Card";

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
        <p className="col-span-full text-center text-gray-500">
          Loading consultants...
        </p>
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
