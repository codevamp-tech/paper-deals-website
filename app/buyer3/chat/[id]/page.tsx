"use client";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getUserFromToken } from "@/hooks/use-token";
import io from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`); // Backend URL

interface ChatMessage {
  id: number;
  senderId: string;
  receiverId: string;
  text: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const { id: buyerId } = params;
  const user = getUserFromToken();
  const userId = user?.user_id;

  // Fetch previous messages
  useEffect(() => {
    if (!userId || !buyerId) return;
    const fetchPreviousMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/message/conversation?senderId=${userId}&receiverId=${buyerId}`
        );
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        const formattedMessages = data.map((msg: any) => ({
          id: msg.msg_id,
          senderId: msg.outgoing_msg_id,
          receiverId: msg.incoming_msg_id,
          text: msg.msg,
        }));
        setMessages(formattedMessages);
      } catch (err) {
        console.error("Error fetching previous messages:", err);
      }
    };
    fetchPreviousMessages();
  }, [userId, buyerId]);

  // Socket.IO join room + listener
  useEffect(() => {
    if (!userId || !buyerId) return;
    socket.emit("joinRoom", { userId, receiverId: buyerId });
    socket.on("receiveMessage", (message: any) => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, senderId: message.senderId, receiverId: message.receiverId, text: message.text },
      ]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, buyerId]);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || !userId || !buyerId) return;
    const message = { senderId: userId, receiverId: buyerId, text: input };
    socket.emit("sendMessage", message);
    setInput("");
  };

  return (
    <Card className="w-full h-full  flex flex-col bg-white text-black">
      <CardHeader>
        <CardTitle className="text-black">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">Start a conversation!</div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${message.senderId === userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.senderId === userId
                      ? "bg-gray-200 text-black"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex p-4 border-t">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          className="flex-1 mr-2 text-black bg-white"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </CardFooter>
    </Card>
  );
}
