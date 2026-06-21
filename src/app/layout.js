import dns from "node:dns";
dns.setServers(['1.1.1.1', '1.0.0.1']);

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
 });

export const metadata = {
  title: "AICore - AI Prompt Sharing & Marketplace Platform",
  description: "Discover, bookmark, and manage high-quality AI prompts securely.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" 
      data-theme="dark"
      className={`${inter.className} h-full antialiased dark`}
    >
      <body className="bg-[#0b0813] text-zinc-100 flex flex-col min-h-screen selection:bg-purple-500/30 selection:text-white">
        <Navbar />
        
        <main >
          {children}
        </main>
        
        <Footer/>
      </body>
    </html>
  );
}