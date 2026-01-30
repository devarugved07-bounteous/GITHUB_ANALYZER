import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { SnowfallProvider } from "@/contexts/SnowfallContext";
import ColorSchemeHandler from "@/components/ColorSchemeHandler";
import SnowfallWrapper from "@/components/SnowfallWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata = {
  metadataBase: new URL("https://github-analyzer-omega.vercel.app"),
  title: {
    default: "GitHub Summarizer - AI-Powered Repository Analysis",
    template: "%s | GitHub Summarizer",
  },
  description: "Get instant, comprehensive summaries and insights from any GitHub repository using AI. Analyze repositories 10x faster with our powerful AI-powered API.",
  keywords: [
    "GitHub analyzer",
    "repository analysis",
    "AI GitHub",
    "code analysis",
    "GitHub API",
    "repository summarizer",
    "AI code insights",
    "GitHub insights",
    "code review AI",
    "repository documentation",
  ],
  authors: [{ name: "GitHub Summarizer" }],
  creator: "GitHub Summarizer",
  publisher: "GitHub Summarizer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github-analyzer-omega.vercel.app",
    siteName: "GitHub Summarizer",
    title: "GitHub Summarizer - AI-Powered Repository Analysis",
    description: "Get instant, comprehensive summaries and insights from any GitHub repository using AI. Analyze repositories 10x faster with our powerful AI-powered API.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GitHub Summarizer - AI-Powered Repository Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Summarizer - AI-Powered Repository Analysis",
    description: "Get instant, comprehensive summaries and insights from any GitHub repository using AI.",
    images: ["/og-image.png"],
    creator: "@githubsummarizer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  alternates: {
    canonical: "https://github-analyzer-omega.vercel.app",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  other: {
    "color-scheme": "light",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Force light mode
                  document.documentElement.style.colorScheme = 'light';
                  document.documentElement.setAttribute('data-theme', 'light');
                } catch(e) {
                  document.documentElement.style.colorScheme = 'light';
                }
              })();
            `,
          }}
        />
        <ColorSchemeHandler />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "GitHub Summarizer",
              description: "Get instant, comprehensive summaries and insights from any GitHub repository using AI",
              url: "https://github-analyzer-omega.vercel.app",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1250",
              },
              featureList: [
                "AI-Powered Repository Summaries",
                "Cool Facts Discovery",
                "Secure API Access",
                "Easy Integration",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GitHub Summarizer",
              url: "https://github-analyzer-omega.vercel.app",
              logo: "https://github-analyzer-omega.vercel.app/logo.png",
              sameAs: [
                // Add your social media links here
                // "https://twitter.com/githubsummarizer",
                // "https://github.com/your-org",
              ],
            }),
          }}
        />
        <AuthProvider>
          <SnowfallProvider>
            <SnowfallWrapper />
            {children}
          </SnowfallProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
