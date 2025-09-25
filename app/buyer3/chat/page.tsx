"use client";

import { getCookie } from "@/components/getcookie"
import { useState, useEffect } from "react";

interface ChatUser {
  id: number;
  buyer: string;
  consultant: string;
  message: string;
  incoming_msg_id: number;
  outgoing_msg_id: number;
}

interface Message {
  msg_id: number;
  incoming_msg_id: number;
  outgoing_msg_id: number;
  message: string;
  created_at: string;
  incomingUser?: { name: string };
  outgoingUser?: { name: string };
}

export default function ChatUsersPage() {
  const [search, setSearch] = useState("");
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie("token")
  const [selectedThread, setSelectedThread] = useState<ChatUser | null>(null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [convLoading, setConvLoading] = useState(false);

  // Fetch chat threads
  useEffect(() => {
    const fetchChatThreads = async () => {
      try {
        const res = await fetch("https://paper-deal-server.onrender.com/api/message/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch chat threads");
        const data = await res.json();
        setChatUsers(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchChatThreads();
  }, []);

  // Fetch conversation for a selected thread
  const handleThreadClick = async (thread: ChatUser) => {
    setSelectedThread(thread);
    setConvLoading(true);
    setConversation([]);
    try {
      const res = await fetch(
        `https://paper-deal-server.onrender.com/api/message/conversation?senderId=${thread.incoming_msg_id}&receiverId=${thread.outgoing_msg_id}`
      );
      if (!res.ok) throw new Error("Failed to fetch conversation");
      const data = await res.json();
      setConversation(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setConvLoading(false);
    }
  };

  // Filter chat threads
  const filtered = chatUsers.filter(
    (u) =>
      u.buyer.toLowerCase().includes(search.toLowerCase()) ||
      u.consultant.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6">Loading chat users...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <h1 className="text-2xl font-semibold mb-4">Chat Users</h1>

      {/* Top Bar */}
      <div className="flex justify-between mb-4">
        <div>
          <label className="mr-2">Search:</label>
          <input
            type="text"
            className="border p-1 rounded bg-white text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Chat Threads Table */}
      <table className="w-full border border-gray-300 bg-white rounded shadow-sm text-black">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Buyer</th>
            <th className="p-2 border">Consultant</th>
            <th className="p-2 border">Last Message</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((thread) => (
            <tr
              key={thread.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => handleThreadClick(thread)}
            >
              <td className="p-2 border">{thread.id}</td>
              <td className="p-2 border">{thread.buyer}</td>
              <td className="p-2 border">{thread.consultant}</td>
              <td className="p-2 border text-blue-500">{thread.message}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Conversation Panel */}
      {selectedThread && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Chat between {selectedThread.buyer} and {selectedThread.consultant}
          </h2>
          {convLoading ? (
            <p>Loading conversation...</p>
          ) : conversation.length === 0 ? (
            <p className="text-gray-500">No messages yet.</p>
          ) : (
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
              {conversation.map((msg) => (
                <div
                  key={msg.msg_id}
                  className={`p-2 rounded ${msg.outgoing_msg_id === selectedThread.outgoing_msg_id
                    ? "bg-blue-100 self-end"
                    : "bg-gray-100 self-start"
                    }`}
                >
                  <strong>{msg.outgoingUser?.name || "Unknown"}: </strong>
                  {msg.msg}
                  <div className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>


          )}
        </div>
      )}
    </div>
  );
}
