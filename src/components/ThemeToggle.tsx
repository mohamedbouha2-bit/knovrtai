"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // ننتظر حتى يتم تحميل المكون على المتصفح لتجنب أخطاء الـ Hydration
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-2 h-10 w-10" />; // مساحة فارغة مؤقتة للحفاظ على الهيكل
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-foreground/10 bg-background hover:bg-foreground/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="تبديل الوضع الليلي"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
    </button>
  );
}