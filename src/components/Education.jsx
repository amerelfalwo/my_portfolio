import { useState, useMemo, useEffect, memo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Trophy, ChevronLeft, ChevronRight, X, 
  ExternalLink, ArrowRight, Sparkles 
} from 'lucide-react';
import { useCertificates } from '../hooks/useData';

const Education = memo(() => {
  const { certificates: fetchedCerts, isLoading } = useCertificates();
  const [selectedCert, setSelectedCert] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const certifications = useMemo(() => {
    if (!fetchedCerts || fetchedCerts.length === 0) return [];
    return [...fetchedCerts].sort((a, b) => {
      const isAi = (cert) => {
        const text = `${cert.title || ''} ${cert.issuer || ''} ${cert.description || ''}`.toLowerCase();
        return (
          text.includes('ai') || 
          text.includes('machine learning') || 
          text.includes('deep learning') || 
          text.includes('neural') ||
          text.includes('data science') ||
          text.includes('hcia')
        );
      };
      const aIsAi = isAi(a);
      const bIsAi = isAi(b);
      if (aIsAi && !bIsAi) return -1;
      if (!aIsAi && bIsAi) return 1;
      return new Date(b.date || 0) - new Date(a.date || 0);
    });
  }, [fetchedCerts]);
  const totalCount = certifications.length;

  const cardsPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(totalCount / cardsPerPage));

  // Chunk certifications into pages of 3 cards
  const pages = useMemo(() => {
    if (!certifications || certifications.length === 0) return [];
    const chunks = [];
    for (let i = 0; i < certifications.length; i += cardsPerPage) {
      chunks.push(certifications.slice(i, i + cardsPerPage));
    }
    return chunks;
  }, [certifications]);

  // Ensure valid page on data update
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(0);
    }
  }, [totalPages, currentPage]);

  // Smooth auto-advance rotation (pauses on hover)
  useEffect(() => {
    if (totalPages <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalPages, isHovered]);

  const nextPage = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Helper to convert Google Drive view links to preview links if needed
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com/file/d/')) {
      return url.replace(/\/view.*$/, '/preview');
    }
    return url;
  };

  const getCertImage = (cert) => {
    return cert.imageUrl || cert.verificationUrl || cert.image || '';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      if (typeof dateStr === 'string' && dateStr.includes('T')) {
        return dateStr.split('T')[0];
      }
      return new Date(dateStr).toISOString().split('T')[0];
    } catch {
      return dateStr;
    }
  };

  // Provide a crisp, professional description if missing or too brief
  const getCertDescription = (cert) => {
    if (cert.description && cert.description.trim().length > 15) {
      return cert.description;
    }
    const title = (cert.title || '').toLowerCase();
    const issuer = (cert.issuer || '').toLowerCase();

    if (title.includes('machine learning') || title.includes('data science') || title.includes('depi') || issuer.includes('depi')) {
      return '• Professional certification in AI & Data Science - Microsoft Machine Learning Engineer track from the Digital Egypt Pioneers Program (DEPI / MCIT) in collaboration with Microsoft.';
    }
    if (title.includes('llm') || title.includes('deeplearning') || issuer.includes('deeplearning')) {
      return '• Hands-on operationalization of LLM pipelines, prompt engineering benchmarks, automated fine-tuning evaluation, and continuous deployment.';
    }
    if (title.includes('azure') || title.includes('nlp') || issuer.includes('microsoft')) {
      return '• Specialized in developing enterprise conversational AI, knowledge extraction models, and cognitive natural language processing pipelines on Microsoft Azure.';
    }
    if (title.includes('n8n') || title.includes('agent') || issuer.includes('google')) {
      return '• Designing autonomous multi-step agentic pipelines, tool-calling LLM workflows, and event-driven automation architectures.';
    }
    if (title.includes('huawei') || title.includes('nti') || issuer.includes('huawei')) {
      return '• Completed advanced AI training covering deep neural networks, computer vision algorithms, and high-performance computing clusters with a 99% score.';
    }
    if (title.includes('ccna') || title.includes('network') || title.includes('routing')) {
      return '• Enterprise networking fundamentals, IP subnetting, routing protocols, VLANs, and network security infrastructure.';
    }
    if (cert.issuer) {
      return `• Professional verified certification accredited by ${cert.issuer}, demonstrating production-grade engineering excellence and advanced technical mastery.`;
    }
    return '• Verified technical credential showcasing engineering proficiency, software architecture standards, and specialized AI development.';
  };

  return (
    <section id="education" className="py-20 md:py-28 relative overflow-hidden">
      <div 
        className="max-w-7xl mx-auto px-6 relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ── Section Header (Exact visual match to Screenshot 2) ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <div className="mb-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase">
                <span className="text-cyan-400">Certificates</span>
              </h2>
            </div>
            <p className="text-slate-400 text-sm md:text-base font-normal max-w-xl">
              Explore a showcase of my verified certificates, achievements, and awards.
            </p>
          </div>

          {/* Action button on right */}
          <div className="flex items-center gap-3">
            <a
              href="#education"
              className="px-5 py-2.5 rounded-xl bg-[#1c1033] hover:bg-[#281747] border border-purple-500/40 text-white font-bold text-xs md:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:border-purple-400 transition-all cursor-pointer"
            >
              <span>All Certificates</span>
              <ArrowRight size={15} className="text-purple-300" />
            </a>
          </div>
        </div>

        {/* ── Ultra-Smooth Sliding Track (3 Cards visible at a time) ── */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="h-[440px] rounded-3xl bg-slate-900/40 border border-purple-500/20 p-6 flex flex-col justify-between animate-pulse"
              >
                <div className="w-full h-56 bg-white/5 rounded-2xl" />
                <div className="space-y-3 mt-4 flex-1">
                  <div className="h-6 w-3/4 bg-white/5 rounded-lg" />
                  <div className="h-4 w-full bg-white/5 rounded-lg" />
                  <div className="h-4 w-2/3 bg-white/5 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : totalCount === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-3xl backdrop-blur-xl">
            <Sparkles className="w-10 h-10 text-purple-400/60 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No certificates or achievements available at this time.</p>
          </div>
        ) : (
          <div className="overflow-hidden w-full py-2">
            <div 
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {pages.map((pageItems, pageIdx) => (
                <div 
                  key={pageIdx} 
                  className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7"
                >
                  {pageItems.map((cert, certIdx) => {
                    const certImg = getCertImage(cert);
                    const desc = getCertDescription(cert);

                    return (
                      <div
                        key={cert.id || cert._id || certIdx}
                        onClick={() => setSelectedCert(cert)}
                        className="group relative flex flex-col rounded-3xl bg-[#0c081e] border border-purple-500/30 hover:border-purple-400/80 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-[0_0_35px_rgba(168,85,247,0.3)] h-[440px] md:h-[460px] justify-between cursor-pointer"
                      >
                        {/* Top Certificate Image Preview */}
                        <div className="relative w-full h-56 md:h-60 overflow-hidden bg-slate-950/80 border-b border-purple-500/10 shrink-0">
                          {certImg ? (
                            <img
                              src={getEmbedUrl(certImg)}
                              alt={cert.title}
                              loading="lazy"
                              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-purple-950/30 text-purple-300">
                              <Trophy className="w-12 h-12 opacity-60" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0c081e] via-transparent to-transparent opacity-60 pointer-events-none" />
                        </div>

                        {/* Card Body (Title & Description matching Screenshot 2) */}
                        <div className="p-6 flex flex-col flex-1 justify-between">
                          <div>
                            <h3 className="text-lg md:text-xl font-black text-white line-clamp-1 mb-2 group-hover:text-purple-300 transition-colors">
                              {cert.title}
                            </h3>

                            <p className="text-sm text-slate-300/90 leading-relaxed line-clamp-3 md:line-clamp-4 font-normal">
                              {desc}
                            </p>
                          </div>

                          {/* Prominent Details Button - Only appears on hover */}
                          <div className="pt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCert(cert);
                              }}
                              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs md:text-sm shadow-[0_0_20px_rgba(147,51,234,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Carousel Bottom Controls (Exact match to Screenshot 2, pages based on actual count) ── */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10 md:mt-12">
            {/* Previous Arrow Button */}
            <button
              onClick={prevPage}
              aria-label="Previous Page"
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-purple-950/90 border border-purple-500/50 hover:border-purple-400 hover:bg-purple-900 flex items-center justify-center text-purple-300 hover:text-white transition-all cursor-pointer shadow-md"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Indicator Dots: EXACTLY totalPages count */}
            <div className="flex items-center gap-2 px-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const isActive = currentPage === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive
                        ? 'w-6 h-2 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.85)]'
                        : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                );
              })}
            </div>

            {/* Next Arrow Button */}
            <button
              onClick={nextPage}
              aria-label="Next Page"
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-purple-950/90 border border-purple-500/50 hover:border-purple-400 hover:bg-purple-900 flex items-center justify-center text-purple-300 hover:text-white transition-all cursor-pointer shadow-md"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ── Certificate Modal Lightbox ── */}
      <AnimatePresence>
        {selectedCert && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#030014]/90 backdrop-blur-md"
            onClick={() => setSelectedCert(null)}
          >
            <m.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c081e] border border-purple-500/40 rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-purple-500/20 bg-slate-900/60 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <Trophy className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base md:text-lg leading-tight line-clamp-1">
                      {selectedCert.title}
                    </h3>
                    <p className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mt-0.5">
                      {selectedCert.issuer || selectedCert.institution || 'Authority Record'}
                      {selectedCert.date && ` • ${formatDate(selectedCert.date)}`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedCert(null)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Certificate Image Preview */}
              <div className="flex-1 w-full bg-[#06060e] p-6 flex items-center justify-center overflow-auto">
                <img 
                  src={getEmbedUrl(getCertImage(selectedCert))} 
                  className="max-w-full max-h-[68vh] object-contain rounded-2xl border border-purple-500/20 shadow-2xl"
                  alt={selectedCert.title}
                />
              </div>

              {/* Modal Footer */}
              {selectedCert.verificationUrl && (
                <div className="p-4 bg-slate-900/60 border-t border-purple-500/20 flex items-center justify-end">
                  <a
                    href={selectedCert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.35)] hover:scale-105 transition-all"
                  >
                    <ExternalLink size={14} /> Verify Credential
                  </a>
                </div>
              )}
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
});

Education.displayName = 'Education';
export default Education;
