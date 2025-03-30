import Header from './Header';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow p-4">
          <nav className="space-y-4">
            <Link
              href="/dashboard"
              className="block text-gray-600 hover:text-black"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/videos"
              className="block text-gray-600 hover:text-black"
            >
              Videos
            </Link>
            <Link
              href="/dashboard/upload"
              className="block text-gray-600 hover:text-black"
            >
              Upload
            </Link>
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}