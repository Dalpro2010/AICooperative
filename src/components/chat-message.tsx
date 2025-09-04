"use client";

import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { AIPersonality, Message } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

interface ChatMessageProps {
  message: Message;
  personality?: AIPersonality;
}

export default function ChatMessage({ message, personality }: ChatMessageProps) {
  const isUser = message.role === "user";
  const Icon = personality?.icon || User;

  return (
    <div
      className={cn(
        "flex items-start gap-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 border bg-card shrink-0">
          <AvatarImage asChild>
            <div className="flex h-full w-full items-center justify-center bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </AvatarImage>
          <AvatarFallback>{personality?.name[0] || "A"}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-xl p-3 px-4 text-sm shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card rounded-bl-none border"
        )}
      >
        {message.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] bg-muted-foreground/20" />
            <Skeleton className="h-4 w-[200px] bg-muted-foreground/20" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        )}
      </div>
    </div>
  );
}
