import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import Favicon from "@/components/common/Favicon";
import TopProgressBarWrapper from "@/components/common/TopProgressBarWrapper";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "VideoVault",
  description: "A video streaming platform",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "VideoVault",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <Favicon />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storageKey = 'videovault-theme';
                  const theme = localStorage.getItem(storageKey) || 'system';
                  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(isDark ? 'dark' : 'light');
                  
                  // Set background color immediately to prevent flash
                  document.documentElement.style.backgroundColor = isDark ? '#000' : '#fff';
                } catch (e) {
                  console.error('Theme init error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} transition-colors duration-200`}>
        <ThemeProvider>
          <QueryProvider>
            <TopProgressBarWrapper />
            <div className="page-transition-wrapper">{children}</div>
          </QueryProvider>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
