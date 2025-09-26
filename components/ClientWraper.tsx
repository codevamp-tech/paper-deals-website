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
    const [hideLayout, setHideLayout] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const u = getUserFromToken();
        setUser(u);

        // अगर पहली बार buyer dashboard पे गया है, तो layout छिपा दो
        if (pathname.startsWith("/buyer3")) {
            setHideLayout(true);
        } else {
            setHideLayout(false);
        }

    }, [pathname]);

    return (
        <>
            {!hideLayout && <Topbar />}
            {children}
            {!hideLayout && <BookModalButton />}
            {!hideLayout && <Footer />}
        </>
    );
}
