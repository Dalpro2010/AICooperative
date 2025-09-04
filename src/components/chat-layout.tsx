"use client";

import type { useChats } from "@/hooks/use-chats";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import SidebarContentComponent from "@/components/sidebar-content";
import ChatView from "@/components/chat-view";
import EmptyChat from "@/components/empty-chat";
import ThemeToggle from "@/components/theme-toggle";
import { Skeleton } from "./ui/skeleton";

type ChatLayoutProps = ReturnType<typeof useChats>;

export default function ChatLayout(props: ChatLayoutProps) {
  const { activeChat, isLoaded } = props;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="bg-sidebar text-sidebar-foreground border-r"
        >
          <SidebarHeader>
            <h1 className="text-xl font-semibold font-headline truncate group-data-[collapsible=icon]:hidden">
              AICooperative
            </h1>
          </SidebarHeader>

          <SidebarContent>
            {isLoaded ? (
              <SidebarContentComponent {...props} />
            ) : (
              <div className="p-2 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
          </SidebarContent>

          <SidebarFooter>
            <ThemeToggle />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="p-0 flex flex-col">
          <header className="flex items-center gap-2 p-3 border-b h-14">
            <SidebarTrigger className="md:hidden" />
            <h2 className="text-lg font-semibold font-headline truncate">
              {activeChat?.name || "Welcome"}
            </h2>
          </header>
          <main className="flex-1 overflow-y-auto">
            {activeChat ? <ChatView {...props} /> : <EmptyChat />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
