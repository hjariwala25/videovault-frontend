"use client";

import { useChannelStats } from "@/hooks/useDashboardQueries";
import StatsOverview from "@/components/dashboard/StatsOverview";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useCurrentUser } from "@/hooks/useUserQueries";

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
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
      </div>
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
