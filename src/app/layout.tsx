import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DepoRadar — Objection Radar for Defending Counsel",
  description:
    "Real-time AI that catches compound questions, privilege probes, and form defects during depositions. Built for defending counsel.",
  openGraph: {
    title: "DepoRadar — Your objection radar doesn't get tired at hour five.",
    description:
      "AI-powered deposition defense. Catches form objections and privilege probes in real-time.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-zinc-950 text-zinc-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
