"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/hooks/use-settings";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { settings, setSetting, isLoaded } = useSettings();

  const handleSave = () => {
    // The settings are already saved on change by the hook
    toast({
      title: "Ajustes guardados",
      description: "Tus claves de API han sido guardadas correctamente.",
    });
    router.push("/");
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <p>Cargando ajustes...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Link href="/">
            <Button size="icon" variant="outline" className="sm:hidden">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Volver</span>
            </Button>
          </Link>
          <h1 className="text-xl font-semibold md:text-2xl">Ajustes</h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Gestiona las claves de API para los diferentes modelos de IA.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="gemini-api-key">Gemini API Key</Label>
                  <Input
                    id="gemini-api-key"
                    type="password"
                    placeholder="Introduce tu clave de API de Gemini"
                    value={settings.geminiApiKey || ""}
                    onChange={(e) => setSetting("geminiApiKey", e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="chatgpt-api-key">ChatGPT API Key</Label>
                  <Input
                    id="chatgpt-api-key"
                    type="password"
                    placeholder="Introduce tu clave de API de ChatGPT"
                    value={settings.chatgptApiKey || ""}
                    onChange={(e) => setSetting("chatgptApiKey", e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="claude-api-key">Claude API Key</Label>
                  <Input
                    id="claude-api-key"
                    type="password"
                    placeholder="Introduce tu clave de API de Claude"
                    value={settings.claudeApiKey || ""}
                    onChange={(e) => setSetting("claudeApiKey", e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={handleSave}>Guardar</Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
