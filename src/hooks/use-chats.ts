"use client";

import { useState, useEffect, useCallback } from "react";
import type { Chat, Message, AIPersonality } from "@/lib/types";
import { personalities } from "@/lib/personalities";

const CHATS_STORAGE_KEY = "aiCooperativeChats";

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedChats = localStorage.getItem(CHATS_STORAGE_KEY);
      if (storedChats) {
        const parsedChats: Chat[] = JSON.parse(storedChats);
        setChats(parsedChats);
        if (parsedChats.length > 0 && !activeChatId) {
          setActiveChatId(parsedChats[0].id);
        }
      }
    } catch (error) {
      console.error("Failed to load chats from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
      } catch (error) {
        console.error("Failed to save chats to localStorage", error);
      }
    }
  }, [chats, isLoaded]);

  const createChat = useCallback((personality: AIPersonality) => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      name: `Nuevo Chat - ${personality.name}`,
      personalityId: personality.id,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats((prevChats) => [newChat, ...prevChats]);
    setActiveChatId(newChat.id);
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats((prevChats) => {
      const newChats = prevChats.filter((chat) => chat.id !== chatId);
      if (activeChatId === chatId) {
        setActiveChatId(newChats.length > 0 ? newChats[0].id : null);
      }
      return newChats;
    });
  }, [activeChatId]);

  const renameChat = useCallback((chatId: string, newName: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, name: newName } : chat
      )
    );
  }, []);

  const addMessage = useCallback((chatId: string, message: Omit<Message, 'id'>) => {
    const newMessage: Message = { ...message, id: crypto.randomUUID() };
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );
  }, []);

  const updateLastMessage = useCallback((chatId: string, updatedMessageContent: Partial<Message>) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          const lastMessage = chat.messages[chat.messages.length - 1];
          const updatedMessages = [...chat.messages.slice(0, -1), { ...lastMessage, ...updatedMessageContent }];
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      })
    );
  }, []);
  
  const activeChat = chats.find((chat) => chat.id === activeChatId);

  return {
    chats,
    activeChat,
    activeChatId,
    isLoaded,
    createChat,
    deleteChat,
    renameChat,
    addMessage,
    updateLastMessage,
    setActiveChatId,
  };
}
