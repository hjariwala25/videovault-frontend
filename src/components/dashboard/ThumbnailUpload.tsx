import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ThumbnailUploadProps {
  thumbnail: File | null;
  thumbnailPreview: string | null;
  onThumbnailChange: (file: File) => void;
  onRemoveThumbnail: () => void;
  isDisabled: boolean;
}

export default function ThumbnailUpload({
  thumbnailPreview,
  onThumbnailChange,
  onRemoveThumbnail,
  isDisabled,
}: ThumbnailUploadProps) {
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file for the thumbnail");
        return;
      }

      // Check size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Thumbnail image must be less than 2MB");
        return;
      }

      onThumbnailChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="thumbnail" className="text-adaptive-heading">
        Thumbnail Image <span className="text-red-500">*</span>
      </Label>
      <div className="mt-2">
        {thumbnailPreview ? (
          <div className="relative aspect-video mb-3 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden shadow-sm">
            <Image
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="object-cover w-full h-full"
              width={640}
              height={360}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
              onClick={onRemoveThumbnail}
              disabled={isDisabled}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-gray-400 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-900/30"
            onClick={() => document.getElementById("thumbnail-input")?.click()}
          >
            <div className="space-y-2">
              <ImageIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Click to upload thumbnail
              </div>
              <p className="text-xs text-adaptive-muted">
                PNG, JPG, WEBP up to 2MB
              </p>
            </div>
          </div>
        )}
        <input
          id="thumbnail-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleThumbnailChange}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
}
