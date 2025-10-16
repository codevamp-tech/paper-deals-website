"use client";

import Link from "next/link";

export default function PaymentPolicy() {
  return (
    <main className="md:mt-0">
      {/* Page Header */}
      <section className="bg-[url('/assets/herobg.jpg')] bg-cover lg:bg-fixed bg-no-repeat bg-bottom relative w-full h-fit">
        <div className="flex flex-col gap-2 items-center justify-center w-full bg-[#090909c4] px-4 py-16 md:py-24">
          <h1 className="text-2xl md:text-4xl font-bold text-white">Payment Policy</h1>
          <ul className="flex flex-row space-x-3 items-center justify-center text-white text-sm">
            <li>
              <Link href="/">Home</Link>
            </li>
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
            <li>Payment Policy</li>
          </ul>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto bg-white p-6">
        <h1 className="text-2xl font-bold mb-4">Payments Policy Document</h1>

        <h2 className="text-lg font-semibold mb-2">Products and Services</h2>
        <p className="mb-4">
          In conformity with existing rules and policies, the Payment Gateway is used for subscription and booking of
          consultants only. PAPER DEALS, an online CRM platform, is used only for deal tracking and creating leads for
          sellers and buyers. There are no physical product deals through the payment gateway. Only services are used by
          the payment gateway; hence, no refund policy applies.
        </p>

        <h2 className="text-lg font-semibold mb-2">Privacy Policy</h2>
        <p className="mb-4">
          We at Paper deals understand the importance of protecting your private information and shall take necessary
          safeguards to protect your privacy. We recommend that all login details - User ID/Password, etc. made
          available to you from the portal - be kept confidential at your end. All policies related to privacy concerns
          are governed by the terms and conditions of the industries.
        </p>

        <h2 className="text-lg font-semibold mb-2">Payment Issues</h2>

        <h3 className="text-lg font-semibold mb-2">How to Pay</h3>
        <p className="mb-4">
          Online payments may be required for different activities like Profile buildup packages, Booking of
          consultants, etc. To make a payment, click on the payment button provided in the respective section. You will
          be directed to the payment gateway, where you can select various payment options like Debit Card, Credit Card,
          Net Banking, or Wallet/UPI from the bank where you hold your account. Choose the respective payment option and
          make your payment. Standard charges as per RBI guidelines will be deducted from the payer. Do not click the
          'Refresh' or 'Cancel' buttons on the payment gateway.
        </p>
        <p className="mb-4">
          After a successful payment, a payment receipt shall be generated, which may be downloaded or printed. If the
          successful payment is not showing due to any reason like error in Internet connectivity or any other reason,
          please confirm with your bank account whether the amount has been deducted. Do not pay again immediately if
          there is any doubt, and check your bank account first to avoid double payment. If the payment has been
          deducted from your account but the receipt is not generated, please write an email to the Paper deals helpline
          email address or contact the authorities, specifying your registered mobile number, name, course, and date of
          payment.
        </p>

        <h3 className="text-lg font-semibold mb-2">Refund and Cancellation</h3>
        <p className="mb-4">
          Refunds/Cancellations: Our subscription is generally service based which includes display on user page
          (Premium or VIP) and is subscribed by user at his own will. However, for booking consultation services,
          customer can seek consultation as per booking date and time. In case customer is not available as per his
          booking date and time, slot will not be transferrable and hence no refund will be given.
        </p>
        <p className="mb-4">
          However, if consultant is not available as per the booking time frame, the slot can be cancelled and customer
          will be refunded full amount. The amount will be credited back in 7 working days in customer bank account.
        </p>

        <h2 className="text-lg font-semibold mb-2">Payment Terms & Conditions</h2>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>Amount is to be paid in Indian Rupees.</li>
          <li>
            Online payment on the payment gateway can be made using any available modes of online payment (Debit
            Card/Credit Card/Net Banking/Wallet/UPI, etc.) as per your convenience.
          </li>
          <li>
            It is the sole responsibility of the Users to ensure that payments for Booking/Profile Branding, as
            notified, are deposited within the stipulated time. Paper deals shall not be responsible for any delay in
            receipt of payment due to any reason.
          </li>
          <li>Payment gateway transaction charges are to be borne by the payee.</li>
          <li>
            In no event shall the Portal be liable for any damages whatsoever arising out of the use or inability to use
            the Online Payment System.
          </li>
          <li>
            Payment once paid will not be refunded under any circumstances. However, if there is any excess payment or
            multiple payment for any reason, the payer may file a claim for a refund with adequate proof of evidence.
            The final decision of settlement of any such claim shall rest with the authorities.
          </li>
          <li>Paper deals reserve the right to add or modify any of the above terms and conditions subsequently.</li>
        </ul>

        <h2 className="text-lg font-semibold mb-2">
          What to Do If Multiple Payments Are Made or Receipt Is Not Obtained
        </h2>
        <p className="mb-4">
          Users are advised to kindly check with their bank account in case of any doubt before making a second payment.
          Do not pay immediately for the second time if you have already done an online transaction and are unclear
          about the status of the payment.
        </p>
        <p>
          If the payment is successful but no receipt is obtained, or if, by mistake, a second or multiple payment has
          been made, the user can write to{" "}
          <a href="mailto:support@paperdeals.in" className="text-blue-500 underline">
            support@paperdeals.in
          </a>
          .
        </p>
      </div>


    </main>
  );
}
