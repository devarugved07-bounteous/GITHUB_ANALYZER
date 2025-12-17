import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ColorSchemeHandler from "@/components/ColorSchemeHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GitHub Summarizer - AI-Powered Repository Analysis",
  description: "Get instant, comprehensive summaries and insights from any GitHub repository using AI",
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
