"use client";

import { useCurrentUser } from "@/hooks/useUserQueries";
import { useSubscribedChannels } from "@/hooks/useSubscriptionQueries";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Subscriptions() {
  const { data: currentUser } = useCurrentUser();
  const {
    data: channels,
    isLoading,
    error,
  } = useSubscribedChannels(currentUser?._id || "");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Debug log to see the actual data structure
    if (channels) {
      console.log("Subscription data:", channels);
    }
  }, [channels]);

  if (!isClient) return null;
  if (isLoading)
    return (
      <MainLayout>
        <div className="text-center p-4">Loading subscriptions...</div>
      </MainLayout>
    );

  if (error)
    return (
      <MainLayout>
        <div className="text-center p-4 text-red-500">
          Error: {error.message}
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>

        {channels && channels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((sub: any) => {
              // Check if the subscription has the expected structure
              const channelInfo = sub.channel || sub;
              const username = channelInfo.username || "unknown";
              const avatar = channelInfo.avatar || "/default-avatar.png";
              const fullname = channelInfo.fullname || username;

              return (
                <Link
                  href={`/channel/${username}`}
                  key={sub._id || channelInfo._id}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <Image
                    src={avatar}
                    alt={username}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{fullname}</p>
                    <p className="text-gray-600">@{username}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-lg text-gray-600">
              You haven't subscribed to any channels yet.
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Discover channels to subscribe
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
