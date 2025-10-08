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
  id: string | number;  // ✅ id zaroori hai routing ke liye
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
  const { id, name, title, years, specialties, photoAlt, photoUrl, millsSupported, description } = consultant;
  const router = useRouter();

  // ✅ Button click handler
  const handleBook = () => {
    router.push(`/B2B/consultants/${id}`);
  };

  return (
    <Card className="h-full flex flex-col bg-white/30 border-white/20">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted">
          <Image
            src={
              photoUrl ||
              "/placeholder.svg?height=112&width=112&query=consultant-avatar"
            }
            alt={photoAlt || `${name} headshot`}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <CardTitle className="text-base text-gray-700 truncate">
            {name}
          </CardTitle>
          <p className="text-sm text-gray-600 truncate">{title}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">
          <strong>Years of Experience:</strong> {years}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Mills Supported:</strong> {millsSupported || "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Description:</strong> {description || "No description available"}
        </p>

        <div className="flex flex-wrap gap-2">
          {specialties.map((sp) => (
            <Badge
              key={sp}
              variant="outline"
              className="text-xs bg-white/5 text-gray-700 border-white/20"
            >
              {sp}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button
          onClick={handleBook}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Book a consultation
        </Button>
      </CardFooter>
    </Card>
  );
}
