"use client";

import { useParams } from "next/navigation";
import { useChannelProfile } from "@/hooks/useUserQueries";
import { useToggleSubscription } from "@/hooks/useSubscriptionQueries";
import { useCurrentUser } from "@/hooks/useUserQueries";
import { useUserTweets } from "@/hooks/useTweetQueries";
import { useVideos } from "@/hooks/useVideoQueries";
import MainLayout from "@/components/layout/MainLayout";
import VideoCard from "@/components/common/VideoCard";
import { Button } from "@/components/ui/button";
import TweetCard from "@/components/common/TweetCard";
import TweetForm from "@/components/common/TweetForm";
import { Tweet } from "@/types";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { MessageSquare, Film, UserCheck, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Video } from "@/types";
import { toast } from "sonner";

// Define tab types for type safety
type TabType = "videos" | "tweets";

export default function Channel() {
  const params = useParams();
  const username = params.username as string;
  const { data: channel, isLoading, error } = useChannelProfile(username);
  const { data: currentUser } = useCurrentUser();
  const { data: tweets } = useUserTweets(channel?._id || "");
  const { data: videoData } = useVideos({ userId: channel?._id });
  const toggleSubscription = useToggleSubscription();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("videos");

  // Get videos from the videoData
  const videos = useMemo(
    () => videoData?.pages?.flatMap((page) => page.videos || []) || [],
    [videoData]
  );

  useEffect(() => {
    setIsClient(true);
    if (videoData) {
      // console.log("Channel videos data:", videoData);
      // console.log("Extracted videos:", videos);
    }
  }, [videoData, videos]);

  if (!isClient) return null;
  if (isLoading)
    return (
      <MainLayout>
        <div>
          {/* Channel header */}
          <div className="bg-gray-100 dark:bg-gray-900 h-32 relative">
            <div className="absolute -bottom-12 left-6">
              <Skeleton className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800" />
            </div>
          </div>

          <div className="mt-16 px-6">
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>

            <div className="mt-8">
              <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 mb-6">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm"
                    >
                      <Skeleton className="w-full aspect-video" />
                      <div className="p-4">
                        <Skeleton className="h-5 w-full mb-2" />
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );

  if (error)
    return (
      <div className="text-center p-8 mt-4">
        <p className="text-red-600 dark:text-red-400 text-lg mb-2">
          Error loading channel: {error.message}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
        >
          Retry
        </Button>
      </div>
    );

  // Define if the channel being viewed is the user's own channel
  const isOwnChannel = channel?._id === currentUser?._id;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Cover Image */}
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 h-48 mb-6">
          {channel && channel.coverImage ? (
            <Image
              src={channel.coverImage}
              alt="Cover"
              width={1200}
              height={300}
              className="w-full h-48 object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20"></div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={channel?.avatar || "/default-avatar.png"}
                alt={channel?.username ?? "Username"}
                width={96}
                height={96}
                className="rounded-full border-2 h-40 w-40 object-cover border-white dark:border-gray-800 shadow-md bg-white dark:bg-gray-800"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {channel?.fullname || "User"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                @{channel?.username || params.username || ""}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                <span className="font-medium text-gray-900 dark:text-white">
                  {channel?.subscriberCount || 0}
                </span>{" "}
                subscribers •
                <span className="font-medium text-gray-900 dark:text-white">
                  {" "}
                  {videos.length || 0}
                </span>{" "}
                videos
              </p>
            </div>
          </div>

          {!isOwnChannel && (
            <Button
              onClick={() => {
                if (channel?._id) {
                  // Store current subscription state before toggling
                  const wasSubscribed = channel.isSubscribed;

                  channel.isSubscribed = !wasSubscribed;

                  toggleSubscription.mutate(channel._id, {
                    onSuccess: () => {
                      // Toast notification for success
                      toast.success(
                        wasSubscribed
                          ? "Unsubscribed successfully"
                          : "Subscribed successfully"
                      );
                    },
                    onError: () => {
                      channel.isSubscribed = wasSubscribed;

                      toast.error("Failed to update subscription");
                    },
                  });
                }
              }}
              disabled={toggleSubscription.isPending}
              className={`mt-4 sm:mt-0 ${
                channel?.isSubscribed
                  ? "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              }`}
            >
              {toggleSubscription.isPending ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : channel?.isSubscribed ? (
                <UserCheck className="mr-1.5 h-4 w-4" />
              ) : (
                <UserPlus className="mr-1.5 h-4 w-4" />
              )}
              {channel?.isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          )}
        </div>

        {/* Content Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("videos")}
              className={`pb-4 px-1 focus:outline-none transition-colors duration-200 ${
                activeTab === "videos"
                  ? "border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
              }`}
            >
              <div className="flex items-center">
                <Film size={18} className="mr-2" />
                <span>Videos</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("tweets")}
              className={`pb-4 px-1 focus:outline-none transition-colors duration-200 ${
                activeTab === "tweets"
                  ? "border-b-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
              }`}
            >
              <div className="flex items-center">
                <MessageSquare size={18} className="mr-2" />
                <span>Tweets</span>
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Content based on active tab */}
        <div className="animate-in fade-in duration-300">
          {activeTab === "videos" && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Videos
              </h2>
              {videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video: Video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-black/40 border border-gray-100 dark:border-gray-800 rounded-xl p-8 text-center">
                  <Film
                    size={40}
                    className="mx-auto mb-4 text-gray-400 dark:text-gray-600"
                  />
                  <p className="text-gray-600 dark:text-gray-400">
                    No videos uploaded yet
                  </p>
                </div>
              )}
            </section>
          )}

          {activeTab === "tweets" && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tweets
              </h2>

              {/* Add tweet form if viewing own channel */}
              {isOwnChannel && <TweetForm />}

              {tweets?.length > 0 ? (
                <div className="space-y-4">
                  {tweets.map((tweet: Tweet) => (
                    <TweetCard
                      key={tweet._id}
                      tweet={tweet}
                      showOptions={isOwnChannel}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-black/40 border border-gray-100 dark:border-gray-800 rounded-xl p-8 text-center">
                  <MessageSquare
                    size={40}
                    className="mx-auto mb-4 text-gray-400 dark:text-gray-600"
                  />
                  <p className="text-gray-600 dark:text-gray-400">
                    No tweets found
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
