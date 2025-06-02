"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useLogout } from "@/hooks/useUserQueries";
import SearchBar from "@/components/common/SearchBar";
import VideoVaultLogo from "@/components/common/VideoVaultLogo";
import HeaderUserMenu from "./HeaderUserMenu";
import MobileMenu from "./MobileMenu";
import MobileSearch from "./MobileSearch";

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

            {/* Mobile search */}
            <MobileSearch
              expanded={searchExpanded}
              onToggle={toggleMobileSearch}
              onSearchComplete={handleSearchComplete}
            />
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

                <HeaderUserMenu user={user} />
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

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </header>
  );
}
