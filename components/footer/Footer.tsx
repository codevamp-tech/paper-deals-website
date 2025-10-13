// components/Footer.tsx
import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="pt-16 pb-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/">
              <img
                src="/logomain.png"
                alt="LOGO"
                className="w-[30vw] md:w-[10vw] sm:w-[100vw] h-auto"
              />
            </Link>

            <p className="text-gray-700 mb-6">
              Premium solutions for modern businesses. Quality, reliability, and
              innovation.
            </p>
            <div className="flex gap-4">
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
          <div>
            <h3 className="font-bold mb-4 text-black">Products</h3>
            <ul className="space-y-2">
              {[
                "Copy Paper",
                "Specialty Paper",
                "Recycled Paper",
                "Packaging Solutions",
                "Custom Orders",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-700 hover:text-gray-800 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-black">Company</h3>
            <ul className="space-y-2">
              {[
                { name: "About Us", href: "/about" },
                { name: "Live Stock", href: "/B2B/live-stock" },
                { name: "Products", href: "/product" },
                { name: "News", href: "/News" },
                // { name: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-700 hover:text-gray-800 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-black">Resources</h3>
            <ul className="space-y-2">
              {[
                { name: "FAQ", href: "#faq" },
                { name: "Support", href: "/support" },
                { name: "Partners", href: "/partners" },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-700 hover:text-gray-800 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm">
            © 2025 PaperDeals. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 items-center">
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
