import Link from "next/link";
import { cn } from "@/lib/utils";

interface MobileNavItemProps {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}

export default function MobileNavItem({
  name,
  href,
  icon: Icon,
  active,
}: MobileNavItemProps) {
  return (
    <Link href={href} className="flex flex-col items-center py-2 px-1">
      <div
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl mb-1",
          active
            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            active
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400"
          )}
        />
      </div>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {name}
      </span>
    </Link>
  );
}
