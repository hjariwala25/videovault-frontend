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
<svg viewBox="0 0 48 48" className="h-12 w-12">
  <defs>
    <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style={{ stopColor: "#2563eb", stopOpacity: 1 }} /> {/* blue-600 */}
      <stop offset="100%" style={{ stopColor: "#4f46e5", stopOpacity: 1 }} /> {/* indigo-600 */}
    </linearGradient>
    
    <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style={{ stopColor: "#1e40af", stopOpacity: 0.1 }} /> {/* blue-800 */}
      <stop offset="100%" style={{ stopColor: "#3730a3", stopOpacity: 0.1 }} /> {/* indigo-800 */}
    </linearGradient>
    
    <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
      <stop offset="100%" style={{ stopColor: "#f0f9ff", stopOpacity: 0.9 }} />
    </linearGradient>
    
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0.6" dy="1" stdDeviation="1" floodOpacity="0.3" />
    </filter>
    
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    
    <pattern id="noisePattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill="#ffffff" opacity="0.03" />
      <rect width="25" height="25" fill="#ffffff" opacity="0.05" />
      <rect x="25" y="25" width="25" height="25" fill="#ffffff" opacity="0.05" />
      <rect x="50" y="50" width="25" height="25" fill="#ffffff" opacity="0.05" />
      <rect x="75" y="75" width="25" height="25" fill="#ffffff" opacity="0.05" />
    </pattern>
  </defs>
  
  {/* Main vault/screen shape - border removed */}
  <rect 
    x="6" 
    y="8" 
    width="36" 
    height="26" 
    rx="4" 
    ry="4" 
    fill="url(#mainGradient)" 
    filter="url(#dropShadow)"
    stroke="none"
  />
  
  {/* Screen texture */}
  <rect 
    x="6" 
    y="8" 
    width="36" 
    height="26" 
    rx="4" 
    ry="4" 
    fill="url(#noisePattern)" 
  />
  
  {/* Video screen */}
  <rect 
    x="10" 
    y="12" 
    width="28" 
    height="16" 
    rx="2" 
    ry="2" 
    fill="url(#screenGradient)" 
    stroke="#ffffff"
    strokeWidth="0.8"
    strokeOpacity="0.3"
  />
  
  {/* Play button */}
  <path 
    d="M20,16 L28,20 L20,24 Z" 
    fill="url(#playGradient)"
    filter="url(#glow)"
  />
  
  {/* Control bar */}
  <rect 
    x="14" 
    y="30" 
    width="20" 
    height="2" 
    rx="1" 
    ry="1" 
    fill="#ffffff" 
    opacity="0.7"
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
