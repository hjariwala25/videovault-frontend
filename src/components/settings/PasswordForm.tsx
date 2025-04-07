"use client";

import { useState } from "react";
import { useChangePassword } from "@/hooks/useUserQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Key } from "lucide-react";

export default function PasswordForm() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const changePassword = useChangePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    // Password match validation
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // Password strength validation
    if (formData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    toast.promise(
      changePassword.mutateAsync({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      }),
      {
        loading: "Changing password...",
        success: () => {
          // Clear form on success
          setFormData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          return "Password changed successfully";
        },
        error: (err) => `Error: ${err?.message || "Failed to change password"}`,
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="oldPassword" className="text-gray-700 dark:text-gray-300">Current Password</Label>
        <Input
          id="oldPassword"
          type="password"
          value={formData.oldPassword}
          onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
          placeholder="Enter your current password"
          className="border-gray-200 dark:border-gray-700 bg-white dark:bg-black/40"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          placeholder="Enter your new password"
          className="border-gray-200 dark:border-gray-700 bg-white dark:bg-black/40"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          placeholder="Confirm your new password"
          className="border-gray-200 dark:border-gray-700 bg-white dark:bg-black/40"
        />
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-lg p-3 mb-4">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          Use a strong password with at least 8 characters including numbers, letters, and symbols.
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        disabled={changePassword.isPending}
      >
        {changePassword.isPending ? (
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        ) : (
          <Key className="mr-2 h-4 w-4" />
        )}
        Change Password
      </Button>
    </form>
  );
}