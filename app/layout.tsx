import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar/Sidebar";

export const metadata: Metadata = {
  title: "CMS Dashboard",
  description: "Content Management Suite",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0a0a0f", margin: 0, padding: 0, fontFamily: "system-ui, sans-serif" }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: "auto", background: "#0c0c14" }}>
          {children}
        </main>
      </body>
    </html>
  );
}