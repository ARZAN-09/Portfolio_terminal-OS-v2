import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#090909",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "arzan@portfolio — PortfolioOS",
    template: "%s | arzan@portfolio",
  },
  description:
    "Step into Arzan's immersive PortfolioOS—a futuristic command-line experience where projects, skills, and personality come alive in a real shell.",
  keywords: [
    "Arzan",
    "Portfolio",
    "Terminal",
    "CLI",
    "Linux",
    "Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Software Engineer",
    "Full Stack",
  ],
  authors: [{ name: "Arzan S. S." }],
  openGraph: {
    title: "arzan@portfolio — PortfolioOS",
    description:
      "Explore Arzan's portfolio through a futuristic Linux terminal. Type help to begin.",
    type: "website",
    siteName: "PortfolioOS",
  },
  twitter: {
    card: "summary_large_image",
    title: "arzan@portfolio — PortfolioOS",
    description:
      "An immersive terminal-driven developer portfolio built with Next.js and modern web tooling.",
  },
  icons: {
    icon: [{ url: "data:," }],
    shortcut: [{ url: "data:," }],
    apple: [{ url: "data:," }],
  },
};

// 1. Define the props interface cleanly outside the function
interface RootLayoutProps {
  children: React.ReactNode;
}

// 2. Export standard component function
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetbrains.variable} font-mono antialiased bg-term-bg text-term-fg`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}