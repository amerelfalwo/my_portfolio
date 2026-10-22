import { memo } from 'react';

/**
 * GlobalBackground — Minimal light monochrome backdrop (#F8F8F8).
 * Stripped of dark matrix grids, glowing particle canvases, and neon blur blobs.
 */
const GlobalBackground = memo(() => {
  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none bg-background transition-colors duration-300" 
      aria-hidden="true" 
    />
  );
});

GlobalBackground.displayName = 'GlobalBackground';

export default GlobalBackground;
