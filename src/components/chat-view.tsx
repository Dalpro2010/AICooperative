"use client";

import React, { useRef, useEffect } from "react";
import { SendHorizonal, Download, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/chat-message";
import { useToast } from "@/hooks/use-toast";
import type { useChats } from "@/hooks/use-chats";
import { aiChatPersonality } from "@/ai/flows/ai-chat-personality";
import { personalities } from "@/lib/personalities";
import type { Message } from "@/lib/types";

type ChatViewProps = ReturnType<typeof useChats>;

export default function ChatView({ activeChat, addMessage, updateLastMessage }: ChatViewProps) {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [isResponding, setIsResponding] = React.useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [activeChat?.messages]);
  
  const handleExport = () => {
    if (!activeChat) return;
    const conversation = activeChat.messages
      .map(
        (msg) =>
          `${msg.role === "user" ? "You" : activeChat.name}:\n${msg.content}`
      )
      .join("\n\n");
    const blob = new Blob([conversation], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeChat.name.replace(/\s/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeChat || isResponding) return;

    const userInput = input;
    setInput("");
    setIsResponding(true);

    addMessage(activeChat.id, { role: "user", content: userInput });
    addMessage(activeChat.id, {
      role: "assistant",
      content: "",
      isLoading: true,
    });

    try {
      const personality = personalities.find(p => p.id === activeChat.personalityId);
      const chatHistory = activeChat.messages
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");
      
      const response = await aiChatPersonality({
        personality: personality?.prompt || 'helpful assistant',
        userMessage: userInput,
        chatHistory: chatHistory,
      });

      updateLastMessage(activeChat.id, {
        content: response.response,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error calling AI:", error);
      updateLastMessage(activeChat.id, {
        content: "Lo siento, ocurrió un error al procesar tu solicitud.",
        isLoading: false,
      });
      toast({
        title: "Error",
        description: "No se pudo obtener una respuesta de la IA.",
        variant: "destructive",
      });
    } finally {
      setIsResponding(false);
    }
  };

  if (!activeChat) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold font-headline">{activeChat.name}</h2>
        <Button variant="ghost" size="icon" onClick={handleExport} aria-label="Exportar conversación">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {activeChat.messages.map((message: Message) => (
            <ChatMessage
              key={message.id}
              message={message}
              personality={personalities.find(p => p.id === activeChat.personalityId)}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="pr-20 min-h-[60px] resize-none"
            disabled={isResponding}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2">
            <p className="text-xs text-muted-foreground hidden md:block">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <CornerDownLeft size={12}/>
              </kbd>{" "}
              Enviar
            </p>
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isResponding}
              aria-label="Enviar mensaje"
            >
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
