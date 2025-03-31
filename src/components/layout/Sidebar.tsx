"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  Clock,
  PlaySquare,
  MessageSquare,
  Heart,
  Compass,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useUserQueries";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useCurrentUser();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
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
    <aside className="w-64 bg-white shadow-md p-4 hidden md:block h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="space-y-1">
        {navItems.map((item) => {
          // Skip auth-required items if user is not logged in
          if (item.requiresAuth && !user) return null;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5",
                  isActive(item.href) ? "text-blue-700" : "text-gray-500"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {user && (
        <>
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Your Channels
            </h3>
            <Link
              href={`/channel/${user.username}`}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg text-sm font-medium",
                isActive(`/channel/${user.username}`)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <PlayCircle
                className={cn(
                  "mr-3 h-5 w-5",
                  isActive(`/channel/${user.username}`)
                    ? "text-blue-700"
                    : "text-gray-500"
                )}
              />
              Your Channel
            </Link>
          </div>

          <div className="mt-4 px-3 py-3 text-xs text-gray-500">
            <p className="mb-1">© {new Date().getFullYear()} VideoVault</p>
            <p>Terms · Privacy · Help</p>
          </div>
        </>
      )}
    </aside>
  );
}
