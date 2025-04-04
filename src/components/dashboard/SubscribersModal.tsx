import { useChannelSubscribers } from "@/hooks/useSubscriptionQueries";
import { useCurrentUser } from "@/hooks/useUserQueries";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, X, Loader2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToggleSubscription } from "@/hooks/useSubscriptionQueries";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface SubscribersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscribersModal({
  isOpen,
  onClose,
}: SubscribersModalProps) {
  // Add client-side only state to prevent hydration issues
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: currentUser } = useCurrentUser();
  const { data: subscribers, isLoading } = useChannelSubscribers(
    currentUser?._id || ""
  );
  const toggleSubscription = useToggleSubscription();

  const [localSubscribers, setLocalSubscribers] = useState<
    {
      subscriber: {
        _id: string;
        username: string;
        fullname: string;
        avatar?: string;
        subscribersCount?: number;
        subscribedToSubscriber: boolean;
      };
    }[]
  >([]);

  useEffect(() => {
    if (subscribers) {
      setLocalSubscribers(subscribers);
    }
  }, [subscribers]);

  // Only render on client side and when open
  if (!isMounted || !isOpen) return null;

  const handleToggleSubscription = (subscriberId: string) => {
    // Find the subscriber in our local state
    const updatedSubscribers = [...localSubscribers];
    const subscriberIndex = updatedSubscribers.findIndex(
      (sub) => sub.subscriber._id === subscriberId
    );

    if (subscriberIndex >= 0) {
      // Store current state before toggling
      const wasSubscribed =
        updatedSubscribers[subscriberIndex].subscriber.subscribedToSubscriber;

      updatedSubscribers[subscriberIndex].subscriber.subscribedToSubscriber =
        !wasSubscribed;
      setLocalSubscribers(updatedSubscribers);

      toggleSubscription.mutate(subscriberId, {
        onSuccess: () => {
          toast.success(
            wasSubscribed
              ? "Unsubscribed successfully"
              : "Subscribed successfully"
          );
        },
        onError: () => {
          // Revert the optimistic update on error
          updatedSubscribers[
            subscriberIndex
          ].subscriber.subscribedToSubscriber = wasSubscribed;
          setLocalSubscribers(updatedSubscribers);
          toast.error("Failed to update subscription");
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-effect w-full max-w-md max-h-[80vh] overflow-hidden shadow-lg dark:shadow-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800/60">
          <h2 className="text-xl font-semibold text-adaptive-heading">
            Your Subscribers
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>

        <div className="overflow-y-auto p-4 max-h-[calc(80vh-130px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-12 w-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500 dark:text-blue-400" />
              </div>
              <p className="text-adaptive-muted">Loading subscribers...</p>
            </div>
          ) : localSubscribers && localSubscribers.length > 0 ? (
            <div className="space-y-3">
              {localSubscribers.map(
                (sub: {
                  subscriber: {
                    _id: string;
                    username: string;
                    fullname: string;
                    avatar?: string;
                    subscribersCount?: number;
                    subscribedToSubscriber: boolean;
                  };
                }) => (
                  <div
                    key={sub.subscriber._id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition"
                  >
                    <Link
                      href={`/channel/${sub.subscriber.username}`}
                      className="flex items-center group"
                    >
                      <div className="relative w-11 h-11 mr-3">
                        <Image
                          src={sub.subscriber.avatar || "/default-avatar.png"}
                          alt={sub.subscriber.username}
                          fill
                          className="rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-adaptive-heading group-hover:text-blue-500 transition">
                          {sub.subscriber.fullname}
                        </h3>
                        <p className="text-sm text-adaptive-muted">
                          @{sub.subscriber.username} •{" "}
                          <span className="text-gray-600 dark:text-gray-400">
                            {sub.subscriber.subscribersCount || 0} subscribers
                          </span>
                        </p>
                      </div>
                    </Link>

                    {currentUser?._id !== sub.subscriber._id && (
                      <Button
                        variant={
                          sub.subscriber.subscribedToSubscriber
                            ? "outline"
                            : "default"
                        }
                        size="sm"
                        className={
                          sub.subscriber.subscribedToSubscriber
                            ? "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
                            : "gradient-bg text-white shadow-sm hover:shadow-md"
                        }
                        onClick={() =>
                          handleToggleSubscription(sub.subscriber._id)
                        }
                        disabled={toggleSubscription.isPending}
                      >
                        {toggleSubscription.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : sub.subscriber.subscribedToSubscriber ? (
                          <>
                            <UserCheck className="h-4 w-4 mr-1.5" />
                            <span className="font-medium">Subscribed</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-1.5" />
                            <span>Subscribe</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100/80 dark:bg-gray-800/60 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-adaptive-heading mb-1">
                No subscribers yet
              </h3>
              <p className="text-adaptive-muted max-w-xs mx-auto">
                When people subscribe to your channel, they&apos;ll appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
