import Link from "next/link";
import Image from "next/image";
// Define UserType here if not exported from '@/types'
export interface UserType {
  username: string;
  fullname?: string;
  avatar?: string;
}

interface SidebarChannelLinkProps {
  user: UserType;
}

export default function SidebarChannelLink({ user }: SidebarChannelLinkProps) {
  return (
    <div className="mt-auto pt-1 px-3">
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Your Channel
        </h3>
        <Link
          href={`/channel/${user.username}`}
          className="flex items-center p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-blue-900/10 dark:hover:text-blue-300 transition-all duration-200 hover:shadow-sm"
        >
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt={user.username}
            width={40}
            height={40}
            className="rounded-full h-10 w-10 border-2 object-cover border-white dark:border-gray-800 shadow-sm group-hover:border-blue-200 dark:group-hover:border-blue-800"
          />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.fullname || user.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              @{user.username}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
