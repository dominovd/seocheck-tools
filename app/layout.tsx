import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteSchemas } from "@/components/PageSchemas";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = buildMetadata({
  title: siteConfig.tagline,
  description: siteConfig.description,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <SiteSchemas />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
