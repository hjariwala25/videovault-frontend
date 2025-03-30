import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow p-4 hidden md:block">
      <nav className="space-y-4">
        <Link href="/" className="block text-gray-600 hover:text-black">
          Home
        </Link>
        <Link
          href="/subscriptions"
          className="block text-gray-600 hover:text-black"
        >
          Subscriptions
        </Link>
        <Link href="/history" className="block text-gray-600 hover:text-black">
          History
        </Link>
        <Link
          href="/playlists"
          className="block text-gray-600 hover:text-black"
        >
          Playlists
        </Link>
        <Link href="/tweets" className="block text-gray-600 hover:text-black">
          Tweets
        </Link>
      </nav>
    </aside>
  );
}