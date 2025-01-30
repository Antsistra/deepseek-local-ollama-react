import { useState } from "react";
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import CardMessage from "./components/CardMessage";
import ollama from "ollama";

type Message = {
  role: "assistant" | "user";
  content: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Halo! Ada yang bisa saya bantu?" },
  ]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const model = import.meta.env.VITE_MODEL;

    if (input.trim()) {
      const newMessage: Message = { role: "user", content: input };
      setMessages((prevMessages) => [
        ...prevMessages,
        newMessage,
        { role: "assistant", content: "" },
      ]);
      setInput("");
      setIsWaiting(true);

      let responseContent = "";
      const stream = await ollama.chat({
        model: model,
        messages: [...messages, newMessage],
        stream: true,
      });

      for await (const chunk of stream) {
        if (
          chunk &&
          chunk.message &&
          typeof chunk.message.content === "string"
        ) {
          responseContent += chunk.message.content.replace(
            /<think>|<\/think>/g,
            ""
          );

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = {
              role: "assistant",
              content: responseContent,
            };
            return updatedMessages;
          });
        }
      }
      setIsWaiting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <main className="flex-grow overflow-hidden p-4">
        <div className="max-w-4xl mx-auto h-full flex flex-col bg-gray-950/30 rounded-xl shadow-xl backdrop-blur-sm">
          <div className="flex-grow overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <CardMessage
                key={index}
                role={message.role}
                message={message.content}
              />
            ))}
          </div>

          <div className="p-4 border-t border-gray-700/50">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <Textarea
                placeholder="Ketik pesan Anda di sini..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow p-3 rounded-xl bg-gray-800/50 border-gray-700 text-gray-100 placeholder:text-gray-400
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          transition-all duration-200 resize-none"
                disabled={isWaiting}
                rows={1}
              />
              <Button
                type="submit"
                disabled={isWaiting}
                className="p-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white
                         transition-all duration-200 hover:scale-105 disabled:opacity-50
                         flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
