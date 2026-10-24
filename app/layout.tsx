import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kilnwood Roasters — Small-batch coffee, roasted slow",
  description:
    "Kilnwood is a fictional small-batch coffee roastery. Single-origin beans, roasted in tiny batches and shipped within 48 hours of the roast.",
  openGraph: {
    title: "Kilnwood Roasters",
    description: "Small-batch coffee, roasted slow. Shipped fresh.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#15100c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..800;1,9..144,300..800&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
