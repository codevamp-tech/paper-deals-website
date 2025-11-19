"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BookModalButton from "@/components/flotiongbutton/StickyButton";
import Footer from "@/components/footer/Footer";
import { getUserFromToken } from "@/hooks/use-token";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [hideLayout, setHideLayout] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const u = getUserFromToken();
    setUser(u);

    // Hide footer & floating button for admin pages
    if (pathname.startsWith("/admin")) {
      setHideLayout(true);
    } else {
      setHideLayout(false);
    }
  }, [pathname]);

  return (
    <>
      {children}
      {!hideLayout && <BookModalButton />}
      {!hideLayout && <Footer />}
    </>
  );
}
