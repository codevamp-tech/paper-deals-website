// components/Footer.tsx
import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/">
              <img
                src="/logomain.png"
                alt="LOGO"
                style={{
                  height: "auto",
                  width: "12vw",
                }}
              />
            </Link>
            <p className="text-zinc-400 mb-6">
              Premium solutions for modern businesses. Quality, reliability, and
              innovation.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Products</h3>
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
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              {[
                "About Us",
                "Sustainability",
                "Careers",
                "Press",
                "Contact",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              {["Blog", "Guides", "FAQ", "Support", "Partners"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-zinc-400 hover:text-white transition-colors"
                  >
                    {item}
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
            <p className="text-[3px] text-zinc-500">H4554N</p>
            <a
              href="#"
              className="text-zinc-500 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-zinc-500 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-zinc-500 hover:text-white text-sm transition-colors"
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
