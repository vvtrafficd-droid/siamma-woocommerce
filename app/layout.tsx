import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "remixicon/fonts/remixicon.css";
import Navbar from "@/components/Navbar";
import TopLoader from "@/components/TopLoader";
import { siteConfig } from "@/lib/config";
import { Toaster } from "@/components/ui/sonner";
import CookieConsent from "@/components/CookieConsent";


const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"], // optional: choose weights you’ll use
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <body className="font-sans antialiased">
        <TopLoader />
        <Header />
        <Navbar />
        {children}
        <Footer />
        <CookieConsent />
        <Toaster />
      </body>
    </html>
  );
}
