import type { Metadata } from "next";

import { ThemeProvider } from "@/component/theme-provider";
import { TrpcProvider } from "@/lib/trpc";

import "./globals.css";

export const metadata: Metadata = {
  title: "SISTER Console",
  description: "Workspace integrasi SISTER Web Service PT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <ThemeProvider>
          <TrpcProvider>{children}</TrpcProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
