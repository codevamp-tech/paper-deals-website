// components/Footer.tsx
import React from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* ===== Top Section ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Logo + Social */}
          <div>
            <Link href="/">
              <img
                src="/logomain.png"
                alt="LOGO"
                className="w-[50vw] sm:w-[25vw] md:w-[10vw] h-auto mb-4"
              />
            </Link>

            <p className="text-gray-700 mb-6 max-w-sm">
              Premium solutions for modern businesses. Quality, reliability, and
              innovation.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.facebook.com/p/Paper-Deals-61554782455824"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/paper-deals/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@paperdeals-123?si=4yfKosAds2egj6lU"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-4 text-black text-lg">Company</h3>
            <ul className="space-y-2 text-gray-700">
              {[
                { name: "About Us", href: "/about" },
                { name: "Live Stock", href: "/B2B/live-stock" },
                { name: "Products", href: "/product" },
                { name: "News", href: "/News" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-bold mb-4 text-black text-lg">Contact Us</h3>

            <div className="flex items-start gap-2 text-gray-700 mb-4">
              <MapPin className="h-5 w-5 mt-1 shrink-0 text-gray-600" />
              <p className="leading-relaxed">
                <strong>Registered Office:</strong>
                <br />
                Kay Paper Deals Pvt Ltd.
                <br />
                B-9, F/F, Housing Society,
                <br />
                N.D.S.E - 1, New Delhi - 110049
              </p>
            </div>

            <div className="flex items-start gap-2 text-gray-700 mb-3">
              <Phone className="h-5 w-5 mt-1 shrink-0 text-gray-600" />
              <div>
                <p>9837093712</p>
                <p>7017744883</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="h-5 w-5 text-gray-600" />
              <a
                href="mailto:support@paperdeals.in"
                className="hover:text-blue-600 transition-colors break-all"
              >
                support@paperdeals.in
              </a>
            </div>
          </div>
        </div>

        {/* ===== Association Partner Section ===== */}
        <div className="flex flex-col lg:items-center items-start pb-8 gap-3">
          <div className="flex flex-col md:flex-row md:items-center items-start gap-4">
            <h3 className="lg:text-xl md:text-md text-base font-semibold text-gray-800">
              OUR ASSOCIATION PARTNER
            </h3>
            <div className="flex flex-wrap gap-4 mt-2 md:mt-0">
              <div className="slide">
                <img
                  className="logo"
                  src="/p1.jpeg"
                  alt="Partner 1"
                  style={{ width: "100px", objectFit: "contain" }}
                />
              </div>
              <div className="slide">
                <img
                  className="logo"
                  src="/p2.jpg"
                  alt="Partner 2"
                  style={{ width: "100px", objectFit: "contain" }}
                />
              </div>
              <div className="slide">
                <img
                  className="logo"
                  src="/p3.jpg"
                  alt="Partner 3"
                  style={{ width: "100px", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
          <p className="text-center w-full text-base md:text-lg font-medium text-gray-800">
            A Product of Kay Group
          </p>
        </div>

        {/* ===== Bottom Section ===== */}
        <div className="border-t border-zinc-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-zinc-500 text-sm">
            © 2025 PaperDeals. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 mt-4 md:mt-0 items-center">
            <a
              href="#"
              className="text-zinc-500 hover:text-gray-800 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-zinc-500 hover:text-gray-800 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-zinc-500 hover:text-gray-800 text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
