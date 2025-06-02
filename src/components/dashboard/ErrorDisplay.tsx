import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="p-4">
      <div className="text-red-600 dark:text-red-400 mb-6 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/20">
        Error loading videos: {message}
      </div>
      <Button onClick={onRetry} className="btn-dark">
        Try Again
      </Button>
    </div>
  );
}
