import Link from "next/link";
import { cn } from "@/lib/utils";

interface MoreOverlayItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}

export default function MoreOverlayItem({
  name,
  href,
  icon: Icon,
  active,
}: MoreOverlayItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
        active
          ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-blue-900/10 dark:hover:text-blue-300 hover:shadow-sm dark:hover:border-blue-800/30"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-200",
          active
            ? "bg-blue-100 dark:bg-blue-900/30"
            : "bg-gray-100 dark:bg-black/40 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 transition-colors duration-200",
            active
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-300"
          )}
        />
      </div>
      <span className="ml-3">{name}</span>
    </Link>
  );
}
