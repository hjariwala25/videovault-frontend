'use client';

import { useState } from 'react';
import { useRegister } from '@/hooks/useUserQueries';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    password: '',
  });
  
  const [avatar, setAvatar] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const registerMutation = useRegister();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.username || !formData.email || !formData.fullname || !formData.password || !avatar) {
      setError('All fields and avatar are required');
      return;
    }

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      data.append('fullname', formData.fullname);
      data.append('password', formData.password);
      
      
      if (avatar) {
        data.append('avatar', avatar);
      }
      
      if (coverImage) {
        data.append('coverImage', coverImage);
      }

      console.log('Submitting form with avatar:', avatar?.name);
      
      await registerMutation.mutateAsync(data);
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'coverImage') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log(`Selected ${type}:`, file.name);
      
      if (type === 'avatar') {
        setAvatar(file);
      } else {
        setCoverImage(file);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
        encType="multipart/form-data"
      >
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        
        {/* Form fields */}
        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="Enter your username"
            required
          />
        </div>
        
        {/* Email, fullname, password fields... */}
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            id="fullname"
            type="text"
            value={formData.fullname}
            onChange={(e) =>
              setFormData({ ...formData, fullname: e.target.value })
            }
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Enter your password"
            required
          />
        </div>
        
        {/* File upload fields */}
        <div className="mb-6">
          <Label htmlFor="avatar">Avatar (Required)</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'avatar')}
            required
          />
          {avatar && <p className="text-xs text-green-600 mt-1">Selected: {avatar.name}</p>}
        </div>
        
        <div className="mb-6">
          <Label htmlFor="coverImage">Cover Image (Optional)</Label>
          <Input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'coverImage')}
          />
          {coverImage && <p className="text-xs text-green-600 mt-1">Selected: {coverImage.name}</p>}
        </div>
        
        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Registering...' : 'Register'}
        </Button>
        
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}