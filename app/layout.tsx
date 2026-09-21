import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminLayoutWrapper } from "@/components/admin/AdminLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventX Admin Panel",
  description: "Administrative dashboard for EventX platform",
};

import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/QueryProvider";
import { AdminProfileProvider } from "@/providers/AdminProfileProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <QueryProvider>
          <AdminProfileProvider>
            <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
          </AdminProfileProvider>
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
