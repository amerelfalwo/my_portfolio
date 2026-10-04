import { m } from 'framer-motion';
import { User, Terminal, Cpu, Database, Server, Code, Sparkles, Brain } from 'lucide-react';
import { memo } from 'react';
import { useSettings, useAboutConfig } from '../hooks/useData';

const tween = { type: 'tween', duration: 0.6, ease: 'easeOut' };

const STACK = [
  { name: 'Architecture', icon: Server, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { name: 'AI Models', icon: Brain, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { name: 'Processing', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { name: 'Full-Stack', icon: Code, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

const About = memo(() => {
  const { settings } = useSettings();
  const { aboutConfig } = useAboutConfig();

  const title = aboutConfig?.title || 'The Architect';
  const subtitle = aboutConfig?.subtitle || 'I build high-performance systems, intelligent AI architectures, and seamless digital experiences that scale.';
  const paragraph1 = aboutConfig?.paragraph1 || 'As a versatile Software Engineer & AI Specialist, my core objective is to bridge the gap between complex neural architectures and highly polished, user-centric interfaces.';
  const paragraph2 = aboutConfig?.paragraph2 || "My expertise spans across deep learning, generative AI, systems engineering, and modern full-stack frameworks. I don't just write code; I architect solutions that are robust, scalable, and visually exceptional.";
  const quote = aboutConfig?.quote || '"Efficiency is doing things right; effectiveness is doing the right things."';
  const yearsExp = aboutConfig?.yearsExp || '5+';
  const deployments = aboutConfig?.deployments || '50+';
  const availability = aboutConfig?.availability || 'Available for new opportunities';
  const workTypes = aboutConfig?.workTypes || 'REMOTE / ONSITE / RELOCATION';

  return (
    <section id="about" className="relative py-32 overflow-hidden selection:bg-cyan-500/30">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-24 text-center">
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ ...tween, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase mb-6"
          >
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{title}</span>
          </m.h2>

          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ ...tween, delay: 0.2 }}
            className="text-slate-400 max-w-2xl text-lg leading-relaxed"
          >
            {subtitle}
          </m.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Identity Card */}
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ ...tween, delay: 0.3 }}
            className="relative p-[1px] rounded-[2rem] bg-gradient-to-b from-slate-700/50 to-slate-800/20"
          >
            <div className="relative bg-slate-950/80 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Terminal size={180} />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-6 font-mono tracking-tight flex items-center gap-3">
                <Sparkles className="text-purple-400" size={24} /> 
                System.Identity
              </h3>
              
              <div className="space-y-6 text-slate-300 leading-relaxed font-medium">
                <p>{paragraph1}</p>
                <p>{paragraph2}</p>
                {quote && (
                  <p className="text-cyan-400/90 italic font-mono text-sm border-l-2 border-cyan-500/50 pl-4 py-1">
                    {quote}
                  </p>
                )}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
                  <div className="text-3xl font-black text-white mb-1">{yearsExp}</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Years Exp.</div>
                </div>
                <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800/50">
                  <div className="text-3xl font-black text-white mb-1">{deployments}</div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Deployments</div>
                </div>
              </div>
            </div>
          </m.div>

          {/* Right: Core Domains */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STACK.map((item, idx) => {
              const Icon = item.icon;
              return (
                <m.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ ...tween, delay: 0.4 + idx * 0.1 }}
                  className="group relative bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 hover:bg-slate-800/40 transition-colors duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={item.color} size={22} />
                  </div>
                  <h4 className="text-lg font-bold text-slate-200 mb-2">{item.name}</h4>
                  <div className="w-8 h-1 bg-slate-800 rounded-full group-hover:bg-slate-600 transition-colors duration-300" />
                </m.div>
              );
            })}

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ ...tween, delay: 0.8 }}
              className="sm:col-span-2 relative p-[1px] rounded-3xl bg-gradient-to-r from-cyan-500/30 to-purple-500/30 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-slate-950/80 backdrop-blur-md rounded-3xl p-6 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold mb-1">{availability}</h4>
                  <p className="text-xs text-slate-400 font-mono">{workTypes}</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse" />
              </div>
            </m.div>
          </div>

        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';
export default About;
