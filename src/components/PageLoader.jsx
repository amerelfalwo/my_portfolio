import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [visible, setVisible] = useState(() => {
    // Only show once per session in the browser
    if (typeof window === 'undefined') return false;
    const seen = sessionStorage.getItem('portfolio_preloader_seen');
    return !seen;
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      sessionStorage.setItem('portfolio_preloader_seen', 'true');
      setVisible(false);
      return;
    }

    // Prevent body scroll during intro
    document.body.style.overflow = 'hidden';

    // Non-linear realistic progress steps
    const steps = [
      { target: 20, delay: 80 },
      { target: 45, delay: 220 },
      { target: 70, delay: 420 },
      { target: 90, delay: 650 },
      { target: 100, delay: 850 },
    ];

    const timeouts = steps.map(({ target, delay }) =>
      setTimeout(() => {
        setProgress(target);
        if (target === 100) {
          setTimeout(() => {
            sessionStorage.setItem('portfolio_preloader_seen', 'true');
            setVisible(false);
          }, 300);
        }
      }, delay)
    );

    return () => {
      timeouts.forEach(clearTimeout);
      document.body.style.overflow = '';
    };
  }, [visible]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = '';
      }}
    >
      {visible && (
        <m.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            },
          }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 select-none overflow-hidden"
          role="status"
          aria-live="polite"
          aria-label="Loading page"
        >
          {/* Centered minimalist brand & progress line matching exact user specification */}
          <div className="flex flex-col items-center justify-center text-center max-w-sm w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground">
              Amir Elrefai
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-2 font-normal tracking-wide">
              AI Engineer &amp; Systems Analyst
            </p>

            {/* Horizontal progress bar */}
            <div className="h-[2px] w-52 sm:w-64 bg-border rounded-full overflow-hidden mt-6">
              <div
                className="h-full bg-foreground rounded-full transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

