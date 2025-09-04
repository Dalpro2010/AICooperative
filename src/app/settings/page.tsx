"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
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
              <CardTitle>Preferencias de la aplicación</CardTitle>
              <CardDescription>
                Gestiona la configuración de tu aplicación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-6">
                <p className="text-sm text-muted-foreground">
                  Aquí es donde aparecerán los futuros ajustes de la aplicación.
                </p>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
