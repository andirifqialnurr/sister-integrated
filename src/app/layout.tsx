import type { Metadata } from "next";

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
        <TrpcProvider>{children}</TrpcProvider>
      </body>
    </html>
  );
}
