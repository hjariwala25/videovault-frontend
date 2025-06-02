import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, UserCheck, UserPlus } from "lucide-react";
import { formatCount } from "@/utils/formatTime";
import { toast } from "sonner";
import { SubscriptionMutation } from "@/types";

interface Owner {
  _id: string;
  username: string;
  fullname?: string;
  avatar?: string;
  subscribersCount?: number;
  isSubscribed?: boolean;
}

interface CurrentUser {
  _id: string;
  username: string;
  // Add other properties as needed
}

interface ChannelInfoProps {
  owner: Owner;
  currentUser: CurrentUser;
  toggleSubscription: SubscriptionMutation;
}

export default function ChannelInfo({
  owner,
  currentUser,
  toggleSubscription,
}: ChannelInfoProps) {
  if (!owner) {
    return (
      <div className="flex items-center">
        <div className="relative mr-3 flex-shrink-0">
          <Image
            src="/default-avatar.png"
            alt="Channel"
            width={48}
            height={48}
            className="rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
          />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">Channel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
      <Link
        href={`/channel/${owner.username}`}
        className="flex items-center group flex-1"
      >
        <div className="relative mr-3 flex-shrink-0">
          <Image
            src={owner.avatar || "/default-avatar.png"}
            alt={owner.username}
            width={48}
            height={48}
            className="rounded-full h-10 w-10 border-2 border-white dark:border-gray-800 shadow-sm group-hover:border-blue-200 dark:group-hover:border-blue-700 transition-all"
          />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center">
            {owner.fullname || owner.username}
            <ExternalLink size={14} className="ml-1.5 opacity-60" />
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            @{owner.username}
          </p>
          {/* Subscriber count  */}
          {owner.subscribersCount !== undefined && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formatCount(owner.subscribersCount)} subscribers
            </p>
          )}
        </div>
      </Link>

      {/* Subscribe button  */}
      {owner && currentUser && owner._id !== currentUser._id && (
        <Button
          variant="outline"
          onClick={() => {
            if (owner?._id) {
              // Store current subscription state
              const wasSubscribed = owner.isSubscribed;

              toggleSubscription.mutate(owner._id, {
                onSuccess: () => {
                  owner.isSubscribed = !wasSubscribed;

                  toast.success(
                    wasSubscribed
                      ? "Unsubscribed successfully"
                      : "Subscribed successfully"
                  );
                },
                onError: () => {
                  toast.error("Failed to update subscription");
                },
              });
            }
          }}
          className={`flex-shrink-0 border-gray-200 dark:border-gray-800 ${
            owner.isSubscribed
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-900 dark:text-white"
          } hover:bg-gray-100 dark:hover:bg-black/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors`}
          disabled={toggleSubscription.isPending}
        >
          {toggleSubscription.isPending ? (
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : owner.isSubscribed ? (
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
  );
}
