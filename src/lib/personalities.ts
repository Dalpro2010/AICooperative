import { Bot, Code, GraduationCap, Heart, Sparkles, BrainCircuit } from "lucide-react";
import type { AIPersonality, AIModel } from "./types";

export const models: { id: AIModel | "all"; name: string; icon: LucideIcon; description: string }[] = [
    { id: "automatic", name: "Automático", icon: BrainCircuit, description: "La IA elige el mejor modelo para ti." },
    { id: "gemini", name: "Gemini", icon: Sparkles, description: "El modelo más avanzado de Google." },
    { id: "chatgpt", name: "ChatGPT", icon: Bot, description: "El popular modelo de OpenAI." },
    { id: "claude", name: "Claude", icon: Bot, description: "El modelo conversacional de Anthropic." },
];

export const personalities: AIPersonality[] = [
  {
    id: "programmer",
    name: "Programador",
    description: "Un experto en desarrollo de software y algoritmos.",
    icon: Code,
    prompt: "programmer",
  },
  {
    id: "teacher",
    name: "Profesor",
    description: "Un educador paciente que explica temas complejos.",
    icon: GraduationCap,
    prompt: "teacher",
  },
  {
    id: "psychologist",
    name: "Psicólogo",
    description: "Un terapeuta empático para apoyo emocional.",
    icon: Heart,
    prompt: "psychologist",
  },
  {
    id: "creative",
    name: "Creativo",
    description: "Un escritor y artista lleno de ideas innovadoras.",
    icon: Sparkles,
    prompt: "creative writer",
  },
  {
    id: "default",
    name: "Asistente General",
    description: "Una IA útil para tareas y preguntas generales.",
    icon: Bot,
    prompt: "helpful assistant",
  },
];
