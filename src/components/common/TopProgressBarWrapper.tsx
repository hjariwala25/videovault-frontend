"use client";

import { Suspense } from "react";
import TopProgressBar from "./TopProgressBar";

// Simple loading fallback that doesn't use any navigation hooks
function ProgressBarFallback() {
  return (
    <div className="fixed top-0 left-0 right-0 h-[5px] z-[9999] pointer-events-none">
      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}

export default function TopProgressBarWrapper() {
  return (
    <Suspense fallback={<ProgressBarFallback />}>
      <TopProgressBar />
    </Suspense>
  );
}
