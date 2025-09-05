"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import type { AppSettings } from "@/lib/types";

const SETTINGS_STORAGE_KEY = "aiCooperativeSettings";

const defaultSettings: AppSettings = {
  geminiApiKey: null,
  chatgptApiKey: null,
  claudeApiKey: null,
  language: 'es',
};

interface SettingsContextType {
  settings: AppSettings;
  setSetting: (key: keyof AppSettings, value: string | null) => void;
  isLoaded: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
    }
  }, [settings, isLoaded]);

  const setSetting = useCallback((key: keyof AppSettings, value: string | null) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSetting, isLoaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
