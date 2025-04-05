import { DashboardStats } from "@/types";
import { Users, ThumbsUp, Eye, Film } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";

//SSR is disabled for the modal to prevent hydration errors
const SubscribersModal = dynamic(() => import("./SubscribersModal"), {
  ssr: false,
});

interface StatsOverviewProps {
  stats: DashboardStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const [showSubscribersModal, setShowSubscribersModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = useQueryClient();

  // Set up automatic refresh interval
  useEffect(() => {
    setIsMounted(true);

    // Set up interval to refresh stats every minute
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats() });
    }, 2000);

    return () => clearInterval(intervalId);
  }, [queryClient]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          onClick={() => isMounted && setShowSubscribersModal(true)}
        >
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-2.5 rounded-lg inline-flex mb-3">
            <Users size={22} className="text-white" />
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">
            Subscribers
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1.5">
            {stats.totalSubscribers.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2.5 rounded-lg inline-flex mb-3">
            <ThumbsUp size={22} className="text-white" />
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">
            Total Likes
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1.5">
            {stats.totalLikes.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2.5 rounded-lg inline-flex mb-3">
            <Eye size={22} className="text-white" />
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">
            Total Views
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1.5">
            {stats.totalViews.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2.5 rounded-lg inline-flex mb-3">
            <Film size={22} className="text-white" />
          </div>
          <h3 className="text-gray-600 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">
            Total Videos
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1.5">
            {stats.totalVideos.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Only render modal on client-side */}
      {isMounted && (
        <SubscribersModal
          isOpen={showSubscribersModal}
          onClose={() => setShowSubscribersModal(false)}
        />
      )}
    </>
  );
}
