"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Search, UserPlus, UserCheck, RefreshCw } from "lucide-react";
import { useCurrentUser } from "@/hooks/useUserQueries";
import { useToggleSubscription } from "@/hooks/useSubscriptionQueries";
import { toast } from "sonner";
import api from "@/services/api";
import { debounce } from "@/utils/helpers";

// Define types
type Channel = {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
  coverImage?: string;
  subscribersCount: number;
  videosCount: number;
  isSubscribed: boolean;
  createdAt: string;
};

type PaginationData = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const toggleSubscription = useToggleSubscription();

  // States
  const [isClient, setIsClient] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Get URL params
  const sort = searchParams.get("sort") || "subscribers";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const search = searchParams.get("search") || "";

  // Function to fetch channels
  const fetchChannels = useCallback(
    async (
      options: {
        sort?: string;
        page?: number;
        limit?: number;
        search?: string;
        isLoadingMore?: boolean;
      } = {}
    ) => {
      const {
        sort: sortOption = sort,
        page: pageOption = page,
        limit: limitOption = limit,
        search: searchOption = search,
        isLoadingMore: loadingMore = false,
      } = options;

      if (!loadingMore) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        // Construct query params
        const queryParams = new URLSearchParams();
        queryParams.append("sort", sortOption);
        queryParams.append("page", pageOption.toString());
        queryParams.append("limit", limitOption.toString());

        if (searchOption) {
          queryParams.append("search", searchOption);
        }

        const response = await api.get(
          `/discover/channels?${queryParams.toString()}`
        );

        if (response.data.success) {
          const { channels: newChannels, pagination: newPagination } =
            response.data.data;

          if (loadingMore && channels.length > 0) {
            // Append new channels to existing list
            setChannels((prev) => [...prev, ...newChannels]);
          } else {
            setChannels(newChannels);
          }

          setPagination(newPagination);
        } else {
          setError("Failed to fetch channels");
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
        setError("An error occurred while fetching channels");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsSearching(false);
      }
    },
    [channels.length, limit, page, search, sort]
  );

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    router.push(
      `/explore?sort=${newSort}&page=1&limit=${limit}${
        search ? `&search=${search}` : ""
      }`
    );
  };

  // Handle search with debounce
  const debouncedSearch = useRef(
    debounce((...args: unknown[]) => {
      const value = args[0] as string;
      router.push(
        `/explore?sort=${sort}&page=1&limit=${limit}${
          value ? `&search=${value}` : ""
        }`
      );
    }, 500)
  ).current;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    router.push(
      `/explore?sort=${sort}&page=1&limit=${limit}${
        searchQuery ? `&search=${searchQuery}` : ""
      }`
    );
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle subscription toggle
  const handleToggleSubscription = (channelId: string, index: number) => {
    // Update UI optimistically
    setChannels((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isSubscribed: !updated[index].isSubscribed,
      };
      return updated;
    });

    // Make API call
    toggleSubscription.mutate(channelId, {
      onSuccess: () => {
        toast.success("Subscription updated successfully");
      },
      onError: () => {
        // Revert UI change on error
        setChannels((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            isSubscribed: !updated[index].isSubscribed,
          };
          return updated;
        });
        toast.error("Failed to update subscription");
      },
    });
  };

  // Load more channels
  const loadMoreChannels = () => {
    if (pagination?.hasNextPage) {
      fetchChannels({
        page: pagination.currentPage + 1,
        isLoadingMore: true,
      });
    }
  };

  // Re-fetch when URL params change
  useEffect(() => {
    if (isClient) {
      fetchChannels();
    }
  }, [fetchChannels, isClient, sort, page, limit, search]);

  // Client-side rendering guard
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Discover Channels
          </h1>

          {/* Search form */}
          <form
            onSubmit={handleSearch}
            className="relative w-full md:w-auto md:min-w-[300px]"
          >
            <Input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={handleSearchInput}
              className="rounded-lg border-gray-200 dark:border-gray-800 pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              disabled={isSearching}
            >
              {isSearching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>

        {/* Sort options */}
        <div className="flex flex-wrap gap-2 mb-6 bg-gray-50 dark:bg-black/40 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
          <Button
            variant={sort === "subscribers" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("subscribers")}
            className={
              sort === "subscribers"
                ? ""
                : "border-gray-200 dark:border-gray-800"
            }
          >
            Most Popular
          </Button>
          <Button
            variant={sort === "recent" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("recent")}
            className={
              sort === "recent" ? "" : "border-gray-200 dark:border-gray-800"
            }
          >
            Recently Joined
          </Button>
          <Button
            variant={sort === "videos" ? "default" : "outline"}
            size="sm"
            onClick={() => handleSortChange("videos")}
            className={
              sort === "videos" ? "" : "border-gray-200 dark:border-gray-800"
            }
          >
            Most Videos
          </Button>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-black/40 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  <Skeleton className="w-full h-24" />
                  <div className="p-4">
                    <div className="flex items-center">
                      <Skeleton className="h-12 w-12 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-9 w-24 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button
              onClick={() => fetchChannels()}
              className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
            >
              Retry
            </Button>
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center p-8 bg-white dark:bg-black/40 rounded-xl border border-gray-100 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {search
                ? `No channels found matching "${search}"`
                : "No channels found"}
            </p>
            {search && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  router.push(`/explore?sort=${sort}&page=1&limit=${limit}`);
                }}
                className="mt-2 border-gray-200 dark:border-gray-800"
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {channels.map((channel, index) => (
                <div
                  key={channel._id}
                  className="bg-white dark:bg-black/40 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
                >
                  {/* Cover image */}
                  <div className="h-24 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 relative">
                    {channel.coverImage && (
                      <Image
                        src={channel.coverImage}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center">
                      {/* Avatar */}
                      <Link
                        href={`/channel/${channel.username}`}
                        className="mr-3 flex-shrink-0"
                      >
                        <Image
                          src={channel.avatar || "/default-avatar.png"}
                          alt={channel.username}
                          width={48}
                          height={48}
                          className="rounded-full h-12 w-12 object-cover border-2 border-white dark:border-gray-800 shadow-sm"
                        />
                      </Link>

                      {/* Channel info */}
                      <div>
                        <Link
                          href={`/channel/${channel.username}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {channel.fullname}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{channel.username}
                        </p>
                      </div>
                    </div>

                    {/* Stats and action */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">
                          {channel.subscribersCount.toLocaleString()}
                        </span>{" "}
                        subscribers •
                        <span className="font-medium">
                          {" "}
                          {channel.videosCount}
                        </span>{" "}
                        videos
                      </div>

                      {currentUser && currentUser._id !== channel._id && (
                        <Button
                          size="sm"
                          variant={channel.isSubscribed ? "outline" : "default"}
                          onClick={() =>
                            handleToggleSubscription(channel._id, index)
                          }
                          disabled={toggleSubscription.isPending}
                          className={
                            channel.isSubscribed
                              ? "border-gray-200 dark:border-gray-800"
                              : "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                          }
                        >
                          {toggleSubscription.isPending ? (
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : channel.isSubscribed ? (
                            <>
                              <UserCheck className="mr-1.5 h-4 w-4" />
                              Subscribed
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-1.5 h-4 w-4" />
                              Subscribe
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination?.hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={loadMoreChannels}
                  disabled={isLoadingMore}
                  className="border-gray-200 dark:border-gray-800"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Channels"
                  )}
                </Button>
              </div>
            )}

            {/* Summary */}
            {pagination && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Showing {channels.length} of {pagination.totalResults} channels
              </p>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
