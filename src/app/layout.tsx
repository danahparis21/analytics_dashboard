import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpartanPulse Analytics | Program Chair Decision Support",
  description: "Academic Monitoring & Teaching Effectiveness Decision Support System - BatStateU CICS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
