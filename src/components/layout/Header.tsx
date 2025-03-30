'use client';

import { useCurrentUser, useLogout } from '@/hooks/useUserQueries';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        VideoVault
      </Link>
      <nav className="flex gap-4 items-center">
        <Link href="/search" className="text-gray-600 hover:text-black">
          Search
        </Link>
        {user ? (
          <>
            <Link href="/dashboard" className="text-gray-600 hover:text-black">
              Dashboard
            </Link>
            <Link href="/settings" className="text-gray-600 hover:text-black">
              Settings
            </Link>
            <Link href={`/channel/${user.username}`}>
              <Image
                src={user.avatar}
                alt={user.username}
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}