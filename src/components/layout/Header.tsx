"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Upload,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Search,
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
import { useCurrentUser, useLogout } from "@/hooks/useUserQueries";
import SearchBar from "@/components/common/SearchBar";
import VideoVaultLogo from "@/components/common/VideoVaultLogo";

export default function Header() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchComplete = () => {
    setMobileMenuOpen(false);
    setSearchExpanded(false);
  };

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMobileSearch = () => {
    setSearchExpanded(!searchExpanded);
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 app-header ${
        scrolled
          ? "bg-white/90 dark:bg-black/90 shadow-md dark:shadow-[#333]/20"
          : "bg-white dark:bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Left section: Logo and mobile menu button */}
          <div className="flex-shrink-0 flex items-center">
            
            <Link href="/" className="flex items-center group">
              <VideoVaultLogo size={28} className="mr-1.5" />
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-sm sm:text-xl group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300 max-w-[75px] sm:max-w-none truncate">
                VideoVault
              </span>
            </Link>
          </div>

          {/* Search area - Different behavior for mobile and desktop */}
          <div
            className={`flex-grow max-w-md mx-2 md:mx-4 ${
              searchExpanded ? "flex items-center" : ""
            }`}
          >
            {/* Desktop search - always visible */}
            <div className="hidden md:block w-full">
              <SearchBar
                placeholder="Search"
                onSearch={handleSearchComplete}
                className="w-full"
              />
            </div>

            {/* Mobile search icon or expanded search */}
            <div
              className={`md:hidden flex items-center w-full ${
                searchExpanded ? "justify-between" : "justify-end"
              }`}
            >
              {searchExpanded ? (
                <>
                  <div className="flex-grow">
                    <SearchBar
                      placeholder="Search"
                      onSearch={handleSearchComplete}
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={toggleMobileSearch}
                    className="ml-2 p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full"
                  >
                    <X size={20} />
                  </button>
                </>
              ) : (
                <button
                  onClick={toggleMobileSearch}
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full"
                >
                  <Search size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Right section: Navigation and profile */}
          <div
            className={`flex-shrink-0 flex items-center space-x-1 sm:space-x-3 ${
              searchExpanded ? "hidden md:flex" : ""
            }`}
          >
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
                          width={32}
                          height={32}
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
                      onClick={handleLogout}
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

      {/* Mobile Menu - slides in from the side */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-black overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <VideoVaultLogo size={32} />
              <button
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <Link
                href="/"
                className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/subscriptions"
                className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Subscriptions
              </Link>
              <Link
                href="/history"
                className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                History
              </Link>
              {user && (
                <>
                  <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={`/channel/${user.username}`}
                    className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Your Channel
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </>
              )}
              <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>
              {!user ? (
                <div className="flex gap-4 mt-4">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full rounded-full">
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full rounded-full gradient-bg">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  variant="destructive"
                  className="w-full mt-4 rounded-full"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
