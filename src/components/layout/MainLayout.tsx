"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration errors
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden fixed bottom-4 right-4 z-20 p-3 rounded-full bg-blue-600 text-white shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={`
          md:hidden fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform z-40 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 max-w-7xl mx-auto w-full">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-inner mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left text-sm text-gray-500">
            © {new Date().getFullYear()} VideoVault. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Privacy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
