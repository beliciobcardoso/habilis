import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";


export const metadata: Metadata = {
  title: "App Habilis",
  description: "App Habilis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <SessionProvider>
        <body>
          {children}
        </body>
      </SessionProvider>
    </html>
  );
}
