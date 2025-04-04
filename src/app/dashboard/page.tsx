"use client";

import { useChannelStats } from "@/hooks/useDashboardQueries";
import StatsOverview from "@/components/dashboard/StatsOverview";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCurrentUser } from "@/hooks/useUserQueries";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  // First check if user is logged in
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: stats, isLoading: statsLoading, error } = useChannelStats();

  const isLoading = userLoading || statsLoading;

  // Fallback data if API fails
  const fallbackStats = {
    totalSubscribers: 0,
    totalLikes: 0,
    totalViews: 0,
    totalVideos: 0,
  };

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="animate-in fade-in duration-300">
          <Skeleton className="h-8 w-48 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Subscriber count card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-9 w-20" />
            </div>

            {/* Video count card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
              <Skeleton className="h-5 w-28 mb-2" />
              <Skeleton className="h-9 w-16" />
            </div>

            {/* Views count card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-9 w-24" />
            </div>

            {/* Likes count card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
              <Skeleton className="h-5 w-20 mb-2" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>

          {/* Recent activity chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm mb-8">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-60 w-full rounded-md" />
          </div>

          {/* Top videos section */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
            <Skeleton className="h-6 w-36 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-16 w-28 rounded-md mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-full max-w-md mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-8 w-16 rounded-md ml-3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );

  if (!user) {
    // User not logged in
    return (
      <div className="text-center p-8 mt-8">
        <p className="text-red-600 dark:text-red-400 text-lg mb-2">
          Please log in to view your dashboard
        </p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Dashboard Overview
        </h1>

        {error ? (
          <div>
            <p className="text-red-600 dark:text-red-400 mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
              Could not load stats: {error.message}
            </p>
            <StatsOverview stats={fallbackStats} />
          </div>
        ) : (
          <StatsOverview stats={stats || fallbackStats} />
        )}
      </div>
    </DashboardLayout>
  );
}
