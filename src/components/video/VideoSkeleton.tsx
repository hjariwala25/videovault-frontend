import { Skeleton } from "@/components/ui/skeleton";

export default function VideoSkeleton() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Skeleton className="w-full aspect-video rounded-lg" />

      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      <div className="flex items-center mt-2">
        <Skeleton className="h-4 w-32 mr-3" />
        <Skeleton className="h-4 w-4 rounded-full mr-3" />
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="flex items-center mt-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-full mr-3" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <Skeleton className="w-full h-32 mb-6 rounded-lg" />

      <div className="flex gap-2 mb-6">
        <Skeleton className="h-10 w-28 rounded-md" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
    </div>
  );
}
