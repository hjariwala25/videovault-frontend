"use client";

import { useCurrentUser, useLogout } from "@/hooks/useUserQueries";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Menu,
  X,
  Upload,
  Settings,
  LogOut,
  User,
  Home,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              className="inline-flex items-center justify-center mr-2 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="flex items-center">
              <div className="flex items-center text-blue-600 font-bold text-2xl">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 mr-2"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
                <span className="hidden sm:inline">VideoVault</span>
              </div>
            </Link>
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex relative w-full max-w-md mx-4"
          >
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full py-2 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Navigation and profile */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/dashboard/upload"
                  className="hidden md:flex items-center text-gray-700 hover:text-blue-600"
                >
                  <Upload size={20} className="mr-1" />
                  <span>Upload</span>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center focus:outline-none">
                      <Image
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.username}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border-2 border-blue-100 hover:border-blue-300 shadow-sm transition-all duration-200 aspect-square flex-shrink-0"
                        priority
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="font-medium">@{user.username}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => router.push(`/channel/${user.username}`)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Your Channel</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
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
                    className="hidden sm:inline-flex"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search - shows when menu is open */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 border-t border-gray-200">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full py-2 pl-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 px-4 bg-blue-600 text-white rounded-lg flex items-center"
            >
              <Search size={18} />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
