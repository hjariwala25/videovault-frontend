"use client";

import { useState } from "react";
import { useUpdateAccount } from "@/hooks/useUserQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User } from "@/types";
import { Save } from "lucide-react";

interface AccountFormProps {
  currentUser: User;
}

export default function AccountForm({ currentUser }: AccountFormProps) {
  const [formData, setFormData] = useState({
    fullname: currentUser.fullname || "",
    email: currentUser.email || "",
  });
  
  const updateAccount = useUpdateAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.fullname.trim() || !formData.email.trim()) {
      toast.error("Both name and email are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    toast.promise(
      updateAccount.mutateAsync(formData),
      {
        loading: "Updating account details...",
        success: "Account details updated successfully",
        error: (err) => `Error: ${err?.message || "Failed to update account"}`,
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">Username</Label>
        <Input
          id="username"
          value={currentUser.username}
          disabled
          className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">Username cannot be changed</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fullname" className="text-gray-700 dark:text-gray-300">Full Name</Label>
        <Input
          id="fullname"
          value={formData.fullname}
          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
          placeholder="Your full name"
          className="border-gray-200 dark:border-gray-700 bg-white dark:bg-black/40"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="your.email@example.com"
          className="border-gray-200 dark:border-gray-700 bg-white dark:bg-black/40"
        />
      </div>
      
      <Button 
        type="submit" 
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        disabled={updateAccount.isPending}
      >
        {updateAccount.isPending ? (
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        Save Changes
      </Button>
    </form>
  );
}