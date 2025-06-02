import { Loader2 } from "lucide-react";

interface LoadMoreProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  hasItems: boolean;
}

export default function LoadMore({
  isFetchingNextPage,
  hasNextPage,
  hasItems,
}: LoadMoreProps) {
  return (
    <div className="flex justify-center items-center py-8">
      {isFetchingNextPage && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2 text-blue-500" />
          <span className="text-adaptive-muted">Loading more videos...</span>
        </div>
      )}

      {!hasNextPage && hasItems && (
        <p className="text-adaptive-muted">No more videos to load</p>
      )}
    </div>
  );
}
