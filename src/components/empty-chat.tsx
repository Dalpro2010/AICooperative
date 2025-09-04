import { BotMessageSquare } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center p-4">
      <BotMessageSquare className="h-20 w-20 text-muted-foreground/50 mb-4" />
      <h2 className="text-2xl font-bold font-headline mb-2">Bienvenido a AICooperative</h2>
      <p className="text-muted-foreground max-w-md">
        Selecciona un chat existente o crea uno nuevo para comenzar a conversar con nuestras inteligencias artificiales especializadas.
      </p>
    </div>
  );
}
