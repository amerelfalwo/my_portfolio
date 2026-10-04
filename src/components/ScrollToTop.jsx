import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
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
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 w-12 h-12 flex items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-xl rounded-full shadow-[0_0_30px_rgba(124,58,237,0.15)] border border-white/10 hover:border-[#d8b4fe]/50 hover:bg-[#7c3aed]/20 transition-all duration-300 group"
          aria-label="Scroll to top"
        >
          <ArrowUp className="text-[#d8b4fe] w-6 h-6 group-hover:animate-bounce drop-shadow-[0_0_8px_rgba(216,180,254,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(216,180,254,0.8)]" />
        </m.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
