"use client";

import { useState, useRef } from "react";
import { useUpdateCoverImage } from "@/hooks/useUserQueries";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { toast } from "sonner";
import Image from "next/image";
import { ImageIcon, Upload } from "lucide-react";

interface CoverUploadProps {
  currentUser: User;
}

export default function CoverUpload({ currentUser }: CoverUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateCover = useUpdateCoverImage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      setFile(selectedFile);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select an image first");
      return;
    }
    
    toast.promise(
      updateCover.mutateAsync(file),
      {
        loading: "Uploading cover image...",
        success: () => {
          setFile(null);
          setPreviewUrl(null);
          return "Cover image updated successfully";
        },
        error: (err) => `Error: ${err?.message || "Failed to update cover image"}`,
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative h-48 mb-4 border border-gray-100 dark:border-gray-800">
        {(previewUrl || currentUser.coverImage) ? (
          <Image
            src={previewUrl || currentUser.coverImage || ""}
            alt="Cover image"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400 dark:text-gray-600">
              <ImageIcon className="h-12 w-12 mx-auto mb-2" />
              <p>No cover image yet</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
        >
          <Upload className="mr-2 h-4 w-4" />
          Select Cover Image
        </Button>
        
        {file && (
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            disabled={updateCover.isPending}
          >
            {updateCover.isPending ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : "Upload"}
          </Button>
        )}
      </div>
      
      {file && (
        <p className="text-sm text-green-600 dark:text-green-400">
          Selected: {file.name}
        </p>
      )}
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        Recommended size: 1200 × 300 pixels. Max size: 5MB.
      </p>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </form>
  );
}