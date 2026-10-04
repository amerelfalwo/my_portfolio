import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Code, Terminal, Award, Brain, Cpu, Zap, Globe, Layers, Sparkles, Activity, Shield } from 'lucide-react';
import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useSettings } from '../hooks/useData';

const ICON_MAP = { Terminal, Award, Brain, Code, Cpu, Zap, Globe, Layers };

const tween = { type: 'tween', duration: 0.3, ease: 'easeOut' };



/* ═══════════════════════════════════════════
   SMOOTH TYPEWRITER SUBTITLE
   ═══════════════════════════════════════════ */
const TypewriterText = ({ words }) => {
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = words[wordIdx] || 'Computer Vision • Deep Learning • GenAI';
    const speed = deleting ? 35 : 75;
    const pause = text === full ? 2400 : speed;

    const id = setTimeout(() => {
      if (!deleting) {
        setText(full.substring(0, text.length + 1));
        if (text === full) setDeleting(true);
      } else {
        setText(full.substring(0, text.length - 1));
        if (text === '') {
          setDeleting(false);
          setWordIdx((p) => (p + 1) % words.length);
        }
      }
    }, pause);
    return () => clearTimeout(id);
  }, [text, deleting, wordIdx, words]);

  return (
    <span className="inline-flex items-baseline font-mono text-sm md:text-lg tracking-wide text-cyan-300 font-bold">
      <span>{text}</span>
      <span className="w-[3px] h-[1.1em] bg-cyan-400 ml-1 animate-pulse rounded-full inline-block translate-y-[2px] shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
    </span>
  );
};

/* ═══════════════════════════════════════════
   PREMIUM STAT CARD
   ═══════════════════════════════════════════ */
const StatCard = memo(({ stat, index }) => {
  const IconComp = ICON_MAP[stat.iconName] || Terminal;
  const isEven = index % 2 === 0;

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...tween, delay: 0.5 + index * 0.08 }}
      whileHover={{ y: -3, scale: 1.02 }}
      className="group relative flex items-center gap-3.5 p-3.5 md:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className={`shrink-0 p-2.5 rounded-xl border border-white/10 ${isEven ? 'bg-purple-500/10 text-purple-400' : 'bg-cyan-500/10 text-cyan-400'} group-hover:scale-110 transition-transform duration-300`}>
        <IconComp className="w-4 h-4 md:w-5 md:h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs md:text-sm font-black text-white/95 leading-tight truncate tracking-wide">{stat.title}</p>
        <p className="text-[10px] md:text-xs font-mono font-medium text-slate-400 leading-tight mt-0.5 truncate">{stat.description}</p>
      </div>
    </m.div>
  );
});
StatCard.displayName = 'StatCard';

/* ═══════════════════════════════════════════
   MAIN HERO SECTION
   ═══════════════════════════════════════════ */
const Hero = memo(() => {
  const { settings: heroData, isLoading } = useSettings();

  const rawName = useMemo(() => (heroData?.fullName || heroData?.name || 'AMIR ELREFAI').trim().split(' ').filter(Boolean), [heroData?.fullName, heroData?.name]);
  const displayLastName = rawName.length > 1 ? rawName[rawName.length - 1] : '';
  const displayName = rawName.slice(0, rawName.length > 1 ? -1 : 1).join(' ');
  const displayBio = heroData?.bio || 'Building Next-Generation Autonomous AI Agents, Deep Neural Networks, and High-Performance Multimodal Computer Vision Systems.';
  const cvUrl = heroData?.resumeUrl || heroData?.cvUrl || 'https://drive.google.com/file/d/1EwA9JlGdJhmg2H5YR6u9ld8l8jKCfrnd/view?usp=sharing';
  const githubUrl = heroData?.socialLinks?.github || heroData?.githubUrl || '#';
  const profileImage = heroData?.profileImageUrl?.trim() || heroData?.heroImage?.trim() || '';

  const typewriterWords = useMemo(() => {
    if (heroData?.typewriterWords && heroData.typewriterWords.length > 0) {
      return heroData.typewriterWords;
    }
    return [
      'Computer Vision • Deep Learning • GenAI',
      'Neural Networks • Multi-Modal RAG',
      'Autonomous AI Systems & Agents'
    ];
  }, [heroData?.typewriterWords]);

  const stats = useMemo(() => {
    return Array.isArray(heroData?.heroStats) && heroData.heroStats.length > 0
      ? heroData.heroStats
      : [
          { title: '4+ Years Exp', description: 'AI & Machine Learning', iconName: 'Brain' },
          { title: '25+ AI Models', description: 'Production Deployed', iconName: 'Cpu' },
        ];
  }, [heroData?.heroStats]);

  // ── MOUSE PARALLAX CONTROLS ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 90, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 90, damping: 22 });

  const portraitRotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const portraitRotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const portraitTranslateX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const portraitTranslateY = useTransform(smoothY, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    mouseX.set(e.clientX / innerWidth - 0.5);
    mouseY.set(e.clientY / innerHeight - 0.5);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-transparent selection:bg-purple-500/30"
    >

      {/* ── MAIN CONTENT CONTAINER (45% Content / 55% Portrait Grid Split) ── */}
      <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-8 justify-between">

        {/* ── Left Column: 45% Content ── */}
        <m.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-[45%] flex flex-col items-start text-left shrink-0"
        >
          {/* Status HUD Badge */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...tween, delay: 0.15 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-purple-500/30 bg-slate-900/60 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            </span>
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-cyan-300 font-mono">
              {heroData?.heroBadgeText || 'SYSTEM ONLINE :: AI OS v3.0'}
            </span>
          </m.div>

          {/* Focal Typography: AMIR ELREFAI */}
          <m.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...tween, delay: 0.25 }}
            className="text-4xl sm:text-6xl lg:text-[76px] xl:text-[84px] font-black tracking-tight uppercase leading-[0.92] text-white w-full mb-5"
          >
            {isLoading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-14 md:h-20 w-3/4 bg-slate-800/80 rounded-2xl" />
                <div className="h-14 md:h-20 w-1/2 bg-slate-800/60 rounded-2xl" />
              </div>
            ) : (
              <>
                <span className="block text-slate-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  {displayName}
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                  {displayLastName}
                </span>
              </>
            )}
          </m.h1>

          {/* Primary Expertise: AI ENGINEER + Subtitle */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="w-full mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="h-[2px] w-8 bg-gradient-to-r from-purple-500 to-cyan-400" />
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 font-mono">
                AI ENGINEER
              </h2>
            </div>
            
            {/* Typewriter Subtitle */}
            <div className="pl-1 min-h-[32px] flex items-center">
              <TypewriterText words={typewriterWords} />
            </div>
          </m.div>

          {/* Bio */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="w-full max-w-lg mb-8"
          >
            <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">
              {displayBio}
            </p>
          </m.div>

          {/* CTAs with Magnetic Hover Glow */}
          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...tween, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
          >
            <m.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 text-xs md:text-sm shadow-[0_0_25px_rgba(147,51,234,0.35)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                Download CV <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </m.a>

            <m.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-wider border border-slate-700/60 bg-slate-900/40 text-slate-300 hover:text-white hover:border-cyan-400/50 backdrop-blur-xl transition-all flex items-center justify-center gap-3 text-xs md:text-sm hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] cursor-pointer"
            >
              View GitHub <Code size={16} />
            </m.a>
          </m.div>

          {/* Stats Row */}
          <div className="w-full grid grid-cols-2 gap-3.5 max-w-lg">
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} />
            ))}
          </div>
        </m.div>

        {/* ── Right Column: 55% AI Holographic Avatar Portrait ── */}
        <m.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            x: portraitTranslateX,
            y: portraitTranslateY,
            rotateX: portraitRotateX,
            rotateY: portraitRotateY,
          }}
          className="w-full lg:w-[55%] flex items-center justify-center lg:justify-end relative translate-x-0 lg:translate-x-4 my-6 lg:my-0"
        >
          {/* Holographic Avatar Container (Seamless Blended into Background) */}
          <div className="relative w-full max-w-[650px] flex items-center justify-center p-2">
            {profileImage && (
              <m.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full flex items-center justify-center group"
              >
                <m.img
                  src={profileImage}
                  alt={displayName}
                  className="w-full h-auto max-h-[750px] object-cover contrast-[1.08] saturate-[1.1] transition-transform duration-700 group-hover:scale-105"
                  style={{
                    WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 45%, rgba(0, 0, 0, 1) 35%, rgba(0, 0, 0, 0.7) 65%, rgba(0, 0, 0, 0) 98%)',
                    maskImage: 'radial-gradient(ellipse 85% 85% at 50% 45%, rgba(0, 0, 0, 1) 35%, rgba(0, 0, 0, 0.7) 65%, rgba(0, 0, 0, 0) 98%)',
                  }}
                  fetchPriority="high"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </m.div>
            )}
          </div>
        </m.div>

      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;