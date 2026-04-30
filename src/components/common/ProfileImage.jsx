import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Edit2, Trash2 } from '../../utils/icons';

const ProfileImage = ({ 
  size = 'large', 
  showEditButton = true,
  className = '',
  onEditComplete = null,
  isEditable = false
}) => {
  const { user, updateUserAvatar, removeUserAvatar } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const canEdit = showEditButton && isEditable;

  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-32 h-32',
    xlarge: 'w-48 h-48'
  };

  const currentSize = sizeClasses[size] || sizeClasses.large;

  const optimizeImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 720;
          const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
          const width = Math.round(img.width * scale);
          const height = Math.round(img.height * scale);

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas not supported'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

  const handleImageSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      setIsLoading(true);
      const optimizedAvatar = await optimizeImage(file);
      await updateUserAvatar(optimizedAvatar);
      onEditComplete?.();
    } catch (error) {
      console.error('Failed to update avatar:', error);
      alert('Unable to save this image. Please try a smaller image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await removeUserAvatar();
      onEditComplete?.();
    } catch (error) {
      console.error('Failed to remove avatar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickEdit = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="Profile"
          className={`${currentSize} rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg`}
        />
      ) : (
        <div className={`${currentSize} rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg`}>
          <span className="text-white font-bold text-2xl">{user?.name?.slice(0, 2).toUpperCase() || 'U'}</span>
        </div>
      )}

      {canEdit && (
        <div className="absolute -right-2 -bottom-2 flex gap-2">
          <button
            onClick={handleQuickEdit}
            disabled={isLoading}
            className="h-9 w-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              text-gray-700 dark:text-gray-300 flex items-center justify-center shadow-md
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer disabled:opacity-60"
            title="Edit profile picture"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={handleRemove}
            disabled={isLoading || !user?.avatar}
            className="h-9 w-9 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              text-red-600 dark:text-red-400 flex items-center justify-center shadow-md
              hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove profile picture"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfileImage;
