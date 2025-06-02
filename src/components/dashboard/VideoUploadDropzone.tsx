import { useState, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Video, UploadCloud } from "lucide-react";

interface VideoUploadDropzoneProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onFileSelect: (file: File) => void;
  isDisabled: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
}

export default function VideoUploadDropzone({
  file,
  setFile,
  onFileSelect,
  isDisabled,
  fileInputRef,
}: VideoUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileSelect(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={handleFileChange}
        disabled={isDisabled}
      />

      {file ? (
        <div className="space-y-2">
          <Video className="h-12 w-12 mx-auto text-blue-500 dark:text-blue-400" />
          <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-md mx-auto">
            {file.name}
          </div>
          <p className="text-xs text-adaptive-muted">
            {(file.size / (1024 * 1024)).toFixed(2)}MB
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setFile(null);
            }}
            disabled={isDisabled}
            className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Change File
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <UploadCloud className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Drag and drop your video or click to browse
          </p>
          <p className="text-xs text-adaptive-muted">
            MP4, WebM, or QuickTime (max 100MB)
          </p>
        </div>
      )}
    </div>
  );
}
