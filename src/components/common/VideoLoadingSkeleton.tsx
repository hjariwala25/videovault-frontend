import { Skeleton } from "@/components/ui/skeleton";

interface VideoLoadingSkeletonProps {
  count?: number;
}

export default function VideoLoadingSkeleton({
  count = 6,
}: VideoLoadingSkeletonProps) {
  return (
    <div className="p-4">
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(count)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm"
            >
              <Skeleton className="w-full aspect-video" />
              <div className="p-4">
                <Skeleton className="h-5 w-full mb-2" />
                <div className="flex items-center mt-2">
                  <Skeleton className="h-8 w-8 rounded-full mr-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
