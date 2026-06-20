"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Reads the stored theme from localStorage.
 * Returns null if nothing stored or if unavailable (SSR / throw-away).
 */
function readStored(): Theme | null {
  try {
    const raw = localStorage.getItem("theme");
    if (raw === "dark" || raw === "light") return raw;
  } catch {
    /* localStorage unavailable — in-memory only */
  }
  return null;
}

/**
 * Detects the system colour-scheme preference.
 */
function readSystem(): Theme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

/**
 * Applies a theme class to the <html> element and persists to localStorage.
 */
function commitTheme(theme: Theme, html: HTMLElement) {
  html.classList.remove("light", "dark");
  html.classList.add(theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* noop */
  }
}

/**
 * Inline script that runs *before* React hydration so there is never a
 * flash of the wrong theme.  Paste this string into a `<script>` tag
 * inside `<head>` (see layout.tsx).
 */
export const NO_FLASH_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t)}catch(e){}})();`;

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ThemeProvider({ children }: { children: ReactNode }) {
  const htmlRef = useRef<HTMLElement | null>(null);
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // One-time mount: grab the html element, read its current class
  // (set by the inline no-flash script), and sync React state.
  useEffect(() => {
    htmlRef.current = document.documentElement;
    const html = htmlRef.current;
    const current = html.classList.contains("dark") ? "dark" : "light";
    setThemeState(current);
    setMounted(true);

    // Listen for system preference changes while no explicit choice is stored
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      // Only follow system if the user hasn't made an explicit choice
      if (readStored() === null) {
        const sys = mql.matches ? "dark" : "light";
        commitTheme(sys, html);
        setThemeState(sys);
      }
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      const html = htmlRef.current;
      if (!html) return;
      commitTheme(next, html);
      setThemeState(next);
    },
    [],
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
