"use client";

import React from "react";
import Link from "next/link";
import {
  Facebook,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/product" },
    { name: "News & Media", href: "/News" },
    { name: "Partner With Us", href: "/partnerwithus" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/term" },
    { name: "Payment Policy", href: "/payment-policy" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8 mt-12 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mb-32 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-4">

          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <img
                src="/logomain.png"
                alt="PaperDeals Logo"
                className="w-[180px] h-auto"
              />
            </Link>
            <p className="text-gray-500 text-[15px] font-medium leading-relaxed max-w-xs">
              Revolutionizing paper procurement through technology, quality, and an unwavering commitment to sustainable growth.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "https://www.facebook.com/p/Paper-Deals-61554782455824" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/paper-deals/" },
                { icon: Youtube, href: "https://youtube.com/@paperdeals-123?si=4yfKosAds2egj6lU" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-primary rounded-full" /> Company
            </h3>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-primary font-bold text-sm transition-all flex items-center gap-2 group"
                  >
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-primary rounded-full" /> Contact Us
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <MapPin size={18} />
                </div>
                <div className="text-sm text-gray-500 font-medium leading-relaxed">
                  <span className="text-gray-900 font-bold block mb-1">Registered Office</span>
                  Kay Paper Deals Pvt. Ltd. <br />
                  B-9, F/F, Housing Society, <br />
                  N.D.S.E - 1, New Delhi - 110049
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Mail size={18} />
                </div>
                <a href="mailto:support@paperdeals.in" className="text-sm text-gray-500 font-bold hover:text-primary transition-colors">
                  support@paperdeals.in
                </a>
              </div>
            </div>
          </div>

          {/* Association Partners */}
          <div className="space-y-8">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 flex items-center gap-2">
              <div className="w-6 h-0.5 bg-primary rounded-full" /> Associations
            </h3>
            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { src: "/p1.jpeg" },
                  { src: "/p2.jpg" },
                  { src: "/p3.jpg" },
                  { src: "/p5.png" },
                ].map((partner, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-center h-14 group cursor-pointer hover:shadow-md transition-all">
                    <img
                      src={partner.src}
                      alt="Partner"
                      className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">A Proud Member of</p>
                <Link href="https://kaygroup.co.in/" target="_blank" className="inline-flex items-center gap-2 text-primary font-black text-sm hover:underline group">
                  Kay Group <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-3 border-t border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              © {currentYear} <span className="text-gray-900 font-black">PaperDeals</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
              <ShieldCheck size={12} /> Secure Marketplace Verified
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-400 hover:text-gray-900 text-xs font-bold uppercase tracking-widest transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
