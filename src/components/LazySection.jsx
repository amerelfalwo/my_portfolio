import { useState, useEffect, useRef } from 'react';

/**
 * High-performance viewport deferral wrapper.
 * Defers mounting and bundle fetching of below-the-fold sections until the user scrolls near them.
 */
export default function LazySection({ children, minHeight = '400px', rootMargin = '400px' }) {
  const [isVisible, setIsVisible] = useState(
    () => typeof window !== 'undefined' && Boolean(window.location.hash)
  );
  const containerRef = useRef(null);

  useEffect(() => {
    if (isVisible) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={containerRef} style={{ minHeight: isVisible ? 'auto' : minHeight }}>
      {isVisible ? children : null}
    </div>
  );
}
