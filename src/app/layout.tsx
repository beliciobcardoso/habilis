import type { Metadata } from "next";
import "./globals.css";


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
      <body>
        {children}
      </body>
    </html>
  );
}
