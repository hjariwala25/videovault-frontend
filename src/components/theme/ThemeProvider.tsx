"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "videovault-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Apply theme function
  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    // Force clear both classes first
    root.classList.remove("light", "dark");

    // Then add the appropriate one
    root.classList.add(isDark ? "dark" : "light");
  };

  // Update theme when it changes
  useEffect(() => {
    if (!mounted) return;

    // Update localStorage
    localStorage.setItem(storageKey, theme);

    // Apply the theme
    applyTheme(theme);
  }, [theme, mounted, storageKey]);

  // Watch for system theme changes
  useEffect(() => {
    if (!mounted) return;

    // Only add listener if theme is "system"
    if (theme !== "system") return;

    function handleSystemThemeChange() {
      applyTheme("system");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme, mounted]);

  // Set up on mount
  useEffect(() => {
    // Get stored theme
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;

    // Validate stored theme
    const validTheme =
      storedTheme && ["light", "dark", "system"].includes(storedTheme)
        ? storedTheme
        : defaultTheme;

    // Set theme state
    setTheme(validTheme);

    // Apply theme immediately
    applyTheme(validTheme);

    // Mark as mounted
    setMounted(true);
  }, [defaultTheme, storageKey]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
