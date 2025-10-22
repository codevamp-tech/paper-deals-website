"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Consultant = {
  id: string | number; // ✅ id zaroori hai routing ke liye
  name: string;
  title: string;
  years: number;
  millsSupported?: string;
  description?: string;
  specialties: string[];
  photoAlt?: string;
  photoUrl?: string;
};

export function ConsultantCard({ consultant }: { consultant: Consultant }) {
  const {
    id,
    name,
    title,
    years,
    specialties,
    photoAlt,
    photoUrl,
    millsSupported,
    description,
  } = consultant;
  const router = useRouter();

  // ✅ Button click handler
  const handleBook = () => {
    router.push(`/B2B/consultants/${id}`);
  };

  return (
    <section className="p-4">
      <Card className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-md">
            <Image
              src={
                photoUrl ||
                "/placeholder.svg?height=112&width=112&query=consultant-avatar"
              }
              alt={photoAlt || `${name} headshot`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
              {name}
            </CardTitle>
            <p className="text-sm text-gray-600 truncate mt-1">{title}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700">
                <strong>Experience:</strong> {years} years
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-700">
                <strong>Mills Supported:</strong> {millsSupported || "N/A"}
              </span>
            </div>
          </div>

          <div className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-gray-900">About:</strong>{" "}
            {description || "No description available"}
          </div>

          {/* <div className="flex flex-wrap gap-2 pt-2">
            {specialties.map((sp) => (
              <Badge
                key={sp}
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
              >
                {sp}
              </Badge>
            ))}
          </div> */}
        </CardContent>

        <CardFooter className="pt-4 mt-auto">
          <Button
            onClick={handleBook}
            className="w-full bg-[#0f7aed] hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Book Consultation
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}
