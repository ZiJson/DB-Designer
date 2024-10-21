"use client";
import { Button } from "@/components/ui/button";
import { Github, Home, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FloatingTools = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <div className="fixed right-8 top-5 z-50 flex gap-1">
      {!isHome && <HomeButton />}
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
    <Link href="https://github.com/ZiJson/DB-Designer" target="_blank">
      <Button variant="ghost" size="icon">
        <Github className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    </Link>
  );
};

const HomeButton = () => {
  return (
    <Link href="/">
      <Button variant="ghost" size="icon">
        <Home className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    </Link>
  );
};
