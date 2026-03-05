'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthenticatedImageProps {
  storagePath: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export default function AuthenticatedImage({ 
  storagePath, 
  alt, 
  className = '',
  onClick 
}: AuthenticatedImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadImage() {
      try {
        // Check if it's already a full URL
        if (storagePath.startsWith('http')) {
          setImageUrl(storagePath);
          setLoading(false);
          return;
        }

        // Download the image with authentication
        const { data, error: downloadError } = await supabase.storage
          .from('message-attachments')
          .download(storagePath);

        if (downloadError) {
          console.error('Error loading image:', downloadError);
          setError(true);
          setLoading(false);
          return;
        }

        // Create object URL from blob
        const url = URL.createObjectURL(data);
        setImageUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error loading image:', err);
        setError(true);
        setLoading(false);
      }
    }

    loadImage();

    // Cleanup object URL on unmount
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [storagePath]);

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-700 animate-pulse`}>
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`${className} flex items-center justify-center bg-red-900/20 text-red-400 p-4`}>
        <div className="text-center">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt}
      className={className}
      onClick={onClick}
    />
  );
}
