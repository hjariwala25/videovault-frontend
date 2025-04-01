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

  if (isLoading) return <div className="text-center p-4">Loading...</div>;

  if (!user) {
    // User not logged in
    return (
      <div className="text-center p-4 text-red-500">
        Please log in to view your dashboard
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardLayout>
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            {error ? (
              <div>
                <p className="text-red-500 mb-4">
                  Could not load stats: {error.message}
                </p>
                <StatsOverview stats={fallbackStats} />
              </div>
            ) : (
              <StatsOverview stats={stats || fallbackStats} />
            )}
          </div>
        </DashboardLayout>
      </div>
    </div>
  );
}
