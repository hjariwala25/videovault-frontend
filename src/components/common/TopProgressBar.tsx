"use client";

import { useRouteProgress } from "@/hooks/useRouteProgress";
import { useTheme } from "next-themes";

// Define brand colors for the progress bar
const BRAND_COLORS = {
  // Blue to indigo gradient 
  from: "from-sky-500", 
  via: "via-indigo-600", 
  to: "to-indigo-500", 

  // Shadow colors for light/dark modes
  shadowLight: "rgba(79, 70, 229, 0.6)", 
  shadowDark: "rgba(99, 102, 241, 0.8)", 

  // Glow colors
  glowLight: "rgba(255, 255, 255, 0.7)",
  glowDark: "rgba(255, 255, 255, 0.2)",
};

export default function TopProgressBar() {
  const { isLoading, progress } = useRouteProgress();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <>
      {/* Progress bar container */}
      <div
        className="fixed top-0 left-0 right-0 h-[5px] z-[9999] pointer-events-none"
        style={{
          opacity: isLoading ? 1 : 0,
          transition: "opacity 300ms ease-in-out",
        }}
      >
        {/* Background track */}
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800" />

        {/* Actual progress bar with brand colors */}
        <div
          className={`h-full bg-gradient-to-r ${BRAND_COLORS.from} ${BRAND_COLORS.via} ${BRAND_COLORS.to}`}
          style={{
            width: `${progress}%`,
            transition: "width 300ms ease-out",
            boxShadow: isDark
              ? `0 0 12px ${BRAND_COLORS.shadowDark}`
              : `0 0 10px ${BRAND_COLORS.shadowLight}`,
          }}
        />

        {/* Moving glow effect */}
        <div
          className="absolute top-0 h-full w-32 blur-sm"
          style={{
            background: isDark
              ? `linear-gradient(90deg, transparent, ${BRAND_COLORS.glowDark}, transparent)`
              : `linear-gradient(90deg, transparent, ${BRAND_COLORS.glowLight}, transparent)`,
            left: `${Math.min(progress - 20, 80)}%`,
            opacity: isLoading ? 1 : 0,
            transition: "left 300ms linear",
          }}
        />
      </div>

      {/* Page transition overlay to prevent white flash */}
      {isLoading && (
        <div
          className="fixed inset-0 bg-white dark:bg-black pointer-events-none z-[9998]"
          style={{
            opacity: 0.01, 
          }}
        />
      )}
    </>
  );
}
