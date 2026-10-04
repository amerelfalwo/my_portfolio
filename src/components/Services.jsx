import { useState, useEffect, memo } from 'react';
import { getServices } from '../api';
import { m, useMotionTemplate, useMotionValue } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const tween = { type: 'tween', duration: 0.3, ease: 'easeOut' };

const ServiceCard = memo(({ service, index }) => {
  const IconComponent = LucideIcons[service.iconName] || LucideIcons[service.icon_name] || LucideIcons[service.icon] || LucideIcons.Code;
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Alternate neon colors for icons and spotlights
  const colors = [
    { accent: 'rgba(168, 85, 247, 0.15)', shadow: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]', icon: 'group-hover:text-purple-400', border: 'group-hover:border-purple-500/50' },
    { accent: 'rgba(34, 211, 238, 0.15)', shadow: 'drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]', icon: 'group-hover:text-cyan-400', border: 'group-hover:border-cyan-500/50' },
    { accent: 'rgba(59, 130, 246, 0.15)', shadow: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]', icon: 'group-hover:text-blue-400', border: 'group-hover:border-blue-500/50' },
    { accent: 'rgba(236, 72, 153, 0.15)', shadow: 'drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]', icon: 'group-hover:text-pink-400', border: 'group-hover:border-pink-500/50' }
  ];
  const theme = colors[index % colors.length];

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '80px' }}
      transition={{ ...tween, delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0)' }}
      className={`group relative flex flex-col p-8 md:p-10 rounded-3xl bg-slate-900/80 md:bg-slate-900/40 border border-slate-700/50 md:backdrop-blur-md transition-colors duration-300 overflow-hidden cursor-default ${theme.border}`}
    >
      {/* Spotlight overlay */}
      <m.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${theme.accent},
              transparent 80%
            )
          `,
        }}
      />

      {/* Icon container */}
      <div className={`mb-8 p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl w-fit transition-all duration-500 z-10 relative overflow-hidden group-hover:bg-slate-800/80 ${theme.shadow}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
        <IconComponent size={32} className={`text-slate-400 ${theme.icon} transition-colors duration-500 relative z-10`} />
      </div>

      <div className="z-10 mt-auto relative">
        <h3 className="text-xl font-black mb-3 uppercase tracking-tight text-white/90 leading-tight group-hover:text-white transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-colors duration-300">
          {service.description}
        </p>
      </div>
    </m.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

const Services = memo(() => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices() || [];
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <m.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '80px' }}
          transition={tween}
          className="mb-20 md:mb-24 text-center"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-[-0.03em] mb-5 text-white">
            Core{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400">
              Services
            </span>
          </h2>
          <p className="text-white/35 font-medium max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            Delivering high-performance architectural solutions and specialized engineering to elevate product realities.
          </p>
        </m.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-[3px] border-purple-500/20 border-t-purple-400 rounded-full animate-spin" />
            <p className="text-white/30 tracking-[0.3em] uppercase text-[10px] font-bold font-mono">Loading Services</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, index) => (
              <ServiceCard key={service.id || index} service={service} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

export default Services;
