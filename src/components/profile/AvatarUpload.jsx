import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, UploadCloud, RefreshCw, X, Check, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../ui/Toast';

export default function AvatarUpload({ currentAvatar, userName = 'Candidate User', onAvatarChange }) {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || null);
  const [previousAvatar, setPreviousAvatar] = useState(currentAvatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const validateAndProcessFile = (file) => {
    if (!file) return;

    // Allowed MIME types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      addToast({
        type: 'error',
        title: 'Invalid File Format',
        message: 'Please upload a JPEG, PNG, or WebP image file.'
      });
      return;
    }

    // Max size: 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      addToast({
        type: 'error',
        title: 'File Too Large',
        message: 'Profile photo size cannot exceed 5 MB.'
      });
      return;
    }

    // Save previous for rollback
    setPreviousAvatar(avatarUrl);

    // Create local object URL preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);

    // Simulate progress transmission & upload state
    setIsUploading(true);
    setUploadProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          addToast({
            type: 'success',
            title: 'Avatar Updated',
            message: 'Your profile picture has been saved successfully!'
          });
          if (onAvatarChange) onAvatarChange(previewUrl);
        }, 400);
      }
    }, 150);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndProcessFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    validateAndProcessFile(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    if (onAvatarChange) onAvatarChange(null);
    addToast({
      type: 'info',
      title: 'Avatar Removed',
      message: 'Profile image reset to default initials.'
    });
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Avatar Container with Hover Overlay */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group rounded-full p-1 border-2 transition-all duration-300 ${
          isDragging 
            ? 'border-indigo-600 ring-4 ring-indigo-500/20 scale-105' 
            : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500'
        }`}
      >
        <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500/10 to-indigo-600/20 border border-indigo-500/10 flex items-center justify-center shadow-lg">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={userName} 
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105" 
            />
          ) : (
            <span className="font-heading font-extrabold text-3xl sm:text-4xl text-indigo-600 dark:text-indigo-400 select-none">
              {getInitials(userName)}
            </span>
          )}

          {/* Upload Progress Overlay */}
          <AnimatePresence>
            {isUploading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2 z-20"
              >
                <RefreshCw className="h-6 w-6 animate-spin text-indigo-400" />
                <span className="text-[10px] font-extrabold font-mono">{uploadProgress}%</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hover Edit Action Overlay */}
          {!isUploading && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white cursor-pointer z-10 p-2 text-center"
            >
              <Camera className="h-6 w-6 text-indigo-300 mb-1 animate-bounce" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Change Photo</span>
            </div>
          )}
        </div>

        {/* Floating Quick Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all cursor-pointer z-30"
          title="Upload Profile Picture"
        >
          <Camera className="h-4 w-4" />
        </button>
      </div>

      {/* Hidden File Input */}
      <input 
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Quick Action buttons below avatar */}
      <div className="flex gap-2 items-center text-xs">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-[11px] cursor-pointer"
        >
          Upload Photo
        </button>
        {avatarUrl && (
          <>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="text-rose-500 hover:underline font-bold text-[11px] cursor-pointer"
            >
              Remove
            </button>
          </>
        )}
      </div>

      <p className="text-[10px] text-slate-400 font-medium">
        Supports JPG, PNG or WebP (Max 5MB)
      </p>
    </div>
  );
}
