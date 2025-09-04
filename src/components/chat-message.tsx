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
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8 border">
        <AvatarImage asChild>
          <div className="flex h-full w-full items-center justify-center bg-background">
             <Icon className={cn("h-5 w-5", isUser ? "text-primary" : "text-accent")} />
          </div>
        </AvatarImage>
        <AvatarFallback>
            {isUser ? "U" : "A"}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "max-w-[75%] rounded-lg p-3 shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card border"
        )}
      >
        {message.isLoading ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-muted-foreground/20" />
                <Skeleton className="h-4 w-[200px] bg-muted-foreground/20" />
            </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        )}
      </div>
    </div>
  );
}
