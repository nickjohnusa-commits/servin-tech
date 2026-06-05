import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Servin Tech Solutions — AI Reception for Home Services",
  description:
    "Bilingual AI receptionist for home service contractors. Never miss a lead — 24/7 English & Spanish call and text handling.",
  openGraph: {
    title: "Servin Tech Solutions",
    description: "AI Reception for Home Services Contractors",
    siteName: "Servin Tech Solutions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full`}>
        <body className="min-h-full bg-background text-foreground antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
