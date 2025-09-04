"use client";

import React from "react";
import { MoreHorizontal, Plus, Trash2, Edit, ArrowLeft } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { personalities, models } from "@/lib/personalities";
import type { AIModel } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import type { useChats } from "@/hooks/use-chats";

function RenameChatDialog({
  chatName,
  onRename,
}: {
  chatName: string;
  onRename: (newName: string) => void;
}) {
  const [name, setName] = React.useState(chatName);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onRename(name.trim());
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Renombrar</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renombrar Chat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nuevo nombre del chat"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NewChatDialog({ createChat }: { createChat: (p: any, m: AIModel) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [step, setStep] = React.useState<"model" | "personality">("model");
  const [selectedModel, setSelectedModel] = React.useState<AIModel | null>(null);

  const handleModelSelect = (model: AIModel) => {
    setSelectedModel(model);
    setStep("personality");
  };

  const handlePersonalitySelect = (personality: any) => {
    if (selectedModel) {
      createChat(personality, selectedModel);
      setIsOpen(false);
      setStep("model");
      setSelectedModel(null);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setStep("model");
        setSelectedModel(null);
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start">
          <Plus className="mr-2" />
          Nuevo Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {step === "personality" && (
            <Button variant="ghost" size="sm" className="absolute left-4 top-4 px-2" onClick={() => setStep("model")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          )}
          <DialogTitle>
            {step === "model" ? "Elige un Modelo de IA" : "Elige una Personalidad"}
          </DialogTitle>
          <DialogDescription>
            {step === 'model' ? 'Selecciona la IA que potenciará tu conversación.' : 'Cada personalidad ofrece una experiencia de chat única.'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {step === "model" &&
            models.map((m) => (
              <button
                key={m.id}
                className="p-4 border rounded-lg hover:bg-accent text-left flex items-start gap-4 transition-colors"
                onClick={() => handleModelSelect(m.id as AIModel)}
              >
                <m.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                </div>
              </button>
            ))}
          {step === "personality" &&
            personalities.map((p) => (
              <button
                key={p.id}
                className="p-4 border rounded-lg hover:bg-accent text-left flex items-start gap-4 transition-colors"
                onClick={() => handlePersonalitySelect(p)}
              >
                <p.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </div>
              </button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function SidebarContent({
  chats,
  activeChatId,
  createChat,
  deleteChat,
  renameChat,
  setActiveChatId,
}: SidebarContentProps) {

  return (
    <div className="flex flex-col h-full p-2">
      <NewChatDialog createChat={createChat} />
      <SidebarMenu className="mt-4 flex-1">
        {chats.map((chat) => {
          const personality = personalities.find(
            (p) => p.id === chat.personalityId
          );
          const modelInfo = models.find(m => m.id === chat.model) || models.find(m => m.id === "gemini");
          const Icon = modelInfo?.icon || personalities[personalities.length-1].icon;

          return (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                onClick={() => setActiveChatId(chat.id)}
                isActive={chat.id === activeChatId}
                tooltip={chat.name}
              >
                <Icon />
                <span>{chat.name}</span>
              </SidebarMenuButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <RenameChatDialog
                    chatName={chat.name}
                    onRename={(newName) => renameChat(chat.id, newName)}
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-destructive"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Estás seguro de que quieres eliminar este chat?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará
                          permanentemente la conversación.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteChat(chat.id)}
                          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </div>
  );
}
