import { useRef, useEffect, memo } from 'react';

/* ═══════════════════════════════════════════
   GLOBAL PARTICLES CANVAS (Ultra-Lightweight GPU Glow)
   ═══════════════════════════════════════════ */
const GlobalParticlesCanvas = memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect user's motion preferences
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const count = isMobile ? 12 : 32;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.4 + 0.2,
      color: Math.random() > 0.5 ? '168, 85, 247' : '34, 211, 238',
    }));

    let animId;
    let isRunning = true;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < count; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        // Single optimized drawing pass with subtle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.7})`;
        ctx.fill();
      }

      if (isRunning) {
        animId = requestAnimationFrame(render);
      }
    };

    // Defer animation start slightly until browser completes critical initial paint & hydration
    const startTimer = setTimeout(() => {
      animId = requestAnimationFrame(render);
    }, 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animId);
      } else if (!isRunning) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isRunning = false;
      clearTimeout(startTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-75" style={{ willChange: 'transform' }} />;
});

GlobalParticlesCanvas.displayName = 'GlobalParticlesCanvas';

/* ═══════════════════════════════════════════
   GLOBAL BACKGROUND — Dark Cyberpunk Grid & Particles
   Unified ambient glow across entire portfolio
   (Zero section clipping, completely seamless)
   ═══════════════════════════════════════════ */
const GlobalBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-[#05050b]">
      {/* ── UNIFIED AMBIENT GLOW (Fixed, never clipped by section boundaries) ── */}
      <div className="absolute top-1/4 -left-40 w-[650px] h-[650px] bg-purple-600/[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 -right-40 w-[650px] h-[650px] bg-cyan-600/[0.08] rounded-full blur-[160px] pointer-events-none" />

      {/* ── SEAMLESS CYBERPUNK GRID ── */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(168,85,247,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34,211,238,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Particle Canvas Overlay */}
      <GlobalParticlesCanvas />
    </div>
  );
};

export default GlobalBackground;
