"use client";

import ChatLayout from "@/components/chat-layout";
import { useChats } from "@/hooks/use-chats";

export default function Home() {
  const chatState = useChats();

  return <ChatLayout {...chatState} />;
}
