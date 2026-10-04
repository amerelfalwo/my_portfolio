import { useState, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, ExternalLink, Github, CheckCircle2 
} from 'lucide-react';
import { getToolIconUrl } from '../utils/getToolIcon';

const skillIcons = {
  "PyTorch": "/icons/pytorch.svg",
  "TensorFlow": "/icons/tensorflow.svg",
  "OpenCV": "/icons/opencv.svg",
  "YOLO v11": "/icons/yolo.svg",
  "Python": "/icons/python.svg",
  "MediaPipe": "/icons/mediapipe.svg",
  "C++": "/icons/cplusplus.svg",
  "Docker": "/icons/docker.svg",
  "React": "/icons/react.svg",
  "FastAPI": "/icons/fastapi.svg",
  "NumPy": "/icons/python.svg",
  "Pandas": "/icons/python.svg",
  "Firebase": "/icons/fastapi.svg",
};

/**
 * Calculates the shortest distance between two indices in a circular array
 */
const getOffset = (index, currentIndex, total) => {
  let diff = index - currentIndex;
  const half = Math.floor(total / 2);
  
  // Wrap around
  if (diff > half) diff -= total;
  if (diff < -half) diff += total;
  
  return diff;
};

const ProjectCube = ({ projects, category, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useCallback((direction) => {
    setCurrentIndex((prev) => {
      let next = prev + direction;
      if (next < 0) next = projects.length - 1;
      if (next >= projects.length) next = 0;
      return next;
    });
  }, [projects.length]);

  if (!projects || projects.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans">
      {/* Backdrop */}
      <m.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-[#030014]/90 md:backdrop-blur-md"
      />

      {/* Main Container - establishes 3D perspective */}
      <div 
        className="relative w-full max-w-[100vw] h-[85vh] sm:h-[80vh] flex items-center justify-center" 
        style={{ perspective: "1500px" }}
      >
        
        {/* Navigation & Header Layer */}
        <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-4 pointer-events-none max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-black uppercase tracking-widest text-sm md:text-base bg-slate-900/60 md:backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-700/50">
              {category}
            </h2>
            <div className="text-white bg-slate-900/40 md:backdrop-blur-md px-3 py-1 rounded-full text-sm font-mono font-bold border border-slate-700/50">
              {currentIndex + 1} / {projects.length}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/50 md:backdrop-blur-md text-white transition-colors pointer-events-auto shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* 3D Coverflow Wrapper */}
        <div className="relative w-full h-full pt-16 pb-20 sm:pb-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
          
          {projects.map((project, index) => {
             const offset = getOffset(index, currentIndex, projects.length);
             const isCenter = offset === 0;
             // Only render items that are somewhat visible to save performance
             const isVisible = Math.abs(offset) <= 2;

             if (!isVisible) return null;

             const rotateY = offset * -35; 
             const z = Math.abs(offset) * -400;
             const x = `${offset * 75}%`; 
             const opacity = isCenter ? 1 : Math.max(0, 0.7 - Math.abs(offset) * 0.2);
             const scale = 1 - Math.abs(offset) * 0.05;

             return (
               <m.div
                 key={project.id || index}
                 initial={false}
                 animate={{
                   rotateY,
                   z,
                   x,
                   scale,
                   opacity,
                 }}
                 transition={{ 
                   type: "tween", 
                   duration: 0.35,
                   ease: "easeOut"
                 }}
                 style={{
                   position: "absolute",
                   width: "100%",
                   maxWidth: "900px",
                   height: "100%",
                   transformStyle: "preserve-3d",
                   zIndex: 50 - Math.abs(offset),
                   willChange: 'transform, opacity',
                 }}
                 className="flex items-center justify-center"
               >
                 {/* Card Face */}
                 <div 
                   className={`relative w-full h-full bg-slate-900/80 md:bg-slate-900/40 md:backdrop-blur-xl border border-slate-700/50 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl transition-colors duration-300 ${!isCenter ? 'hover:border-purple-500/40 cursor-pointer' : 'shadow-[0_0_40px_rgba(168,85,247,0.15)] border-purple-500/50'}`}
                   onClick={() => {
                     if (!isCenter) navigate(offset);
                   }}
                 >
                   {/* Invisible overlay for background cards to catch clicks and prevent interaction with inside buttons */}
                   {!isCenter && <div className="absolute inset-0 z-50" />}

                   {/* Image Section */}
                   <div className="relative w-full h-[40%] md:h-[45%] shrink-0 overflow-hidden bg-slate-950 flex items-center justify-center border-b border-slate-700/50">
                     <img 
                       src={project.imageUrl || project.image || '/api/placeholder/800/600'} 
                       alt={project.title}
                       className="w-full h-full object-contain transition-transform duration-1000 hover:scale-105"
                     />
                     
                     {/* Tech Tags Overlay */}
                     <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                       {(project.tags || project.techStack || []).map((tag) => {
                         const iconUrl = skillIcons[tag] || getToolIconUrl(tag);
                         return (
                           <span key={tag} className="px-3 py-1.5 rounded-lg bg-slate-900/80 md:backdrop-blur-md border border-slate-700/50 text-[10px] font-bold text-white tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                             {iconUrl && (
                               <img src={iconUrl} alt={tag} className="w-3.5 h-3.5 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                             )}
                             {tag}
                           </span>
                         );
                       })}
                     </div>
                   </div>

                   {/* Content Section */}
                   <div className="flex-1 flex flex-col p-6 sm:p-10 lg:p-12 overflow-y-auto custom-scrollbar bg-slate-900/20">
                     <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 group-hover:text-purple-400 transition-colors">
                       {project.title}
                     </h3>
                     
                     <p className="text-muted text-base md:text-lg leading-relaxed mb-8 font-medium">
                       {project.fullDescription || project.description}
                     </p>

                     {/* Highlights / Key Results */}
                     {project.highlights && project.highlights.length > 0 && (
                       <div className="mb-10 space-y-3">
                         <h4 className="text-xs font-black tracking-[0.2em] uppercase text-purple-400 mb-4">Key Results</h4>
                         {project.highlights.map((item, idx) => (
                           <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-purple-500/30 transition-colors">
                             <CheckCircle2 size={18} className="text-purple-400 shrink-0 mt-0.5" />
                             <span className="text-sm text-white/80 leading-relaxed font-medium">{item}</span>
                           </div>
                         ))}
                       </div>
                     )}

                     {/* Actions */}
                     <div className="mt-auto pt-8 border-t border-slate-700/50 flex flex-wrap gap-4">
                       {project.link && (
                         <a 
                           href={project.link} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#7c3aed] hover:bg-white hover:text-[#7c3aed] text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-[#7c3aed]/20 transition-all pointer-events-auto"
                         >
                           Launch Project <ExternalLink size={16} />
                         </a>
                       )}
                       {project.github && (
                         <a 
                           href={project.github} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-transparent border border-slate-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all pointer-events-auto"
                         >
                           <Github size={16} /> Source Code
                         </a>
                       )}
                     </div>
                   </div>

                 </div>
               </m.div>
             );
          })}
        </div>

        {/* Navigation Buttons */}
        {projects.length > 1 && (
          <>
            <button 
              onClick={() => navigate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-slate-900/60 hover:bg-purple-600 border border-slate-700/50 text-white shadow-md transition-colors md:backdrop-blur-md hidden sm:block"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => navigate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-slate-900/60 hover:bg-purple-600 border border-slate-700/50 text-white shadow-md transition-colors md:backdrop-blur-md hidden sm:block"
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Mobile Nav Indicators */}
            <div className="absolute bottom-6 left-0 right-0 z-50 flex justify-center gap-6 sm:hidden pointer-events-none">
               <button onClick={() => navigate(-1)} className="pointer-events-auto p-4 rounded-full bg-slate-900/80 shadow-md text-white border border-slate-700/50"><ChevronLeft size={20} /></button>
               <button onClick={() => navigate(1)} className="pointer-events-auto p-4 rounded-full bg-slate-900/80 shadow-md text-white border border-slate-700/50"><ChevronRight size={20} /></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectCube;
