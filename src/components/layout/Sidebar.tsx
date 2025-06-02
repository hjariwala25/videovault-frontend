"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Clock,
  ListVideo,
  MessageSquare,
  ThumbsUp,
  Settings,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useUserQueries";
import { useState } from "react";
import SidebarNavItem from "./SidebarNavItem";
import MobileNavItem from "./MobileNavItem";
import MoreOverlayItem from "./MoreOverlayItem";
import SidebarChannelLink from "./SidebarChannelLink";
import SidebarFooter from "./SidebarFooter";

interface SidebarProps {
  mobileView?: boolean;
  mobileBottomNav?: boolean;
  moreOverlay?: boolean;
  isDashboard?: boolean;
}

export default function Sidebar({
  mobileView,
  mobileBottomNav,
  moreOverlay,
}: SidebarProps) {
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
    // Add Explore/Discover as a new navigation item (available to everyone)
    {
      name: "Explore",
      href: "/explore",
      icon: Compass,
      requiresAuth: false,
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
    },
  ];

  // For main layout mobile bottom navigation (Home, Subscriptions, Playlists, Tweets)
  // Also add Explore to mobile navigation
  const mobileNavItems = [
    { name: "Home", href: "/", icon: Home, requiresAuth: false },
    {
      name: "Explore",
      href: "/explore",
      icon: Compass,
      requiresAuth: false,
    },
    {
      name: "Subscriptions",
      href: "/subscriptions",
      icon: Users,
      requiresAuth: true,
    },
    {
      name: "Playlists",
      href: "/playlists",
      icon: ListVideo,
      requiresAuth: true,
    },
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
    },
  ];
  if (mobileBottomNav) {
    return (
      <>
        {mobileNavItems.map((item) => {
          // Skip auth-required items if user is not logged in
          if (item.requiresAuth && !user) return null;

          return (
            <MobileNavItem
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
              active={isActive(item.href)}
            />
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
            <MoreOverlayItem
              key={item.name}
              name={item.name}
              href={item.href}
              icon={item.icon}
              active={isActive(item.href)}
            />
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
        )}        <div
          className={cn(
            "space-y-0 pt-1",
            mobileView && "grid grid-cols-2 gap-2"
          )}
        >
          {navItems.map((item) => {
            // Skip auth-required items if user is not logged in
            if (item.requiresAuth && !user) return null;

            return (
              <SidebarNavItem
                key={item.name}
                name={item.name}
                href={item.href}
                icon={item.icon}
                active={isActive(item.href)}
                expanded={expanded}
                mobileView={mobileView}
              />
            );
          })}
        </div>        {(expanded || mobileView) && user && (
          <SidebarChannelLink user={user} />
        )}

        {(expanded || mobileView) && (
          <SidebarFooter />
        )}
      </div>
    </aside>
  );
}
