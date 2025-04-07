"use client";

import { useState, useRef } from "react";
import { useUpdateAvatar } from "@/hooks/useUserQueries";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { toast } from "sonner";
import Image from "next/image";
import { Camera, Upload } from "lucide-react";

interface AvatarUploadProps {
  currentUser: User;
}

export default function AvatarUpload({ currentUser }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateAvatar = useUpdateAvatar();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 2MB)
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
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
      updateAvatar.mutateAsync(file),
      {
        loading: "Uploading avatar...",
        success: () => {
          setFile(null);
          setPreviewUrl(null);
          return "Avatar updated successfully";
        },
        error: (err) => `Error: ${err?.message || "Failed to update avatar"}`,
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md">
            <Image
              src={previewUrl || currentUser.avatar || "/default-avatar.png"}
              alt={currentUser.username}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
          >
            <Camera className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex-1 space-y-2">
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            Upload a new profile picture. This will be displayed on your channel and profile.
          </p>
          
          <div className="flex items-center space-x-2">
            <Button 
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Image
            </Button>
            
            {file && (
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                disabled={updateAvatar.isPending}
              >
                {updateAvatar.isPending ? (
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
        </div>
      </div>
      
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