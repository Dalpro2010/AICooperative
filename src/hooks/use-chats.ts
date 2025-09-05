"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Chat, Message, AIPersonality, AIModel } from "@/lib/types";

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
          const firstChat = parsedChats.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })[0];
          setActiveChatId(firstChat.id);
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
        // We need to handle the case where a message has a blob url, which can't be stringified
        const chatsToStore = chats.map(chat => ({
          ...chat,
          messages: chat.messages.map(message => {
            if (message.imageUrl && message.imageUrl.startsWith('blob:')) {
              return { ...message, imageUrl: undefined }; // Don't store blob URLs
            }
            return message;
          })
        }));
        localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chatsToStore));
      } catch (error) {
        console.error("Failed to save chats to localStorage", error);
      }
    }
  }, [chats, isLoaded]);

  const createChat = useCallback((personality: AIPersonality, model: AIModel) => {
    setChats((prevChats) => {
      const newChatName = "Nuevo Chat";
      const existingNewChats = prevChats.filter(chat => chat.name.startsWith(newChatName)).length;
      const newChat: Chat = {
        id: crypto.randomUUID(),
        name: existingNewChats > 0 ? `${newChatName} ${existingNewChats + 1}` : newChatName,
        personalityId: personality.id,
        messages: [],
        createdAt: new Date().toISOString(),
        model: model,
        isPinned: false,
      };
      const updatedChats = [newChat, ...prevChats];
      setActiveChatId(newChat.id);
      return updatedChats;
    });
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats((prevChats) => {
      const newChats = prevChats.filter((chat) => chat.id !== chatId);
      if (activeChatId === chatId) {
        const sortedChats = [...newChats].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setActiveChatId(sortedChats.length > 0 ? sortedChats[0].id : null);
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

  const togglePinChat = useCallback((chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
      )
    );
  }, []);

  const setCustomInstructions = useCallback((chatId: string, instructions: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, customInstructions: instructions } : chat
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
          if (!lastMessage) return chat;
          const updatedMessages = [...chat.messages.slice(0, -1), { ...lastMessage, ...updatedMessageContent }];
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      })
    );
  }, []);
  
  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [chats]);
  
  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId), [chats, activeChatId]);

  return {
    chats: sortedChats,
    activeChat,
    activeChatId,
    isLoaded,
    createChat,
    deleteChat,
    renameChat,
    addMessage,
    updateLastMessage,
    setActiveChatId,
    togglePinChat,
    setCustomInstructions,
  };
}