"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getUserFromToken } from "@/hooks/use-token";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

interface ChatMessage {
  id: number;
  senderId: string;
  text: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const params = useParams();
  const { id: SellerId } = params;

  const user = getUserFromToken();
  const userId = user?.user_id;

  useEffect(() => {
    if (!userId || !SellerId) return;

    // join private room
    socket.emit("joinRoom", { userId, receiverId: SellerId });

    // listen for messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, { id: prev.length + 1, ...message }]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, SellerId]);

  const handleSendMessage = () => {
    if (!input.trim() || !userId || !SellerId) return;

    const message = { senderId: userId, receiverId: SellerId as string, text: input };

    // send to backend
    socket.emit("sendMessage", message);

    // update UI immediately
    setMessages((prev) => [...prev, { id: prev.length + 1, ...message }]);
    setInput("");
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with Seller {SellerId}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              Start a conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${message.senderId === userId ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${message.senderId === userId
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
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
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="flex-1 mr-2"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </CardFooter>
    </Card>
  );
}
