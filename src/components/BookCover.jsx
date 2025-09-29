import React, { useEffect, useState } from "react";

/**
 * BookCover
 * Props:
 * - isbn: string (required) - ISBN to lookup via Google Books
 * - alt: string - alt text for the image
 * - className: string - class applied to the <img>
 * - fallback: string - fallback image URL when Google Books doesn't return a cover
 */
const BookCover = ({ isbn, alt = "Book cover", className = "", fallback }) => {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(Boolean(isbn));

  useEffect(() => {
    let cancelled = false;
    if (!isbn) {
      setSrc(fallback || null);
      setLoading(false);
      return;
    }

    setLoading(true);
    // Query Google Books for ISBN
    const query = `https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(
      isbn
    )}`;

    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const item = data && data.items && data.items[0];
        const img = item && item.volumeInfo && item.volumeInfo.imageLinks;
        const thumb = img && (img.thumbnail || img.smallThumbnail);
        if (thumb) {
          // Ensure https
          const secure = thumb.startsWith("http:") ? thumb.replace("http:", "https:") : thumb;
          setSrc(secure);
        } else {
          setSrc(fallback || null);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setSrc(fallback || null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isbn, fallback]);

  // While loading, render a simple placeholder div to maintain layout
  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse`} aria-hidden>
        {/* empty skeleton */}
      </div>
    );
  }

  if (!src) {
    // no image available
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center text-gray-500`}>
        <span className="text-xs">No cover</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(e) => {
        // fallback to provided fallback URL (if any) or remove src
        if (fallback && e.currentTarget.src !== fallback) {
          e.currentTarget.src = fallback;
        } else {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '';
        }
      }}
    />
  );
};

export default BookCover;
