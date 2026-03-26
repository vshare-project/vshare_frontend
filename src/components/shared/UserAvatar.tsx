import React, { useState, useEffect } from 'react';
import { User as UserIcon } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, alt, className = '' }) => {
  // Logic xử lý URL ảnh (Nếu BE trả về link tương đối thì nối URL API vào đây)
  const getFullImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL}${url}`;
  };

  const [imgSrc, setImgSrc] = useState<string | null>(getFullImageUrl(src));
  const [hasError, setHasError] = useState(false);

  // Đồng bộ lại khi props src thay đổi (sau khi upload)
  useEffect(() => {
    setImgSrc(getFullImageUrl(src));
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center ${className}`}>
      {imgSrc && !hasError ? (
        <img
          src={imgSrc}
          alt={alt || 'User Avatar'}
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        // Fallback sang Icon nếu không có ảnh hoặc ảnh lỗi
        <UserIcon className="w-1/2 h-1/2 text-brand-400" />
      )}
    </div>
  );
};

export default UserAvatar;