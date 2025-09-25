"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Topbar from "@/components/topbar/Topbar";
import BookModalButton from "@/components/flotiongbutton/StickyButton";
import Footer from "@/components/footer/Footer";
import { getUserFromToken } from "@/hooks/use-token";

export default function ClientWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    useEffect(() => {
        const u = getUserFromToken();
        setUser(u);
    }, []);

    const isBuyerDashboard = user && pathname.startsWith("/buyer3/dashboard");



    return (
        <>
            {!isBuyerDashboard && <Topbar />}
            {children}
            {!isBuyerDashboard && <BookModalButton />}
            {!isBuyerDashboard && <Footer />}
        </>
    );
}
