import { BotMessageSquare } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="relative flex w-full max-w-2xl flex-col items-center justify-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        <BotMessageSquare className="h-20 w-20 text-primary mb-6" />
        <h2 className="text-3xl font-bold font-headline mb-2">
          Bienvenido a AICooperative
        </h2>
        <p className="text-muted-foreground max-w-md">
          Selecciona un chat de la barra lateral o crea uno nuevo para comenzar a conversar.
        </p>
      </div>
    </div>
  );
}
