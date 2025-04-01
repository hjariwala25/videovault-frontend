"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  Clock,
  PlaySquare,
  Heart,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useUserQueries";
import { useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();
  const [expanded, setExpanded] = useState(true);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  // Navigation items
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
      icon: PlaySquare,
      requiresAuth: true,
    },
    { name: "Liked Videos", href: "/liked", icon: Heart, requiresAuth: true },
    {
      name: "Tweets",
      href: "/tweets",
      icon: MessageSquare,
      requiresAuth: true,
    },
  ];

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] sticky top-16 glass-effect-light glass-effect-dark transition-all duration-300",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="p-2">
        <button
          className="w-full px-3 py-2 text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-2 flex items-center justify-between"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <span>Collapse</span>
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

        <div className="space-y-1 pt-2">
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
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-xl",
                    isActive(item.href)
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "bg-gray-100 dark:bg-gray-700"
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
                {expanded && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </div>

        {expanded && user && (
          <div className="mt-auto pt-6 px-3">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Your Channel
              </h3>
              <Link
                href={`/channel/${user.username}`}
                className="flex items-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white dark:border-gray-600 shadow-sm"
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

        {expanded && (
          <div className="mt-6 px-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap text-xs text-gray-500 dark:text-gray-400 gap-x-2">
              <a href="#" className="hover:underline">
                About
              </a>
              <a href="#" className="hover:underline">
                Contact
              </a>
              <a href="#" className="hover:underline">
                Terms
              </a>
              <a href="#" className="hover:underline">
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
