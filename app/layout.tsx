import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ubadkaab Games",
  description: "Created by Salman Sadiq",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
