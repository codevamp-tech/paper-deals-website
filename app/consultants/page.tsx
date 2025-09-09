"use client";

import { useEffect, useState } from "react";
import { ConsultantCard } from "./Consultants-Card";

type APIConsultant = {
  id: number;
  name: string;
  phone_no: string;
  consultant_price: 10;
  mills_supported?: number | string; // 👈 new field (numeric preferred)
  description?: string; // 👈 new field
  organization?: {
    organizations: string;
    contact_person: string;
    city: string;
    materials_used: string;
  } | null;
};

type Consultant = {
  _id: string;
  name: string;
  title: string;
  years: number;
  millsSupported: number | string;
  description: string;
  specialties: string[];
  photoUrl?: string;
  photoAlt?: string;
};

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConsultants() {
      try {
        const res = await fetch(
          "http://localhost:5000/api/users/getallsellers?user_type=5"
        );
        const json = await res.json();

        // 

        const mapped = json.data.map((c: APIConsultant) => ({
          _id: String(c.id),
          name: c.name,
          title: c.organization?.organizations || "Independent Consultant",

          // years of experience
          years: Number(c.consultant_price) || 0,

          // mills supported: numeric preferred, fallback to string
          millsSupported:
            c.mills_supported && Number(c.mills_supported) > 0
              ? Number(c.mills_supported)
              : c.organization?.materials_used || "all",

          // description: prefer API description, fallback to contact person
          description:
            c.description || c.organization?.contact_person || "No description available",

          specialties: c.organization ? [c.organization.city].filter(Boolean) : [],

          // ✅ use organization.image_banner if available, else fallback
          photoUrl: c.organization?.image_banner
            ? `http://localhost:5000/${c.organization.image_banner}`
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
        consultants.map((c) => <ConsultantCard key={c._id} consultant={c} />)
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No consultants found.
        </p>
      )}
    </div>
  );
}
