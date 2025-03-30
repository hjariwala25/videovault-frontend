import { DashboardStats } from '@/types';

interface StatsOverviewProps {
  stats: DashboardStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Subscribers</h3>
        <p className="text-2xl">{stats.totalSubscribers}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Likes</h3>
        <p className="text-2xl">{stats.totalLikes}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Views</h3>
        <p className="text-2xl">{stats.totalViews}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold">Total Videos</h3>
        <p className="text-2xl">{stats.totalVideos}</p>
      </div>
    </div>
  );
}