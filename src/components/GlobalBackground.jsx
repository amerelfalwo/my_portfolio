import { useRef, useEffect, memo } from 'react';

/* ═══════════════════════════════════════════
   GLOBAL PARTICLES CANVAS (GPU-Optimized)
   ═══════════════════════════════════════════ */
const GlobalParticlesCanvas = memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const count = 70;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.6 + 0.25,
      color: Math.random() > 0.5 ? 'rgba(168, 85, 247,' : 'rgba(34, 211, 238,',
    }));

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.shadowColor = p.color + ' 0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-75" />;
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
