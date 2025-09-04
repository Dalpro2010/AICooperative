import { Bot, Code, GraduationCap, Heart, Sparkles } from "lucide-react";
import type { AIPersonality } from "./types";

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
