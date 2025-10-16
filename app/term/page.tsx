"use client";

import React from "react";


export default function TermsPage() {
  return (
    <>
      <main className="bg-white text-gray-800">
        <section className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-6 text-center text-sky-600">
            Privacy Policy & Terms of Use
          </h1>

          {/* 1️⃣ Information Collection */}
          <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-700">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside mb-4 space-y-2 text-justify">
            <li>
              Information that the users provide to Paper deals by filling in enquiry forms on the website. This includes
              contact information such as name, email address, mailing address, phone number, financial information,
              company documents, bank account number, password, and preferences information such as favourites lists and
              transaction history;
            </li>
            <li>
              Information that the users provide when they write directly to Paper deals (including via email, WhatsApp,
              or messages);
            </li>
            <li>Information that the users provide to Paper deals over telephone;</li>
            <li>Paper deals may make and keep a record of the information shared by the users with Paper deals;</li>
            <li>
              When the user uses the website, Paper deals servers automatically record certain information that the
              user’s web browser sends whenever the user visits any website. These server logs may include information
              such as the user’s web request, Internet Protocol (IP) address, browser type, referring/exit pages and
              URLs, number of clicks, domain names, landing pages, pages viewed, and other such information. Paper deals
              uses this information to analyze trends, administer the website, track user movements, and gather
              demographic information about the user base.
            </li>
          </ul>

          {/* 2️⃣ Use of Information */}
          <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-700">
            Use of Information
          </h2>
          <ul className="list-disc list-inside mb-4 space-y-2 text-justify">
            <li>
              Monitor, improve and administer the website and improve the quality of services; analyze how the website
              is used and maintain security;
            </li>
            <li>Remember information to help the user effectively access the website;</li>
            <li>
              Monitor aggregate metrics such as total number of views, visitors, traffic and demographic patterns;
            </li>
            <li>
              Confirm user identity in order to determine eligibility to use the website and avail services;
            </li>
            <li>Notify the user about changes to the website;</li>
            <li>Enable Paper deals to comply with its legal and regulatory obligations;</li>
            <li>Help the user apply for certain products and services;</li>
            <li>
              Send administrative notices, service-related alerts and similar communication to optimize website
              efficiency;
            </li>
            <li>
              Conduct market research, troubleshooting, fraud prevention, and project planning;
            </li>
            <li>Reinforce Paper deals’s Terms of Use.</li>
          </ul>

          {/* 3️⃣ Disclosure of Information */}
          <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-700">
            Disclosure of Information
          </h2>
          <ul className="list-disc list-inside mb-4 space-y-2 text-justify">
            <li>
              Paper deals may disclose users’ information to governmental and statutory bodies with proper authorization
              for legal purposes.
            </li>
            <li>
              Paper deals may disclose information if required by law, or to enforce the Terms of Use, or to protect the
              rights, property or safety of Paper deals, its users or others. This includes sharing information with
              agencies working on fraud prevention and credit reference.
            </li>
            <li>Paper deals may disclose users’ information to its agents under a strict code of confidentiality.</li>
            <li>
              Paper deals may share users’ information with third parties to whom it transfers its rights and duties
              under the customer agreement, subject to confidentiality obligations.
            </li>
            <li>
              Paper deals may disclose users’ information to its related or group companies including subsidiaries and
              holding companies.
            </li>
            <li>
              In the event that Paper deals sells or buys any business or assets, it may disclose user information to the
              prospective seller or buyer. Such data may be transferred or assigned in corporate divestitures, mergers,
              or dissolution.
            </li>
          </ul>

          {/* 4️⃣ Contact Information */}
          <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-700">
            Contact Us
          </h2>
          <p className="text-justify leading-relaxed">
            Registered Office: Kay Paper Deals Pvt Ltd. <br />
            B-9, F/F, Housing Society, N.D.S.E - 1, New Delhi - 110049 <br />
            Phone: 9837093712, 7017744883 <br />
            Email: support@paperdeals.in
          </p>
        </section>
      </main>
    </>
  );
}
