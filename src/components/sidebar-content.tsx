"use client";

import {
  MoreHorizontal,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { personalities } from "@/lib/personalities";
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
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import React from "react";
import type { useChats } from "@/hooks/use-chats";

type SidebarContentProps = ReturnType<typeof useChats>;

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

export default function SidebarContent({
  chats,
  activeChatId,
  createChat,
  deleteChat,
  renameChat,
  setActiveChatId,
}: SidebarContentProps) {
  const [newChatDialogOpen, setNewChatDialogOpen] = React.useState(false);

  return (
    <div className="flex flex-col h-full p-2">
      <Dialog open={newChatDialogOpen} onOpenChange={setNewChatDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <Plus className="mr-2" />
            Nuevo Chat
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Elige una Personalidad de IA</DialogTitle>
          </DialogHeader>
          <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalities.map((p) => (
              <button
                key={p.id}
                className="p-4 border rounded-lg hover:bg-accent text-left flex items-start gap-4 transition-colors"
                onClick={() => {
                  createChat(p);
                  setNewChatDialogOpen(false);
                }}
              >
                <p.icon className="h-6 w-6 text-primary mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {p.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <SidebarMenu className="mt-4 flex-1">
        {chats.map((chat) => {
          const personality = personalities.find(
            (p) => p.id === chat.personalityId
          );
          const Icon = personality?.icon || personalities[personalities.length-1].icon;

          return (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                onClick={() => setActiveChatId(chat.id)}
                isActive={chat.id === activeChatId}
                tooltip={chat.name}
                className="pr-8"
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
