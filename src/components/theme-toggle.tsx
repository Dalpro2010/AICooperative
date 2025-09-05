"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-full justify-center group-data-[collapsible=icon]:justify-center"
      aria-label="Toggle theme"
    >
      {mounted && (theme === 'light' ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1Readrem] w-[1.2rem]" />
      ))}
      <span className="group-data-[collapsible=icon]:hidden ml-2">
        {mounted && (theme === 'light' ? 'Modo Oscuro' : 'Modo Claro')}
      </span>
    </Button>
  );
}
