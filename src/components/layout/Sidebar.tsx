"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  Clock,
  ListVideo,
  MessageSquare,
  ThumbsUp,
  Settings,
  LayoutDashboard,
  Film,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useUserQueries";
import { useState } from "react";
import Image from "next/image";

interface SidebarProps {
  mobileView?: boolean;
  mobileBottomNav?: boolean;
  moreOverlay?: boolean;
  isDashboard?: boolean;
}

export default function Sidebar({ mobileView, mobileBottomNav, moreOverlay, isDashboard }: SidebarProps) {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const [expanded, setExpanded] = useState(true);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Navigation items for main sidebar
  const navItems = [
    { name: "Home", href: "/", icon: Home, requiresAuth: false },
    {
      name: "Subscriptions",
      href: "/subscriptions",
      icon: Users,
      requiresAuth: true,
    },
    { name: "History", href: "/history", icon: Clock, requiresAuth: true },
    {
      name: "Playlists",
      href: "/playlists",
      icon: ListVideo,
      requiresAuth: true,
    },
    {
      name: "Liked Videos",
      href: "/likedvideos",
      icon: ThumbsUp,
      requiresAuth: true,
    },
    {
      name: "Tweets",
      href: "/tweets",
      icon: MessageSquare,
      requiresAuth: true,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      requiresAuth: true,
    }
  ];

  // For main layout mobile bottom navigation (Home, Subscriptions, Playlists, Tweets)
  const mobileNavItems = [
    { name: "Home", href: "/", icon: Home, requiresAuth: false },
    {
      name: "Subscriptions",
      href: "/subscriptions",
      icon: Users,
      requiresAuth: true,
    },
    { name: "Playlists", href: "/playlists", icon: ListVideo, requiresAuth: true },
    {
      name: "Tweets",
      href: "/tweets",
      icon: MessageSquare,
      requiresAuth: true,
    },
  ];

  // For the more overlay in main layout
  const moreOverlayItems = [
    { name: "History", href: "/history", icon: Clock, requiresAuth: true },
    {
      name: "Liked Videos",
      href: "/likedvideos",
      icon: ThumbsUp,
      requiresAuth: true,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      requiresAuth: true,
    }
  ];

  // Dashboard navigation items (handled in DashboardLayout.tsx)
  const dashboardItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Videos", href: "/dashboard/videos", icon: Film },
    { name: "Upload", href: "/dashboard/upload", icon: Upload },
  ];

  if (mobileBottomNav) {
    return (
      <>
        {mobileNavItems.map((item) => {
          // Skip auth-required items if user is not logged in
          if (item.requiresAuth && !user) return null;

          return (
            <Link
              key={item.name}
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
                {item.name}
              </span>
            </Link>
          );
        })}
      </>
    );
  }

  if (moreOverlay) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {moreOverlayItems.map((item) => {
          // Skip auth-required items if user is not logged in
          if (item.requiresAuth && !user) return null;

          return (
            <Link
              key={item.name}
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
              <span className="ml-3">{item.name}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] sticky top-16 bg-white dark:bg-black transition-all duration-300 ease-in-out overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-700",
        mobileView ? "w-full" : expanded ? "w-64" : "w-20"
      )}
    >
      <div className="p-1">
        {!mobileView && (
          <button
            className="w-full px-3 py-2 text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-blue-900/10 dark:hover:text-blue-300 rounded-lg mb-2 flex items-center justify-between transition-all duration-200"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <span className="flex items-center group-hover:translate-x-[-2px] transition-transform">
                  {/* <PanelLeftClose className="mr-1.5 h-4 w-4" /> */}
                  <span>Collapse Menu</span>
                </span>
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
              </>
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
                <path d="M9 18l6-6-6-6" />
              </svg>
            )}
          </button>
        )}

        <div className={cn("space-y-0 pt-1", mobileView && "grid grid-cols-2 gap-2")}>
          {navItems.map((item) => {
            // Skip auth-required items if user is not logged in
            if (item.requiresAuth && !user) return null;

            return (
              <Link
                key={item.name}
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
                {(expanded || mobileView) && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {(expanded || mobileView) && user && (
          <div className="mt-auto pt-6 px-3">
            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Your Channel
              </h3>
              <Link
                href={`/channel/${user.username}`}
                className="flex items-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-blue-900/10 dark:hover:text-blue-300 transition-all duration-200 hover:shadow-sm"
              >
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10 border-2 object-cover border-white dark:border-gray-800 shadow-sm group-hover:border-blue-200 dark:group-hover:border-blue-800"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.fullname || user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}

        {(expanded || mobileView) && (
          <div className="mt-6 px-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap text-xs text-gray-500 dark:text-gray-400 gap-x-2">
              <a
                href="#"
                className="hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              >
                About
              </a>
              <a
                href="#"
                className="hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Contact
              </a>
              <a
                href="#"
                className="hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Terms
              </a>
              <a
                href="#"
                className="hover:underline hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Privacy
              </a>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              © 2025 VideoVault
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
