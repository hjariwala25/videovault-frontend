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
  return (
    <div className="md:hidden flex items-center w-full">
      {expanded ? (
        <>
          <div className="flex-grow">
            <SearchBar
              placeholder="Search"
              onSearch={onSearchComplete}
              className="w-full"
            />
          </div>
          <button
            onClick={onToggle}
            className="ml-2 p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full"
          >
            <X size={20} />
          </button>
        </>
      ) : (
        <button
          onClick={onToggle}
          className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full"
        >
          <Search size={20} />
        </button>
      )}
    </div>
  );
}
