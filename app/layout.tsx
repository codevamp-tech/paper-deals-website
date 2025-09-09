import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Topbar from "@/components/topbar/Topbar";
import BookModalButton from "@/components/flotiongbutton/StickyButton";
import Footer from "@/components/footer/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional
  variable: "--font-poppins",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PaperDeals - Premium B2B Paper Solutions",
  description: "High-quality products for modern businesses",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Topbar />
          {children}
          <BookModalButton />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
