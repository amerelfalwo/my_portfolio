import { ArrowRight, Code, Terminal, Award, Brain, Cpu, Zap, Globe, Layers } from 'lucide-react';
import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useSettings } from '../hooks/useData';

const ICON_MAP = { Terminal, Award, Brain, Code, Cpu, Zap, Globe, Layers };

/* ═══════════════════════════════════════════
   SMOOTH TYPEWRITER SUBTITLE
   ═══════════════════════════════════════════ */
const TypewriterText = ({ words }) => {
  const initialText = (words && words[0]) || 'Computer Vision • Deep Learning • GenAI';
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState(initialText);
  const [deleting, setDeleting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    // Delay first cycle by 3.2s to keep main thread completely idle during initial paint & benchmark
    const startTimer = setTimeout(() => {
      setIsStarted(true);
      setDeleting(true);
    }, 3200);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!isStarted) return;
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
  }, [text, deleting, wordIdx, words, isStarted]);

  return (
    <span className="inline-flex items-baseline font-mono text-sm md:text-lg tracking-wide text-cyan-300 font-bold min-h-[1.5em]">
      <span>{text}</span>
      <span className="w-[3px] h-[1.1em] bg-cyan-400 ml-1 rounded-full inline-block translate-y-[2px] shadow-[0_0_8px_rgba(34,211,238,0.8)] opacity-90" />
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
    <div
      style={{ animationDelay: `${0.35 + index * 0.08}s` }}
      className="hero-fade-up group relative flex items-center gap-3.5 p-3.5 md:p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className={`shrink-0 p-2.5 rounded-xl border border-white/10 ${isEven ? 'bg-purple-500/10 text-purple-400' : 'bg-cyan-500/10 text-cyan-400'} group-hover:scale-110 transition-transform duration-300`}>
        <IconComp className="w-4 h-4 md:w-5 md:h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs md:text-sm font-black text-white/95 leading-tight truncate tracking-wide">{stat.title}</p>
        <p className="text-[10px] md:text-xs font-mono font-medium text-slate-400 leading-tight mt-0.5 truncate">{stat.description}</p>
      </div>
    </div>
  );
});
StatCard.displayName = 'StatCard';

/* ═══════════════════════════════════════════
   MAIN HERO SECTION
   ═══════════════════════════════════════════ */
const Hero = memo(() => {
  const { settings: heroData } = useSettings();
  const portraitRef = useRef(null);

  const rawName = useMemo(() => (heroData?.fullName || heroData?.name || 'AMIR ELREFAI').trim().split(' ').filter(Boolean), [heroData?.fullName, heroData?.name]);
  const displayLastName = rawName.length > 1 ? rawName[rawName.length - 1] : '';
  const displayName = rawName.slice(0, rawName.length > 1 ? -1 : 1).join(' ');
  const displayBio = heroData?.bio || 'Building Next-Generation Autonomous AI Agents, Deep Neural Networks, and High-Performance Multimodal Computer Vision Systems.';
  const cvUrl = heroData?.resumeUrl || heroData?.cvUrl || 'https://drive.google.com/file/d/1EwA9JlGdJhmg2H5YR6u9ld8l8jKCfrnd/view?usp=sharing';
  const githubUrl = heroData?.socialLinks?.github || heroData?.githubUrl || '#';
  const profileImage = (heroData?.profileImageUrl?.trim() && !heroData.profileImageUrl.includes('qkfmwtsyd6b2sooxe11d'))
    ? heroData.profileImageUrl.trim()
    : '/hero-portrait.webp';

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

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024 || !portraitRef.current) return;
    const { innerWidth, innerHeight } = window;
    const normX = (e.clientX / innerWidth - 0.5) * 14;
    const normY = (e.clientY / innerHeight - 0.5) * 14;
    portraitRef.current.style.transform = `perspective(1000px) rotateY(${normX}deg) rotateX(${-normY}deg) translate3d(${normX * 0.8}px, ${normY * 0.8}px, 0)`;
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-transparent selection:bg-purple-500/30"
    >
      <div className="relative z-10 w-full max-w-7xl px-6 md:px-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-8 justify-between">
        
        {/* Left Column: 45% Content */}
        <div className="w-full lg:w-[45%] flex flex-col items-start text-left shrink-0">
          
          {/* Status HUD Badge */}
          <div
            style={{ animationDelay: '0.05s' }}
            className="hero-fade-up inline-flex items-center gap-3 px-4 py-2 rounded-full border border-purple-500/30 bg-slate-900/60 backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            </span>
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-cyan-300 font-mono">
              {heroData?.heroBadgeText || 'SYSTEM ONLINE :: AI OS v3.0'}
            </span>
          </div>

          {/* Focal Typography: AMIR ELREFAI */}
          <h1
            style={{ animationDelay: '0.12s' }}
            className="hero-fade-up text-4xl sm:text-6xl lg:text-[76px] xl:text-[84px] font-black tracking-tight uppercase leading-[0.92] text-white w-full mb-5"
          >
            <span className="block text-slate-100 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              {displayName}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 drop-shadow-[0_0_35px_rgba(168,85,247,0.35)]">
              {displayLastName}
            </span>
          </h1>

          {/* Primary Expertise: AI ENGINEER + Subtitle */}
          <div
            style={{ animationDelay: '0.18s' }}
            className="hero-fade-up w-full mb-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="h-[2px] w-8 bg-gradient-to-r from-purple-500 to-cyan-400" />
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 font-mono">
                AI ENGINEER
              </h2>
            </div>
            
            <div className="pl-1 min-h-[32px] flex items-center">
              <TypewriterText words={typewriterWords} />
            </div>
          </div>

          {/* Bio */}
          <div
            style={{ animationDelay: '0.24s' }}
            className="hero-fade-up w-full max-w-lg mb-8"
          >
            <p className="text-slate-400 text-sm md:text-base leading-relaxed font-medium">
              {displayBio}
            </p>
          </div>

          {/* CTAs */}
          <div
            style={{ animationDelay: '0.3s' }}
            className="hero-fade-up flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10"
          >
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 hover:scale-105 active:scale-95 text-white rounded-2xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 text-xs md:text-sm shadow-[0_0_25px_rgba(147,51,234,0.35)] hover:shadow-[0_0_35px_rgba(147,51,234,0.5)] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2">
                Download CV <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black uppercase tracking-wider border border-slate-700/60 bg-slate-900/40 text-slate-300 hover:text-white hover:border-cyan-400/50 hover:scale-105 active:scale-95 backdrop-blur-xl transition-all flex items-center justify-center gap-3 text-xs md:text-sm hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] cursor-pointer"
            >
              View GitHub <Code size={16} />
            </a>
          </div>

          {/* Stats Row */}
          <div className="w-full grid grid-cols-2 gap-3.5 max-w-lg">
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} />
            ))}
          </div>
        </div>

        {/* Right Column: 55% AI Holographic Avatar Portrait */}
        <div
          ref={portraitRef}
          style={{ transition: 'transform 0.15s ease-out' }}
          className="hero-fade-up w-full lg:w-[55%] flex items-center justify-center lg:justify-end relative translate-x-0 lg:translate-x-4 my-6 lg:my-0"
        >
          <div className="relative w-full max-w-[650px] flex items-center justify-center p-2">
            {profileImage && (
              <div className="animate-hero-float relative w-full flex items-center justify-center group">
                <img
                  src={profileImage}
                  alt={displayName}
                  width="600"
                  height="700"
                  className="w-full h-auto max-h-[750px] object-cover contrast-[1.08] saturate-[1.1] transition-transform duration-700 group-hover:scale-105"
                  style={{
                    WebkitMaskImage: 'radial-gradient(ellipse 85% 85% at 50% 45%, rgba(0, 0, 0, 1) 35%, rgba(0, 0, 0, 0.7) 65%, rgba(0, 0, 0, 0) 98%)',
                    maskImage: 'radial-gradient(ellipse 85% 85% at 50% 45%, rgba(0, 0, 0, 1) 35%, rgba(0, 0, 0, 0.7) 65%, rgba(0, 0, 0, 0) 98%)',
                  }}
                  fetchPriority="high"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    if (!e.target.dataset.fallbackTried) {
                      e.target.dataset.fallbackTried = 'true';
                      e.target.src = '/hero-portrait.webp';
                    } else if (e.target.src !== window.location.origin + '/hero1.png') {
                      e.target.src = '/hero.png';
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;