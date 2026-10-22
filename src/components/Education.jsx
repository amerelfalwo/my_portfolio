import { useState, useMemo, memo } from 'react';
import { X, Award, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCertificates } from '../hooks/useData';
import { certifications as fallbackCertifications } from '../data/certifications';

const Education = memo(() => {
  const { certificates: fetchedCerts } = useCertificates();
  const [selectedCert, setSelectedCert] = useState(null);

  const certifications = useMemo(() => {
    if (fetchedCerts && fetchedCerts.length > 0) {
      return [...fetchedCerts].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    }
    return fallbackCertifications;
  }, [fetchedCerts]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="education" className="py-24 sm:py-32 relative bg-transparent border-t border-border/60">
      <div className="page-container">
        
        {/* Section Header Centered per Pattern: "● Certificates" pill + "Latest Credentials" */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-border text-xs font-medium text-foreground tracking-wide mb-4 bg-surface">
            <span className="text-[7px] text-foreground" aria-hidden="true">●</span>
            <span>Certificates</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground leading-[1.12]">
            Latest Credentials
          </h2>

          <p className="text-muted text-sm sm:text-base font-normal leading-relaxed mt-4 max-w-xl mx-auto">
            Accredited industry certifications, advanced machine learning tracks, and verified technical achievements.
          </p>
        </div>

        {/* 3-Column Aspect-[4/3] Grid Matching Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {certifications.map((cert) => {
            const imgSrc = cert.imageUrl || cert.image;

            return (
              <div
                key={cert.id || cert.title}
                onClick={() => setSelectedCert(cert)}
                className="group flex flex-col text-start cursor-pointer"
              >
                {/* 4/3 Aspect Ratio Card with Hover Dark Circle & Arrow */}
                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-border bg-surface-muted transition-colors">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={cert.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    /* Minimalist editorial certificate plaque */
                    <div className="w-full h-full p-6 sm:p-7 flex flex-col justify-between bg-surface transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-surface-muted border border-border text-foreground">
                          <Award className="w-3 h-3 text-foreground" />
                          <span>{cert.badge || 'Verified'}</span>
                        </span>
                        <span className="text-xs text-muted font-medium">{cert.year || formatDate(cert.date)}</span>
                      </div>

                      <div className="my-auto">
                        <h3 className="text-base sm:text-lg font-medium text-foreground tracking-tight leading-snug line-clamp-3">
                          {cert.title}
                        </h3>
                        <p className="text-xs text-muted mt-2 line-clamp-2 font-normal">
                          {cert.description || cert.issuer}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted pt-3 border-t border-border/50">
                        <span className="font-medium text-foreground/85 truncate max-w-[180px]">{cert.issuerShort || cert.issuer}</span>
                        <span className="text-[11px] text-muted flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />
                          <span>Accredited</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay: Dark Translucent Tint with Center Circle Arrow & Bottom Meta */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 bg-foreground/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div />
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-foreground text-surface flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <span className="inline-block rtl:-scale-x-100 text-lg leading-none" aria-hidden="true">↗</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-surface font-medium">
                      <span>Verified Certificate</span>
                      <span>View details ↗</span>
                    </div>
                  </div>
                </div>

                {/* Caption Below the Card Matching Projects Layout */}
                <div className="mt-3.5 flex items-baseline justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-medium text-foreground tracking-tight group-hover:text-muted transition-colors line-clamp-1">
                    {cert.title}
                  </h3>

                  <span className="text-xs text-muted font-normal shrink-0">
                    {cert.issuerShort || cert.issuer}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Academic Degree Section */}
        <div className="mt-16 pt-12 border-t border-border/60 text-start">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted tracking-wide mb-3">
            <span className="text-[8px] text-foreground" aria-hidden="true">●</span>
            <span>Academic Background</span>
          </div>

          <div className="bg-surface rounded-lg border border-border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface-muted text-foreground mb-3">
                <span>Very Good Honors</span>
                <span className="text-muted">•</span>
                <span>2022 — 2026</span>
              </div>

              <h3 className="text-lg sm:text-xl font-medium text-foreground tracking-tight">
                Bachelor of Science in Computer and Information Sciences
              </h3>
              
              <p className="text-xs sm:text-sm text-muted mt-1 font-normal">
                Mansoura University • Information Technology (IT) Major
              </p>

              <p className="text-xs text-muted/80 mt-3 font-normal max-w-2xl leading-relaxed">
                <span className="font-medium text-foreground">Capstone:</span> ThyraX — Thyroid Cancer Clinical Decision Support System (Biomedical Deep Learning &amp; Multimodal AI, Score: Distinction).
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-medium text-foreground bg-surface-muted/60">
                <ShieldCheck className="w-3.5 h-3.5 text-foreground" />
                <span>Verified Degree</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Modal for viewing certificate details / preview */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-surface border border-border rounded-lg p-6 sm:p-7 text-start"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs text-muted font-medium mb-1">
                  <ShieldCheck className="w-4 h-4 text-foreground" />
                  <span>Verified Credential</span>
                  {selectedCert.year && <span>• {selectedCert.year}</span>}
                </div>
                <h3 className="text-lg sm:text-xl font-medium text-foreground tracking-tight leading-snug">
                  {selectedCert.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted mt-1">
                  Issued by <span className="text-foreground font-medium">{selectedCert.issuer}</span>
                  {selectedCert.status ? ` • ${selectedCert.status}` : ''}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                aria-label="Close dialog"
                className="p-2 rounded-full border border-border text-foreground hover:bg-surface-muted transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Certificate Visual or Preview Image */}
            {(selectedCert.imageUrl || selectedCert.image) ? (
              <div className="mt-5 max-h-[60vh] overflow-auto rounded-lg border border-border bg-surface-muted flex items-center justify-center">
                <img
                  src={selectedCert.imageUrl || selectedCert.image}
                  alt={selectedCert.title}
                  className="w-full h-auto max-h-[58vh] object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="mt-5 p-6 rounded-lg border border-border bg-surface-muted/40">
                <p className="text-sm text-foreground/85 leading-relaxed font-normal">
                  {selectedCert.description}
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-border">
              {selectedCert.badge && (
                <span className="text-xs uppercase tracking-wider font-medium text-muted">
                  {selectedCert.badge}
                </span>
              )}
              {selectedCert.credentialUrl ? (
                <a
                  href={selectedCert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-surface text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="px-4 py-2 rounded-full border border-border text-xs font-medium text-foreground hover:bg-surface-muted transition-colors ms-auto"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

Education.displayName = 'Education';

export default Education;
