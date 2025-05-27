"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Upload,
  ChevronLeft,
  ChevronRight,
  Home,
  MoreHorizontal,
  X,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
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

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      // For the dashboard root path, "/dashboard"
      return pathname === "/dashboard";
    }
    // For other paths
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isClient) return null;

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/videos", label: "Videos", icon: Film },
    { href: "/dashboard/upload", label: "Upload", icon: Upload },
    { href: "/", label: "Home", icon: Home },
  ];

  // Use all items for bottom navigation in dashboard
  const mobileNavItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/videos", label: "Videos", icon: Film },
    { href: "/dashboard/upload", label: "Upload", icon: Upload },
    { href: "/", label: "Home", icon: Home },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black">
      <Header />

      <div className="flex flex-1">
        {/* Desktop Dashboard Sidebar */}
        <aside
          className={cn(
            "hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] z-30 transition-all duration-300 ease-in-out",
            "bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800",
            "overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700",
            collapsed ? "w-20" : "w-64"
          )}
        >
          <div className="p-1">
            <button
              className="w-full px-3 py-2 text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-blue-900/10 dark:hover:text-blue-300 rounded-lg mb-2 flex items-center justify-between transition-all duration-200"
              onClick={() => setCollapsed(!collapsed)}
            >
              {!collapsed ? (
                <>
                  <span className="flex items-center group-hover:translate-x-[-2px] transition-transform">
                    <h2 className="px-4 py-2 font-bold text-gray-900 dark:text-white text-lg">
                      Dashboard
                    </h2>
                  </span>
                  <ChevronLeft className="h-5 w-5" />
                </>
              ) : (
                <ChevronRight className="h-5 w-5 mx-auto" />
              )}
            </button>

            <div className="space-y-1.5 pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-blue-900/10 dark:hover:text-blue-300 hover:shadow-sm dark:hover:border-blue-800/30"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-200",
                      isActive(item.href)
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-gray-100 dark:bg-black/40 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        isActive(item.href)
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-300"
                      )}
                    />
                  </div>
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>
        </aside>

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
                Dashboard Menu
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <Sidebar moreOverlay={true} isDashboard={true} />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full pb-24 md:pb-16 text-gray-900 dark:text-gray-100 pb-safe md:ml-20 lg:ml-64">
          <div className="transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-bottom-4">
            {children}
          </div>
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

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 flex justify-around items-center h-16 z-20 px-2 bottom-nav fixed-bottom">
        {mobileNavItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center py-2 px-1"
          >
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl mb-1",
                isActive(item.href)
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive(item.href)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400"
                )}
              />
            </div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {item.label}
            </span>
          </Link>
        ))}

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
    </div>
  );
}
