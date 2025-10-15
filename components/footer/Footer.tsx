"use client";
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
    <footer className="bg-gradient-to-b from-white via-gray-50 to-gray-100 border-t border-gray-200 mt-16">
      <div className="container mx-auto px-6 lg:px-12 py-14">
        {/* ===== Top Section ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* ===== Logo + About + Social ===== */}
          <div>
            <Link href="/" className="inline-block">
              <img
                src="/logomain.png"
                alt="PaperDeals Logo"
                className="w-[170px] md:w-[200px] h-auto mb-5"
              />
            </Link>

            <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
              Premium paper solutions for modern businesses — built on quality,
              trust, and innovation.
            </p>

            <div className="flex gap-4">
              {[
                {
                  icon: <Facebook className="h-5 w-5" />,
                  href: "https://www.facebook.com/p/Paper-Deals-61554782455824",
                },
                { icon: <Twitter className="h-5 w-5" />, href: "#" },
                { icon: <Instagram className="h-5 w-5" />, href: "#" },
                {
                  icon: <Linkedin className="h-5 w-5" />,
                  href: "https://www.linkedin.com/company/paper-deals/",
                },
                {
                  icon: <Youtube className="h-5 w-5" />,
                  href: "https://youtube.com/@paperdeals-123?si=4yfKosAds2egj6lU",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ===== Company Links ===== */}
          <div>
            <h3 className="font-semibold mb-5 text-gray-900 text-lg border-l-4 border-blue-600 pl-2">
              Company
            </h3>
            <ul className="space-y-2 text-gray-600 text-[15px]">
              {[
                { name: "About Us", href: "/about" },
                { name: "Live Stock", href: "/B2B/live-stock" },
                { name: "Products", href: "/product" },
                { name: "News", href: "/News" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-blue-600 transition-colors duration-150"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Contact Info ===== */}
          <div>
            <h3 className="font-semibold mb-5 text-gray-900 text-lg border-l-4 border-blue-600 pl-2">
              Contact Us
            </h3>

            <div className="space-y-4 text-gray-600 text-[15px]">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 text-blue-600" />
                <p>
                  <strong>Registered Office:</strong>
                  <br />
                  Kay Paper Deals Pvt. Ltd.
                  <br />
                  B-9, F/F, Housing Society,
                  <br />
                  N.D.S.E - 1, New Delhi - 110049
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-1 text-blue-600" />
                <div>
                  <p>+91 9837093712</p>
                  <p>+91 7017744883</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <a
                  href="mailto:support@paperdeals.in"
                  className="hover:text-blue-600 transition-colors duration-150"
                >
                  support@paperdeals.in
                </a>
              </div>
            </div>
          </div>

          {/* ===== Partners ===== */}
          <div>
            <h3 className="font-semibold mb-5 text-gray-900 text-lg border-l-4 border-blue-600 pl-2">
              Our Partners
            </h3>
            <div className="flex flex-wrap gap-3">
              {["/p1.jpeg", "/p2.jpg", "/p3.jpg"].map((src, i) => (
                <div
                  key={i}
                  className="p-2 border border-gray-200 rounded-md bg-white hover:shadow-md transition"
                >
                  <img
                    src={src}
                    alt={`Partner ${i + 1}`}
                    className="w-[90px] h-[55px] object-contain"
                  />
                </div>
              ))}
            </div>
            <p className="text-[15px] text-gray-600 mt-4 font-medium">
              A Product of Kay Group
            </p>
          </div>
        </div>

        {/* ===== Bottom Section ===== */}
        <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray-700">PaperDeals</span>. All
            rights reserved.
          </p>

          <div className="flex flex-wrap justify-center md:justify-end gap-6 mt-4 md:mt-0 text-sm">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (policy, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-500 hover:text-blue-600 transition-colors duration-150"
                >
                  {policy}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
