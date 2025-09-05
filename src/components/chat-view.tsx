
"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { Plus, X, AlertTriangle, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/chat-message";
import { useToast } from "@/hooks/use-toast";
import type { useChats } from "@/hooks/use-chats";
import { aiChatPersonality } from "@/ai/flows/ai-chat-personality";
import { personalities } from "@/lib/personalities";
import type { Message, AIModel } from "@/lib/types";
import { useSettings } from "@/hooks/use-settings.tsx";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { cn } from "@/lib/utils";

type ChatViewProps = ReturnType<typeof useChats>;

export default function ChatView({ activeChat, addMessage, updateLastMessage }: ChatViewProps) {
  const { toast } = useToast();
  const [input, setInput] = React.useState("");
  const [isResponding, setIsResponding] = React.useState(false);
  const [image, setImage] = React.useState<{ url: string; file: File } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { settings, isLoaded: settingsLoaded } = useSettings();

  const [isListening, setIsListening] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [activeChat?.messages]);
  
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'es-ES';

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setInput(prevInput => prevInput + finalTranscript);
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          toast({
            title: "Error de reconocimiento de voz",
            description: `Ocurrió un error: ${event.error}`,
            variant: "destructive",
          });
          setIsListening(false);
        };

        recognitionRef.current = recognition;
    } else {
        console.warn("Speech Recognition API not supported in this browser.");
    }
  }, [toast]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "No soportado",
        description: "El reconocimiento de voz no es compatible con tu navegador.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };


  const availableModels = React.useMemo(() => {
    if (!settingsLoaded) return [];
    const models: AIModel[] = [];
    if (settings.geminiApiKey) models.push("gemini");
    if (settings.chatgptApiKey) models.push("chatgpt");
    if (settings.claudeApiKey) models.push("claude");
    return models;
  }, [settings, settingsLoaded]);

  const isApiKeyMissing = React.useMemo(() => {
    if (!settingsLoaded) return true;
    return availableModels.length === 0;
  }, [settingsLoaded, availableModels]);


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

    if (isApiKeyMissing) {
      toast({
        title: "Falta la clave de API",
        description: "Por favor, configura al menos una clave de API en los ajustes.",
        variant: "destructive",
      });
      return;
    }

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
        model: activeChat.model,
        photoDataUri: photoDataUri,
        availableModels: availableModels as ('gemini' | 'chatgpt' | 'claude')[],
        customInstructions: activeChat.customInstructions,
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
        {isApiKeyMissing && settingsLoaded ? (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Faltan claves de API</AlertTitle>
                <AlertDescription>
                    Por favor, ve a <Link href="/settings" className="font-semibold underline">Ajustes</Link> para configurar al menos una clave de API.
                </AlertDescription>
            </Alert>
        ) : (
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
            <div className="flex w-full items-center gap-2 rounded-full bg-muted p-2">
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
                disabled={isResponding || !settingsLoaded}
                aria-label="Adjuntar imagen"
                className="shrink-0 rounded-full bg-muted hover:bg-muted"
              >
                <Plus />
              </Button>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta lo que quieras"
                className="pr-20 min-h-0 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 p-2 focus-visible:ring-offset-0"
                disabled={isResponding || !settingsLoaded}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    formRef.current?.requestSubmit();
                  }
                }}
                rows={1}
              />
              <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isResponding || !settingsLoaded}
                    aria-label="Entrada de voz"
                    onClick={toggleListening}
                    className={cn(
                      "shrink-0 rounded-full bg-muted hover:bg-muted",
                      isListening && "bg-primary/20 text-primary animate-pulse"
                    )}
                >
                    <Mic />
                </Button>
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={(!input.trim() && !image) || isResponding || !settingsLoaded}
                  aria-label="Enviar mensaje"
                  className="shrink-0 rounded-full bg-muted hover:bg-muted"
                >
                  <Send />
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
