"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Upload,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useUserQueries";
import SearchBar from "@/components/common/SearchBar";

export default function Header() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchComplete = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-black/90 shadow-md dark:shadow-[#333]/20"
          : "bg-white dark:bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              className="inline-flex items-center justify-center mr-2 md:hidden text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center group">
              <svg viewBox="0 0 24 24" className="h-8 w-8 mr-2">
                <defs>
                  <linearGradient
                    id="circleGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#9333ea", stopOpacity: 1 }}
                    />
                  </linearGradient>
                  <linearGradient
                    id="playGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#ffffff", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#e5e7eb", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#circleGrad)"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                />
                <path
                  fill="url(#playGrad)"
                  d="M10 7.5L16 12L10 16.5Z"
                  transform="rotate(5 12 12)"
                />
              </svg>
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-xl hidden sm:inline group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                VideoVault
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block w-full max-w-md mx-4">
            <SearchBar placeholder="Search" onSearch={handleSearchComplete} />
          </div>

          {/* Navigation and profile */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <ThemeToggle />
            {user ? (
              <>
                <Link
                  href="/dashboard/upload"
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-black/40 transition-all duration-200"
                >
                  <Upload size={20} />
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center focus:outline-none ml-1">
                      <div className="relative">
                        <Image
                          src={user.avatar || "/default-avatar.png"}
                          alt={user.username}
                          width={38}
                          height={38}
                          className="rounded-full object-cover border-2 border-white dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 shadow-md transition-all duration-200 aspect-square"
                          priority
                        />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-1 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-black overflow-hidden"
                  >
                    <div className="p-3 gradient-subtle-bg mb-1">
                      <div className="font-bold text-gray-900 dark:text-white">
                        @{user.username}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {user.email}
                      </div>
                    </div>

                    <DropdownMenuItem
                      onClick={() => router.push(`/channel/${user.username}`)}
                      className="rounded-lg py-2 my-1 hover:bg-gray-100 dark:hover:bg-black/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Your Channel</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard")}
                      className="rounded-lg py-2 my-1 hover:bg-gray-100 dark:hover:bg-black/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/settings")}
                      className="rounded-lg py-2 my-1 hover:bg-gray-100 dark:hover:bg-black/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-800" />

                    <DropdownMenuItem
                      onClick={() => router.push("/auth/logout")}
                      className="rounded-lg py-2 my-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex rounded-full hover:bg-gray-100 dark:hover:bg-black/40 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="rounded-full gradient-bg hover:scale-105 transition-all duration-200"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search - shows when menu is open */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-black">
          <SearchBar
            placeholder="Search videos..."
            onSearch={handleSearchComplete}
          />
        </div>
      )}
    </header>
  );
}
