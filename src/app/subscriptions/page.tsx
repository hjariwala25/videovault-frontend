"use client";

import { useCurrentUser } from "@/hooks/useUserQueries";
import { useSubscribedChannels } from "@/hooks/useSubscriptionQueries";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Subscriptions() {
  const { data: currentUser, isLoading: userLoading } = useCurrentUser();
  const {
    data: subscriptionsData,
    isLoading: subscriptionsLoading,
    error,
    refetch,
  } = useSubscribedChannels(currentUser?._id || "");
  const [isClient, setIsClient] = useState(false);

  // Extract the actual subscription data 
  const subscriptions = Array.isArray(subscriptionsData)
    ? subscriptionsData
    : subscriptionsData?.data || [];

  useEffect(() => {
    setIsClient(true);
    if (subscriptionsData) {
      console.log("Raw subscription data:", subscriptionsData);
    }
  }, [subscriptionsData]);

  // Wait for user to load before showing anything
  useEffect(() => {
    if (currentUser?._id) {
      refetch();
    }
  }, [currentUser, refetch]);

  if (!isClient) return null;

  const isLoading = userLoading || subscriptionsLoading;

  if (isLoading)
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        </div>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <div className="text-center p-8 mt-4">
          <p className="text-red-600 dark:text-red-400 text-lg mb-2">
            Error loading subscriptions: {error.message}
          </p>
          <Button
            onClick={() => refetch()}
            className="mt-4 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Retry
          </Button>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Subscriptions
        </h1>

        {subscriptions && subscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map(
              (
                sub: {
                  subscribedChannel: {
                    username: string;
                    fullname?: string;
                    avatar?: string;
                    _id: string;
                  };
                },
                index: number
              ) => {
                // Get the subscribedChannel data directly
                const channelData = sub.subscribedChannel || {};

                // Safely extract fields with fallbacks
                const username = channelData.username || "";
                const fullname =
                  channelData.fullname || username || "Unknown Channel";
                const avatar = channelData.avatar || "/default-avatar.png";
                const channelId = channelData._id || "";

                if (!username) {
                  console.warn(
                    `Missing username for subscription ${index}:`,
                    sub
                  );
                  return (
                    <div
                      key={`invalid-sub-${index}`}
                      className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20"
                    >
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        Invalid subscription data
                      </p>
                    </div>
                  );
                }

                return (
                  <Link
                    href={`/channel/${username}`}
                    key={channelId || `sub-${index}`}
                    className="group relative block overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black p-0.5 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] dark:shadow-gray-900/30"
                  >
                    {/* Subtle background gradient pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Card inner content */}
                    <div className="relative rounded-[10px] bg-white dark:bg-black/40 p-5 overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 h-20 w-20 -mr-10 -mt-10 bg-gradient-to-br from-blue-100/40 to-purple-100/40 dark:from-blue-800/20 dark:to-purple-800/20 rounded-full blur-xl"></div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative">
                          <div className="relative inline-block">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 blur-[2px] scale-[1.04] opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                            <Image
                              src={avatar}
                              alt={username}
                              width={80}
                              height={80}
                              className="relative rounded-full object-cover border-[3px] border-white dark:border-gray-800 shadow-sm z-10"
                            />
                          </div>
                        </div>

                        {/* Channel details */}
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                            {fullname}
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                            @{username}
                          </p>
                          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              Subscribed
                            </span>
                          </div>
                        </div>

                        {/* View button appears on hover */}
                        <div className="mt-3 sm:mt-0 sm:absolute sm:right-5 sm:top-1/2 sm:-translate-y-1/2 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full text-white shadow-md">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800 p-8 text-center">
            <UserPlus
              size={48}
              className="mx-auto mb-4 text-gray-400 dark:text-gray-600"
            />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No subscriptions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You haven&apos;t subscribed to any channels yet.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-colors"
            >
              Discover channels
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
