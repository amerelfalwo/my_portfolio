import { useState, useEffect, useRef } from 'react';

/**
 * High-performance viewport deferral wrapper.
 * Defers mounting and bundle fetching of below-the-fold sections until the user scrolls near them.
 */
export default function LazySection({ children, minHeight = '400px', rootMargin = '400px' }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Immediate mount if URL has a direct anchor hash (e.g., #contact)
    if (typeof window !== 'undefined' && window.location.hash) {
      setIsVisible(true);
      return;
    }

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
  }, [rootMargin]);

  return (
    <div ref={containerRef} style={{ minHeight: isVisible ? 'auto' : minHeight }}>
      {isVisible ? children : null}
    </div>
  );
}
