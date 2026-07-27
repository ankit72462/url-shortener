import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import CookieConsent from "@/components/CookieConsent";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const adsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

export const metadata: Metadata = {
  title: "LinkSnap — Premium URL Shortener",
  description: "Shorten Your Links, Amplify Your Reach. The premium URL shortener for modern creators. Fast, secure, and beautifully designed.",
  keywords: ["url shortener", "link shortener", "short url", "linksnap", "free url shortener"],
  authors: [{ name: "Ankit Kumar" }],
  openGraph: {
    title: "LinkSnap — Premium URL Shortener",
    description: "Shorten Your Links, Amplify Your Reach. Fast, secure, and beautifully designed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Only load AdSense script if a real publisher ID is configured */}
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          ></script>
        )}
        {/* Theme initialization script to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('linksnap-theme');
                if (t === 'light' || t === 'dark') {
                  document.documentElement.setAttribute('data-theme', t);
                } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <ThemeProvider>
          {/* Noise texture overlay */}
          <div className="noise-overlay" aria-hidden="true" />

          {/* Floating particles */}
          <div className="particles" aria-hidden="true">
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
            <div className="particle" />
          </div>

          <Header />
          <main className="container main-content">{children}</main>
          <Footer />
          <CookieConsent />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
