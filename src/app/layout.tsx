import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Principle-Centered Planner | Live Your Best Life",
  description: "A life operating system based on Stephen Covey's 7 Habits. Build your mission statement, plan your week around your values, and track your renewal.",
  keywords: ["productivity", "7 habits", "mission statement", "weekly planner", "life planning", "Stephen Covey"],
  authors: [{ name: "Principle-Centered Planner" }],
  openGraph: {
    title: "Principle-Centered Planner",
    description: "Transform how you live with principle-based planning",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
