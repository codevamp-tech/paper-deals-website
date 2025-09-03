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
import { Box } from "lucide-react";

type Consultant = {
  name: string;
  title: string;
  years: number;
  specialties: string[];
  photoAlt?: string;
  photoUrl?: string;
};

export function ConsultantCard({ consultant }: { consultant: Consultant }) {
  const { name, title, years, specialties, photoAlt, photoUrl } = consultant;
  return (
    <Card className="h-full flex flex-col bg-white/30 border-white/20 ">
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
        <p className="text-sm text-gray-600">{years}+ years experience</p>
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          variant="default"
        >
          Book a consultation
        </Button>
      </CardFooter>
    </Card>
  );
}
