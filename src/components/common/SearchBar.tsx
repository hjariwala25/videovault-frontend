"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

function SearchBarContent({
  className = "",
  placeholder = "Search videos...",
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local state if URL query changes
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      if (onSearch) {
        onSearch(query.trim());
      }
    }
  };

  const clearSearch = () => {
    setQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
    // Clear the URL query parameter
    if (searchParams.get("q")) {
      router.push("/");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center group transition-all duration-200",
        isFocused && "scale-[1.02]",
        className
      )}
    >
      <div className="relative flex-grow">
        <div
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200",
            isFocused
              ? "text-primary dark:text-blue-400"
              : "text-gray-400 dark:text-gray-500"
          )}
        >
          <Search className="h-4 w-4 text-blue-500 dark:text-blue-400" />
        </div>

        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10 w-full transition-all duration-200",
            "border-gray-200 dark:border-gray-800",
            "bg-gray-50 hover:bg-white focus:bg-white dark:bg-gray-900/60 dark:hover:bg-black dark:focus:bg-black",
            "text-adaptive-heading rounded-full",
            "focus:ring-2 focus:ring-primary/30 dark:focus:ring-blue-500/50 focus:border-primary dark:focus:border-blue-600",
            isFocused ? "shadow-md" : "shadow-sm"
          )}
        />

        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 icon-btn-dark rounded-full p-1"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>
    </form>
  );
}

function SearchBarFallback({
  className = "",
  placeholder = "Search videos...",
}) {
  return (
    <div className={cn("flex items-center group", className)}>
      <div className="relative flex-grow">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="text"
          disabled
          placeholder={placeholder}
          className="pl-10 pr-10 w-full border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60"
        />
      </div>
    </div>
  );
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={<SearchBarFallback {...props} />}>
      <SearchBarContent {...props} />
    </Suspense>
  );
}
