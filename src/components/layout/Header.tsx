"use client";

import { useCurrentUser, useLogout } from "@/hooks/useUserQueries";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  Upload,
  Settings,
  LogOut,
  User,
  Home,
  Bell,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-md" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              className="inline-flex items-center justify-center mr-2 md:hidden text-gray-700 hover:text-blue-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center group">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg mr-2 group-hover:shadow-lg transition-all duration-300">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6 text-white"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-xl hidden sm:inline group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                  VideoVault
                </span>
              </div>
            </Link>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative w-full max-w-md mx-4 group"
          >
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full py-2 pl-12 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
              <Search size={18} />
            </div>
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition-colors duration-200"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Navigation and profile */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {user ? (
              <>
                <Link
                  href="/dashboard/upload"
                  className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200"
                >
                  <Upload size={20} />
                </Link>

                <button
                  className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200"
                  onClick={() => router.push("/notifications")}
                >
                  <Bell size={20} />
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center focus:outline-none ml-1">
                      <div className="relative">
                        <Image
                          src={user.avatar || "/default-avatar.png"}
                          alt={user.username}
                          width={38}
                          height={38}
                          className="rounded-full object-cover border-2 border-white hover:border-blue-300 shadow-md transition-all duration-200 aspect-square"
                          priority
                        />
                        {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div> */}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 p-1 rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                  >
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 mb-1">
                      <div className="font-bold text-gray-900">
                        @{user.username}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>

                    <DropdownMenuItem
                      onClick={() => router.push(`/channel/${user.username}`)}
                      className="rounded-lg py-2 my-1 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Your Channel</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard")}
                      className="rounded-lg py-2 my-1 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/settings")}
                      className="rounded-lg py-2 my-1 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-lg py-2 my-1 hover:bg-red-50 hover:text-red-600 transition-colors"
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
                    className="hidden sm:inline-flex rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
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
        <div className="md:hidden px-4 py-3 border-t border-gray-100 bg-white">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="ml-2 px-4 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
