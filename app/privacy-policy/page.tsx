"use client";

import React, { useState } from "react";
import Link from "next/link";


export default function PrivacyPolicyPage() {
  const [phone, setPhone] = useState("");

  const validatePhone = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = phone.replace(/[^0-9]/g, "");
    if (phoneNumber.length === 10) {
      alert("Phone number is valid: " + phoneNumber);
    } else {
      alert("Please enter a valid 10-digit phone number.");
    }
  };

  return (
    <>

      <main className="md:mt-0">

        <section className="bg-[url('/assets/herobg.jpg')] bg-cover lg:bg-fixed bg-no-repeat bg-bottom relative w-full h-fit">
          <div className="flex flex-col gap-2 items-center justify-center w-full bg-[#090909c4] px-4 py-16 md:py-24">
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              Privacy Policy
            </h1>
            <ul className="flex flex-row space-x-3 items-center justify-center text-white text-sm">
              <Link href="/">Home</Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="currentColor"
                className="font-bold bi bi-chevron-right"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
              <p>Privacy Policy</p>
            </ul>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <div className="max-w-7xl mx-auto bg-white p-8">
          <h1 className="text-2xl font-bold mb-4">Introduction</h1>
          <p className="mb-4 text-justify">
            This Policy is owned and operated by Kay Paper Deals Pvt Ltd henceforth referred to as “Paper deals” which includes its subsidiary, affiliates, successors and permitted assigns. In the course of using this website or availing the products and services via the online enquiry forms, Paper deals and its affiliates may become privy to the personal information of its users, including information that is of a confidential nature. Paper deals provides services to the users through the website and is committed to protecting and respecting the privacy of the users and has taken all necessary and reasonable measures to protect the confidentiality of the user information and its transmission through the World Wide Web. Paper deals shall not be held liable for disclosure of the confidential information if such disclosure is in accordance with this Privacy Policy (“Policy”) or in accordance with the terms of any agreements entered with the users. Paper deals also assures not to disclose all information that it learns during the transactions and payments made to the user’s account(s). “User(s)” shall mean and include all companies and private organizations that visit the website and provide information to Paper deals through any of the modes referred to in the clause on "Collection of Information" below. All words and expressions used in this policy shall have the meanings respectively assigned them in the prescribed Act.
          </p>
          <h2 className="text-xl font-semibold mb-4">Collection of Information</h2>
          <p className="mb-4 text-justify">
            Paper deals shall obtain digital consent from the provider of the sensitive personal data or information regarding purpose of usage before collection of such information. During the use of the website, Paper deals may collect and process information from the users, including but not limited to the below mentioned:</p>

          <ul className="list-disc list-inside mb-4 space-y-2 text-justify">
            <li>
              Information that the users provide to Paper deals by filling in enquiry forms on the website. This includes contact
              information such as name, email address, mailing address, phone number, financial information, company documents,
              bank account number, password, and preferences information such as favourites lists and transaction history;
            </li>
            <li>
              Information that the users provide when the users write directly to Paper deals (including by way of email, WhatsApp
              or messages);
            </li>
            <li>Information that the users provide to Paper deals over telephone;</li>
            <li>Paper deals may make and keep a record of the information shared by the users with Paper deals;</li>
            <li>
              When the user uses the website, Paper deals servers automatically record certain information that the user’s web
              browser sends whenever the user visits any website. These server logs may include information such as the user’s web
              request, Internet Protocol (IP) address, browser type, referring/exit pages and URLs, number of clicks, domain names,
              landing pages, pages viewed, and other such information. Paper deals uses this information, which may or may not
              identify users, to analyze trends, to administer the website, to track user’s movements around the website, and to
              gather demographic information about the user base as a whole.
            </li>
          </ul>

          <p className="mb-4 text-justify">
            While collecting information directly from the person concerned, Paper deals or any person on its behalf shall take such steps as are, in the circumstances, reasonable to ensure that the person concerned is having the knowledge of — (a) the fact that the information is being collected; (b) the purpose for which the information is being collected; (c) the intended recipients of the information. Paper deals or any person on its behalf shall, prior to the collection of information including sensitive personal data or information provide an option to the provider of the information to not to provide the data or information sought to be collected. The provider of information shall, at any time while availing the services or otherwise, also have an option to withdraw its consent given earlier to Paper deals. Such withdrawal of the consent shall be sent in writing to Paper deals. In the case of provider of information not providing or later on withdrawing his consent, Paper deals shall have the option not to provide goods or services for which the said information was sought.</p>
          <h2 className="text-xl font-semibold mb-4">Non-disclosure</h2>
          <p className="mb-4 text-justify">
            Paper deals pledges that it shall not sell or rent users’ personal details to anyone. Paper deals will protect every bit of the users’ business or personal information and maintain the confidentiality of the same. Paper deals guarantees that it is going to keep all information confidential except in the following cases:</p>
          <ul className="list-disc list-inside mb-4 space-y-2 text-justify">
            <li>
              Paper deals may disclose users’ information to governmental and other statutory bodies who have appropriate
              authorization to access the same for any specific legal purposes.
            </li>
            <li>
              Paper deals may disclose users’ information if it is under a duty to do so in order to comply with any legal
              obligation, or in order to enforce or apply the Terms of Use (displayed on the website), or to protect the rights,
              property or safety of Paper deals, its users or others. This includes exchanging information with other companies or
              agencies that work for fraud prevention and credit reference.
            </li>
            <li>Paper deals may disclose users’ information to its agents under a strict code of confidentiality.</li>
            <li>
              Paper deals may disclose users’ information to such third parties to whom it transfers its rights and duties under
              the customer agreement entered into with the users. In such an event, the said third parties’ use of the information
              will be subject to such confidentiality obligations as contained in this Policy.
            </li>
            <li>
              Paper deals may disclose users’ information to any member of its related or group companies including its
              subsidiaries, its ultimate holding company and its subsidiaries, as the case may be.
            </li>
            <li>
              In the event that Paper deals sells or buys any business or assets, it may disclose the users’ information to the
              prospective seller or buyer of such business or assets. User, email and visitor information are generally one of the
              transferred business assets in these types of transactions. Paper deals may also transfer or assign such information
              in the course of corporate divestitures, mergers or dissolution.
            </li>
          </ul>

          <p className="mb-2 text-justify">
            Paper deals shall ensure that in case of disclosure of whole or part of the user’s information to a service provider or agent, within or outside India, the same shall be bound by obligations of confidentiality at least as strict as Paper deals’s obligations under this Privacy Policy and the information shall be accorded the same level of protection as provided by Paper deals under the terms of this Privacy Policy. Paper deals may store the user’s information in locations outside the direct control of Paper deals (for instance, on servers or databases co-located with hosting providers). Paper deals never will sell or rent personal information of its clients to anyone, at any time, for any reason. Paper deals may use the user’s personal information in the following ways, viz:</p>
          <ul className="list-disc list-inside mb-4 space-y-2 text-justify">
            <li>
              Monitor, improve and administer the website and improve the quality of services; Analyze how website is used,
              diagnose service or technical problems, maintain security;
            </li>
            <li>Remember information to help the user effectively access the website;</li>
            <li>
              Monitor aggregate metrics such as total number of views, visitors, traffic and demographic patterns;
            </li>
            <li>
              To confirm the user's identity in order to determine its eligibility to use the website and avail of the services;
            </li>
            <li>To notify the user about changes to the website;</li>
            <li>To enable Paper deals to comply with its legal and regulatory obligations;</li>
            <li>To help the user apply for certain products and services;</li>
            <li>
              For the purpose of sending administrative notices, service-related alerts and other similar communication with a
              view to optimizing the efficiency of the website;
            </li>
            <li>
              Doing market research, troubleshooting, protection against error, project planning, fraud and other criminal
              activity;
            </li>
            <li>For the purpose of initiating deals and subsequent processes thereof.</li>
            <li>To reinforce Paper deals’s Terms of Use.</li>
          </ul>

          <p className="mb-4 text-justify">
            Access to personal information is strictly restricted and shared in accordance with certain specific internal procedures and safeguards that govern access. Certain features of the website are available for use without any need to provide details. Other features of the website may require users to provide details including but not limited to the user’s name, address, mobile number, email address, PAN No, GST, company details, employment & income details.</p>
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <p className="pb-2 text-justify">
            The security of user’s personal information is important to Paper deals. Paper deals follows generally accepted industry standards to protect the personal information submitted to it, both during transmission and once Paper deals receives it. All information gathered on Paper deals is securely stored within the Paper deals controlled database. The database is stored on Cloud servers of AWS secured with highly secured layers and access to such servers is password protected and strictly limited based on need-to-know basis. However, as effective as security measures are, no security system is impenetrable. Paper deals cannot guarantee the security of its database, nor can Paper deals guarantee that information provided by users will not be intercepted while being transmitted to Paper deals over the internet. And, of course, any information users include in a posting to the discussion areas is available to anyone with internet access.
          </p>
          <p className="mb-4 text-justify">
            Paper deals cannot ensure or warrant the security of any information the user transmits to Paper deals or guarantee that information on the website may not be accessed, disclosed, altered, or destroyed by breach of any of Paper deal’s physical, technical, or managerial safeguards.</p>

          <h2 className="text-xl font-semibold mb-4">Changes to this Policy</h2>
          <p className="mb-4 text-justify">
            Paper deals reserves the right to update, modify and amend any terms of this Policy from time to time to reflect changes in the law, changes in Paper deal’s business practices, procedures and structure, and the community’s changing privacy expectations. When Paper deals posts changes to this Policy, Paper deals will revise the "last updated" date at the top of this Policy. Paper deals encourages users to periodically review this page for the latest information on Paper deal’s privacy practices. Any user who does not agree with any provision of this Policy is required to discontinue the use of the website immediately. The policy shall apply uniformly to Paper deal’s website and its mobile applications.
          </p>
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4 text-justify">
            If you have any questions about this Policy, the practices of Paper deals or your dealings with the website, you can contact Paper deals at info@paperdeals.in or +911146351160.
          </p>
        </div>
      </main>

    </>
  );
}
