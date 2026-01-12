import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/app/providers";
import Header from "@/components/header";

const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bifrost SLPX App",
  description: "A app to interact with Bifrost SLPX protocol",
  metadataBase: new URL("https://slpx.zxstim.com"),
  openGraph: {
    title: "Bifrost SLPX App",
    description: "A app to interact with Bifrost SLPX protocol",
    url: "https://slpx.zxstim.com",
    siteName: "Bifrost SLPX App",
    images: [
      {
        url: "/bifrost-full-mono.svg",
        width: 1200,
        height: 630,
        alt: "og-image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bifrost SLPX App",
    description: "A app to interact with Bifrost SLPX protocol",
    creator: "@zxstim",
    images: ["/bifrost-full-mono.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetBrainsMono.className} antialiased`}
      >
        <Providers>
          <main>
            <Header />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
