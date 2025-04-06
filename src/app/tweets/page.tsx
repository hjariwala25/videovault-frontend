"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useUserQueries";
import { useUserTweets } from "@/hooks/useTweetQueries";
import MainLayout from "@/components/layout/MainLayout";
import TweetCard from "@/components/common/TweetCard";
import TweetForm from "@/components/common/TweetForm";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { Tweet } from "@/types";

export default function TweetsPage() {
  const { data: currentUser } = useCurrentUser();
  const { data: tweets, isLoading } = useUserTweets(currentUser?._id || "");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <MainLayout>
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-adaptive-heading">
          Your Tweets
        </h1>

        {currentUser && <TweetForm />}

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-4 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center mb-3">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full mb-3" />
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : tweets && tweets.length > 0 ? (
          <div className="space-y-4">
            {tweets.map((tweet: Tweet) => (
              <TweetCard key={tweet._id} tweet={tweet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-adaptive-heading mb-2">
              No tweets yet
            </h3>
            <p className="text-adaptive-muted max-w-md mx-auto">
              Start sharing your thoughts with your followers by creating your
              first tweet.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
