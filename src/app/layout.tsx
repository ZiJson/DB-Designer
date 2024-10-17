import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WorkspaceStoreProvider } from "@/providers/workspace-store-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prisma Schema Generator",
  description: "generate prisma schema easily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WorkspaceStoreProvider>
            <div className="h-screen w-screen">{children}</div>
          </WorkspaceStoreProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
