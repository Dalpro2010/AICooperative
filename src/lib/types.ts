import type { LucideIcon } from "lucide-react";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
};

export type AIPersonality = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  prompt: string;
};

export type Chat = {
  id: string;
  name: string;
  personalityId: string;
  messages: Message[];
  createdAt: string;
};
