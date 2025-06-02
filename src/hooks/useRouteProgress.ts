"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useRouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start progress immediately on route change
    setIsLoading(true);
    setProgress(10); // Start with visible progress

    const timeoutIds: NodeJS.Timeout[] = [];

    // Use more aggressive timing to ensure visibility
    timeoutIds.push(setTimeout(() => setProgress(30), 100));
    timeoutIds.push(setTimeout(() => setProgress(50), 200));
    timeoutIds.push(setTimeout(() => setProgress(70), 300));
    timeoutIds.push(setTimeout(() => setProgress(90), 400));

    // Complete the loading with a bit of delay
    timeoutIds.push(
      setTimeout(() => {
        setProgress(100);

        // Hide after completion
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }, 600)
    );

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [pathname, searchParams]);

  return { isLoading, progress };
}
