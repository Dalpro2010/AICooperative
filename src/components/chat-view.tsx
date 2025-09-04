"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { SendHorizonal, ImagePlus, X } from "lucide-react";
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
  const [image, setImage] = React.useState<{ url: string; file: File } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [activeChat?.messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImage({ url, file });
    }
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !image) || !activeChat || isResponding) return;

    const userInput = input;
    const userImage = image;

    setInput("");
    setImage(null);
    setIsResponding(true);

    addMessage(activeChat.id, { 
      role: "user", 
      content: userInput,
      imageUrl: userImage?.url
    });
    addMessage(activeChat.id, {
      role: "assistant",
      content: "",
      isLoading: true,
    });

    try {
      let photoDataUri: string | undefined = undefined;
      if (userImage) {
        photoDataUri = await toBase64(userImage.file);
      }

      const personality = personalities.find(p => p.id === activeChat.personalityId);
      const chatHistory = activeChat.messages
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");
      
      const response = await aiChatPersonality({
        personality: personality?.prompt || 'helpful assistant',
        userMessage: userInput,
        chatHistory: chatHistory,
        photoDataUri: photoDataUri,
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
          {image && (
            <div className="relative mb-2 w-24 h-24">
              <Image src={image.url} alt="Image preview" layout="fill" objectFit="cover" className="rounded-md" />
              <Button
                size="icon"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={() => setImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="pr-28 min-h-[60px] resize-none"
            disabled={isResponding}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2">
             <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
             <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => imageInputRef.current?.click()}
              disabled={isResponding}
              aria-label="Adjuntar imagen"
            >
              <ImagePlus className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={(!input.trim() && !image) || isResponding}
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
