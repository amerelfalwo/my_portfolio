import { useEffect, useState, memo } from 'react';
import { m } from 'framer-motion';
import { 
  Brain, Code, Wifi, Settings, Briefcase, Eye, Database, 
  Clock, Calendar, CheckCircle2, Sparkles, Terminal
} from 'lucide-react';
import { getTrainings } from '../api';

const tween = { type: 'tween', duration: 0.4, ease: 'easeOut' };

const ProfessionalDevelopment = memo(() => {
  const [trainings, setTrainings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const data = await getTrainings();
        setTrainings(data.reverse());
      } catch (error) {
        console.error("Error fetching trainings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  const getTrainingIcon = (title, provider) => {
    const t = (title + " " + provider).toLowerCase();
    const iconClass = "w-5 h-5 text-cyan-400 group-hover:text-purple-300 transition-colors";
    
    if (t.includes('vision') || t.includes('image')) return <Eye className={iconClass} />;
    if (t.includes('data')) return <Database className={iconClass} />;
    if (t.includes('ai') || t.includes('machine learning') || t.includes('deep learning')) return <Brain className={iconClass} />;
    if (t.includes('web') || t.includes('frontend') || t.includes('backend') || t.includes('react')) return <Code className={iconClass} />;
    if (t.includes('network') || t.includes('ccna') || t.includes('dey')) return <Wifi className={iconClass} />;
    return <Settings className={iconClass} />;
  };

  return (
    <section 
      id="professional-development" 
      className="py-28 md:py-36 relative overflow-hidden selection:bg-purple-500/30"
    >
      {/* Seamless Ambient Lighting Decor (Blends with Global Grid) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 -right-32 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 md:mb-28">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...tween, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-5"
          >
            Training &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400">
              Experience
            </span>
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ ...tween, delay: 0.2 }}
            className="text-white/40 font-medium max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
          >
            A connected chronological timeline of specialized AI tracks, technical bootcamps, and engineering programs.
          </m.p>
        </div>

        {/* Sequential Timeline Showcase */}
        {isLoading ? (
          <div className="flex justify-center py-24 flex-col items-center gap-4 w-full">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-400 rounded-full animate-spin" />
            <p className="text-white/40 tracking-[0.3em] uppercase text-xs font-mono font-bold animate-pulse">
              FETCHING TRAINING SEQUENCE...
            </p>
          </div>
        ) : trainings.length === 0 ? (
          <div className="text-center text-white/40 font-medium py-16 bg-slate-900/30 border border-slate-800/60 rounded-3xl backdrop-blur-md max-w-2xl mx-auto">
            <Sparkles className="w-8 h-8 text-purple-400/50 mx-auto mb-3" />
            No training sequence data available at the moment.
          </div>
        ) : (
          <div className="relative">
            {/* Glowing Vertical Pipeline Track (Desktop & Mobile) */}
            <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-purple-500/0 via-purple-500/40 via-cyan-500/40 to-purple-500/0 pointer-events-none" />

            <div className="space-y-12 md:space-y-16">
              {trainings.map((tr, index) => {
                const isEven = index % 2 === 0;

                return (
                  <m.div
                    key={tr.id || index}
                    initial={{ opacity: 0, x: isEven ? -40 : 40, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Content Card Side */}
                    <div className="w-full md:w-[calc(50%-3rem)] pl-14 md:pl-0">
                      <div className="group relative bg-slate-900/40 hover:bg-slate-900/65 border border-slate-800/80 hover:border-purple-500/40 rounded-3xl p-6 md:p-8 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_45px_rgba(168,85,247,0.18)] overflow-hidden">
                        {/* Top Gradient Border Accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Card Header Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            {tr.isCompleted ? (
                              <div className="flex items-center gap-1.5 px-3 py-1 text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] uppercase font-black tracking-widest backdrop-blur-md">
                                <CheckCircle2 size={12} className="text-emerald-400" /> COMPLETED
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 px-3 py-1 text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] uppercase font-black tracking-widest backdrop-blur-md">
                                <Clock size={12} className="text-cyan-400 animate-spin" /> ONGOING
                              </div>
                            )}
                            {tr.duration && (
                              <div className="flex items-center gap-1.5 px-3 py-1 text-white/50 bg-white/[0.04] border border-white/10 rounded-full text-[10px] uppercase font-mono font-bold tracking-widest">
                                <Calendar size={11} className="text-purple-400" /> {tr.duration}
                              </div>
                            )}
                          </div>

                          <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                            STEP {String(index + 1).padStart(2, '0')}
                          </div>
                        </div>

                        {/* Title & Provider */}
                        <div className="space-y-1.5 mb-4">
                          <h3 className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-purple-300 transition-colors leading-snug">
                            {tr.title}
                          </h3>
                          <p className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-cyan-400/90 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block animate-pulse" />
                            {tr.provider}
                          </p>
                        </div>

                        {/* Description (Full text visible on scroll) */}
                        {tr.description && (
                          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium bg-slate-950/40 border border-slate-800/60 p-4 rounded-2xl group-hover:border-purple-500/20 transition-colors">
                            {tr.description}
                          </p>
                        )}

                        {/* Card Footer Tag */}
                        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono tracking-widest uppercase font-bold">
                          <div className="flex items-center gap-2">
                            <Terminal size={12} className="text-purple-400/60" />
                            <span>TRACK NODE</span>
                          </div>
                          <span>REC-ID: {tr.id ? tr.id.slice(-6).toUpperCase() : 'VERIFIED'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Central Glowing Connector Node */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                      <div className="relative group/node flex items-center justify-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#080816] border border-purple-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.3)] group-hover/node:scale-110 group-hover/node:border-cyan-400 transition-all duration-300">
                          {getTrainingIcon(tr.title, tr.provider)}
                        </div>
                        {/* Outer Glow Pulse Ring */}
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-sm -z-10 group-hover/node:blur-md transition-all" />
                      </div>
                    </div>

                    {/* Empty Opposite Side for Balanced Layout on Desktop */}
                    <div className="hidden md:block w-[calc(50%-3rem)]" />
                  </m.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

export default ProfessionalDevelopment;
