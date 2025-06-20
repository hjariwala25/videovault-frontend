"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { X, ArrowUp, MoreHorizontal } from "lucide-react";
import VideoVaultLogo from "@/components/common/VideoVaultLogo";
import TopProgressBarWrapper from "@/components/common/TopProgressBarWrapper";
import PageTransition from "@/components/common/PageTransition";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Prevent hydration errors and track scroll position
  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      {/* Place TopProgressBarWrapper instead */}
      <TopProgressBarWrapper />

      <Header />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300 animate-in fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar - Full slide-up panel */}
        <div
          className={`md:hidden fixed inset-x-0 bottom-0 bg-white dark:bg-black shadow-2xl dark:shadow-[#333]/20 z-40 overflow-y-auto transform transition-all duration-300 ease-out rounded-t-2xl ${
            sidebarOpen ? "translate-y-0 max-h-[50vh]" : "translate-y-full"
          }`}
        >
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                More Options
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <Sidebar moreOverlay={true} />
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar - Always visible */}
        <div className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 z-20 px-2 bottom-nav fixed-bottom">
          <Sidebar mobileBottomNav={true} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex flex-col items-center py-2 px-1"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl mb-1 text-gray-500 dark:text-gray-400">
              {sidebarOpen ? <X size={20} /> : <MoreHorizontal size={20} />}
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              More
            </span>
          </button>
        </div>

        {/* Main Content with Page Transition */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full pb-24 md:pb-16 text-gray-900 dark:text-gray-100 pb-safe">
          <PageTransition>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {children}
            </div>
          </PageTransition>
        </main>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-20 right-6 z-20 p-3 rounded-full bg-white dark:bg-black text-blue-600 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 backdrop-blur-sm hover:scale-105 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 mt-auto pb-16 md:pb-0 app-footer">
        <div className="max-w-7xl mx-auto py-6 md:py-8 px-4 sm:px-6">
          {/* Mobile view: stacked, Desktop view: side by side */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-2">
                <VideoVaultLogo size={28} className="mr-2" />
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-xl group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                  VideoVault
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The home for your creative content
              </p>
            </div>

            {/* Social links and copyright */}
            <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end">
              <div className="flex space-x-6 text-gray-600 dark:text-gray-400">
                <a
                  href="https://x.com/hjariwala25"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:scale-110 duration-200"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/hjariwala25/videovault-frontend"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:scale-110 duration-200"
                  aria-label="GitHub"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                © {new Date().getFullYear()} VideoVault. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
