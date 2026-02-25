"use client";

import { useState, useEffect } from "react";
import { getUserFromToken } from "@/hooks/use-token";

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [detailedSubscriptions, setDetailedSubscriptions] = useState<any[]>([]);
  const [chatPayments, setChatPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = getUserFromToken();


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ Subscription Plans
        const subsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription-plans`);
        const subsData = await subsRes.json();
        if (subsData.success) {
          setSubscriptions(subsData.plans);
        }

        // ✅ Detailed Subscriptions
        const detailedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscriptions`);
        const detailedData = await detailedRes.json();
        if (detailedData.success) {
          setDetailedSubscriptions(detailedData.subscriptions || []);
        }

        // ✅ Chat Payments
        const chatRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consultant-slots?user_id=${user?.user_id}&user_role=${user?.user_role}`);
        const chatData = await chatRes.json();
        if (chatData.success) {
          setChatPayments(chatData.slots || []);
        }

        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadInvoice = (file: string) => {
    alert(`Downloading ${file}`);
  };

  const StatusBadge = ({ status }: { status: string | number }) => {
    const normalizedStatus =
      status === 1 || status === "1"
        ? "subscribed"
        : status === 0 || status === "0"
          ? "inactive"
          : status;

    const colors: Record<string, string> = {
      subscribed: "bg-teal-500",
      paid: "bg-green-500",
      inactive: "bg-gray-500",
    };

    return (
      <span
        className={`text-black px-2 py-1 rounded ${colors[normalizedStatus] || "bg-gray-500"
          }`}
      >
        {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
      </span>
    );
  };


  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 space-y-12">
      {/* Subscription Plans */}
      <div>
        <h2 className="text-black font-bold mb-4">Subscriptions</h2>
        <table className="table-black w-full border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Plan Name</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td className="border px-4 py-2">{sub.id}</td>
                <td className="border px-4 py-2">{sub.name}</td>
                <td className="border px-4 py-2">{sub.price}</td>
                <td className="border px-4 py-2">
                  {sub.subscription_status ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed Subscriptions */}
      <div>
        <h2 className="text-black font-bold mb-4">Subscriptions Details</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-black-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Buyer</th>
              <th className="border px-4 py-2">Plan</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Invoice</th>
              <th className="border px-4 py-2">Start Date</th>
              <th className="border px-4 py-2">End Date</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {detailedSubscriptions.map((sub) => (
              <tr key={sub.id}>
                <td className="border px-4 py-2">{sub.id}</td>
                <td className="border px-4 py-2">{sub.buyer || sub.user?.name}</td>
                <td className="border px-4 py-2">{sub.plan || sub.planName}</td>
                <td className="border px-4 py-2">{sub.amount}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => downloadInvoice(sub.invoice)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Download
                  </button>
                </td>
                <td className="border px-4 py-2">{sub.startDate}</td>
                <td className="border px-4 py-2">{sub.endDate}</td>
                <td className="border px-4 py-2">
                  <StatusBadge status={sub.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chat Payment History */}
      <div>
        <h2 className="text-black font-bold mb-4">Chat Payment History</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Buyer/Seller</th>
              <th className="border px-4 py-2">Consultant</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Invoice</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {chatPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="border px-4 py-2">{payment.id}</td>
                <td className="border px-4 py-2">{payment.Buyer.name}</td>
                <td className="border px-4 py-2">{payment.Consultant.name}</td>
                <td className="border px-4 py-2">{payment.consultant_price}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => downloadInvoice(payment.invoice)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Download
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <StatusBadge status={payment.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
