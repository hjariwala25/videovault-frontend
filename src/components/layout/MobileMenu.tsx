"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import VideoVaultLogo from "@/components/common/VideoVaultLogo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: { username: string } | null;
  onLogout: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  onLogout,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-black overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <VideoVaultLogo size={32} />
          <button
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <Link
            href="/"
            className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            Home
          </Link>
          <Link
            href="/subscriptions"
            className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            Subscriptions
          </Link>
          <Link
            href="/history"
            className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            History
          </Link>

          {user && (
            <>
              <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>
              <Link
                href="/dashboard"
                className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                Dashboard
              </Link>
              <Link
                href={`/channel/${user.username}`}
                className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                Your Channel
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-3 mb-1 text-lg font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={onClose}
              >
                Settings
              </Link>
            </>
          )}

          <div className="h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

          {!user ? (
            <div className="flex gap-4 mt-4">
              <Link href="/login" onClick={onClose}>
                <Button variant="outline" className="w-full rounded-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={onClose}>
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
                onLogout();
                onClose();
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
