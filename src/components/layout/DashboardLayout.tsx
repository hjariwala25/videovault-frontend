"use client";

import { useState } from "react";
import Header from "./Header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Upload,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      // For the dashboard root path, "/dashboard"
      return pathname === "/dashboard";
    }
    // For other paths
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/videos", label: "Videos", icon: Film },
    { href: "/dashboard/upload", label: "Upload", icon: Upload },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black">
      <Header />

      <div className="flex flex-1 pt-16">
        {/* Dashboard Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-16 h-[calc(100vh-4rem)] z-30 transition-all duration-300 ease-in-out",
            "bg-white dark:bg-black border-gray-200 dark:border-gray-800",
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

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 p-6 ${
            collapsed ? "ml-20" : "ml-64"
          }`}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
