import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProvider } from "@/context/app-context";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedLayout } from "@/components/protected-layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Dr. Nada Kerkeni",
  description: "Manage your dental practice with ease.",
  icons: {
    icon: "/assets/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/assets/favicon.ico" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <AppProvider>
          <ProtectedLayout>
            {children}
          </ProtectedLayout>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
