import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const heroThreshold = typeof window !== 'undefined' ? window.innerHeight * 0.75 : 600;
      if (window.pageYOffset > heroThreshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <m.button
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 10 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-20 end-6 z-40 w-11 h-11 flex items-center justify-center bg-surface border border-border text-foreground hover:bg-surface-muted rounded-full transition-colors cursor-pointer group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-4 h-4 text-foreground transition-transform group-hover:-translate-y-0.5" />
        </m.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
