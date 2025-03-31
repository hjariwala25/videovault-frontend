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
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Channel() {
  const params = useParams();
  const username = params.username as string;
  const { data: channel, isLoading, error } = useChannelProfile(username);
  const { data: currentUser } = useCurrentUser();
  const { data: tweets } = useUserTweets(channel?._id || "");
  const { data: videoData } = useVideos({ userId: channel?._id });
  const toggleSubscription = useToggleSubscription();
  const [isClient, setIsClient] = useState(false);

  // Extract the videos array from the paginated response
  const videos = videoData?.videos || [];

  useEffect(() => {
    setIsClient(true);
    if (videoData) {
      console.log("Channel videos data:", videoData);
    }
  }, [videoData]);

  if (!isClient) return null;
  if (isLoading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-500">Error: {error.message}</div>
    );

  const isOwnChannel = currentUser?._id === channel?._id;

  return (
    <MainLayout>
      <div className="p-4">
        {channel && channel.coverImage && (
          <Image
            src={channel.coverImage}
            alt="Cover"
            width={1200}
            height={300}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        <div className="flex items-center gap-4 mt-4">
          <Image
            src={channel?.avatar || "/default-avatar.png"}
            alt={channel?.username ?? "Default Username"}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold">{channel?.fullname}</h1>
            <p className="text-gray-600">@{channel?.username}</p>
            <p className="text-gray-600">
              {channel?.subscriberCount} subscribers •{" "}
              {channel?.channelsSubscribedToCount} subscribed
            </p>
            {!isOwnChannel && (
              <Button
                onClick={() =>
                  channel && toggleSubscription.mutate(channel._id)
                }
                disabled={toggleSubscription.isPending}
                className="mt-2"
              >
                {channel?.isSubscribed ? "Unsubscribe" : "Subscribe"}
              </Button>
            )}
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Videos</h2>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {videos.map((video: any) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          ) : (
            <p className="text-center mt-4 text-gray-500">No videos found</p>
          )}
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Tweets</h2>
          {tweets?.length > 0 ? (
            tweets.map((tweet: any) => (
              <div
                key={tweet._id}
                className="p-4 bg-white rounded-lg shadow mt-2"
              >
                <p>{tweet.content}</p>
                <span className="text-gray-500 text-sm">
                  {new Date(tweet.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center mt-4 text-gray-500">No tweets found</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
