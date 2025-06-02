import { useState, useRef, RefObject } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import VideoUploadDropzone from "./VideoUploadDropzone";
import ThumbnailUpload from "./ThumbnailUpload";

interface VideoUploadFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function VideoUploadForm({
  onSubmit,
  isSubmitting,
  onCancel,
}: VideoUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(
    null
  ) as RefObject<HTMLInputElement>;

  const validateFile = (selectedFile: File) => {
    setIsValidating(true);

    // Check file size (limit to 100MB)
    const MAX_SIZE = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > MAX_SIZE) {
      toast.error("File is too large. Maximum size is 100MB.");
      setIsValidating(false);
      return false;
    }

    // Check file type
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error(
        "Invalid file type. Supported formats are MP4, WebM, and QuickTime."
      );
      setIsValidating(false);
      return false;
    }

    setIsValidating(false);
    return true;
  };

  const handleFileChange = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      // Auto-populate title from filename if empty
      if (!title) {
        const fileName = selectedFile.name.split(".").slice(0, -1).join(".");
        setTitle(fileName);
      }
    }
  };

  const handleThumbnailChange = (file: File) => {
    // Preview the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setThumbnail(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    if (!thumbnail) {
      toast.error("Please select a thumbnail image");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title for the video");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description for the video");
      return;
    }

    const formData = new FormData();
    formData.append("videoFile", file);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Video Upload Area */}
      <VideoUploadDropzone
        file={file}
        setFile={setFile}
        onFileSelect={handleFileChange}
        isDisabled={isSubmitting}
        fileInputRef={fileInputRef}
      />

      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-adaptive-heading">
          Video Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a descriptive title"
          disabled={isSubmitting}
          className="input-dark shadow-sm"
        />
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-adaptive-heading">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide details about your video"
          className="min-h-[100px] input-dark shadow-sm"
          disabled={isSubmitting}
        />
      </div>

      {/* Thumbnail Upload */}
      <ThumbnailUpload
        thumbnail={thumbnail}
        thumbnailPreview={thumbnailPreview}
        onThumbnailChange={handleThumbnailChange}
        onRemoveThumbnail={() => {
          setThumbnail(null);
          setThumbnailPreview(null);
        }}
        isDisabled={isSubmitting}
      />

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800/40 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !file ||
            !thumbnail ||
            !title.trim() ||
            !description.trim() ||
            isValidating
          }
          className="gradient-bg text-white shadow-sm hover:shadow transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload Video"
          )}
        </Button>
      </div>
    </form>
  );
}
