import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Predileto Dashboard",
  description: "Manage property visit requests",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
