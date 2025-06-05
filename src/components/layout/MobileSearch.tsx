"use client";

import { Search, X } from "lucide-react";
import SearchBar from "@/components/common/SearchBar";

interface MobileSearchProps {
  expanded: boolean;
  onToggle: () => void;
  onSearchComplete: () => void;
}

export default function MobileSearch({
  expanded,
  onToggle,
  onSearchComplete,
}: MobileSearchProps) {
  if (expanded) {
    return (
      <div className="absolute inset-0 bg-white dark:bg-black z-50 p-4">
        <div className="flex items-center gap-2">
          <SearchBar
            placeholder="Search"
            onSearch={() => {
              onSearchComplete();
              onToggle();
            }}
            className="flex-1"
          />
          <button
            onClick={onToggle}
            className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onToggle}
      className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-black/40 transition-all duration-200"
    >
      <Search size={20} />
    </button>
  );
}
