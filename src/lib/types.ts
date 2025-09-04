import type { LucideIcon } from "lucide-react";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
  imageUrl?: string;
};

export type AIPersonality = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  prompt: string;
};

export type AIModel = "gemini" | "chatgpt" | "claude" | "automatic";

export type Chat = {
  id: string;
  name: string;
  personalityId: string;
  messages: Message[];
  createdAt: string;
  model: AIModel;
};
