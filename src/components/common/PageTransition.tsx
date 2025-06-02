"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // When the path changes, mark as transitioning
    setIsTransitioning(true);

    // Short timeout to allow CSS transitions to take effect
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div
      className={`transition-opacity duration-200 ease-in-out ${
        isTransitioning ? "opacity-90" : "opacity-100"
      }`}
    >
      {displayChildren}
    </div>
  );
}
