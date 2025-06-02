"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/hooks/useUserQueries";

interface HeaderUserMenuProps {
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
}

export default function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const router = useRouter();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center focus:outline-none ml-1">
          <div className="relative">
            <Image
              src={user.avatar || "/default-avatar.png"}
              alt={user.username}
              width={32}
              height={32}
              className="rounded-full object-cover border-2 border-white dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-600 shadow-md transition-all duration-200 aspect-square"
              priority
            />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 p-1 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-black overflow-hidden"
      >
        <div className="p-3 gradient-subtle-bg mb-1">
          <div className="font-bold text-gray-900 dark:text-white">
            @{user.username}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {user.email}
          </div>
        </div>

        <DropdownMenuItem
          onClick={() => router.push(`/channel/${user.username}`)}
          className="rounded-lg py-2 my-1 hover:bg-gray-100 dark:hover:bg-black/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <User className="mr-2 h-4 w-4" />
          <span>Your Channel</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/dashboard")}
          className="rounded-lg py-2 my-1 hover:bg-gray-100 dark:hover:bg-black/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/settings")}
          className="rounded-lg py-2 my-1 hover:bg-gray-100 dark:hover:bg-black/40 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-800" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-lg py-2 my-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-400"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
