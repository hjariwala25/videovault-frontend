"use client";

import { useState } from "react";
import Header from "./Header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Film, Upload } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
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
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] z-30 transition-all duration-300 
                         bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800
                         ${collapsed ? "w-20" : "w-64"}`}
        >
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`font-bold text-gray-900 dark:text-white text-xl ${
                  collapsed && "hidden"
                }`}
              >
                Dashboard
              </h2>
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-900/10 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300"
              >
                {collapsed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                )}
              </button>
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-blue-900/10 dark:hover:text-blue-300 hover:shadow-sm"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
                      isActive(item.href)
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-gray-100 dark:bg-black/40"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive(item.href)
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                  </div>

                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </Link>
              ))}
            </nav>
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
