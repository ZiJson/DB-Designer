"use client";
import { Button } from "@/components/ui/button";
import { Github, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

const FloatingTools = () => {
  return (
    <div className="fixed right-4 top-4 z-50">
      <ThemeButton />
      <GithubButton />
    </div>
  );
};

export default FloatingTools;

const ThemeButton = () => {
  const { setTheme, theme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
};

const GithubButton = () => {
  return (
    <Button variant="ghost" size="icon">
      <Github className="h-[1.2rem] w-[1.2rem]" />
    </Button>
  );
};
