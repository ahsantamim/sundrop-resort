"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("partner-theme", next);
  }

  const dark = theme === "dark";
  return (
    <button className="theme-btn press" type="button" onClick={toggle} aria-pressed={dark}>
      {dark ? <Sun size={15} /> : <Moon size={15} />}
      {dark ? "Light" : "Dark"}
    </button>
  );
}
