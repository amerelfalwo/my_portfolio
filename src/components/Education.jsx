import { useState, useMemo, memo } from 'react';
import { X, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { useCertificates } from '../hooks/useData';

const Education = memo(() => {
  const { certificates: fetchedCerts, isLoading } = useCertificates();
  const [selectedCert, setSelectedCert] = useState(null);

  const certifications = useMemo(() => {
    if (!fetchedCerts || fetchedCerts.length === 0) return [];
    return [...fetchedCerts].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [fetchedCerts]);

  // Separate certificates into those with images and those without images
  const { withImage, withoutImage } = useMemo(() => {
    const withImg = [];
    const withoutImg = [];
    certifications.forEach(cert => {
      const img = cert.imageUrl || cert.image;
      if (img && img.trim().length > 0) {
        withImg.push(cert);
      } else {
        withoutImg.push(cert);
      }
    });
    return { withImage: withImg, withoutImage: withoutImg };
  }, [certifications]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="education" className="py-24 sm:py-32 relative bg-transparent border-t border-border/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16 text-start">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted tracking-wide mb-3">
            <span className="text-[8px] text-foreground" aria-hidden="true">●</span>
            <span>Certificates &amp; Credentials</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-foreground leading-[1.12]">
            Verified credentials
          </h2>

          <p className="text-muted text-base sm:text-lg font-normal leading-relaxed mt-4">
            Accredited industry certifications, advanced machine learning tracks, and technical achievements.
          </p>
        </div>

        {/* 3-Column Grid for Certificates With Images (Same pattern as Projects per reference) */}
        {withImage.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {withImage.map((cert) => {
              const imgSrc = cert.imageUrl || cert.image;

              return (
                <div
                  key={cert.id || cert.title}
                  onClick={() => setSelectedCert(cert)}
                  className="group flex flex-col text-start cursor-pointer"
                >
                  {/* Aspect 4/3 image card */}
                  <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-border bg-surface-muted">
                    <img
                      src={imgSrc}
                      alt={cert.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Hover Dark Circle Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-foreground text-surface flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <span className="inline-block rtl:-scale-x-100 text-lg leading-none" aria-hidden="true">↗</span>
                      </div>
                    </div>
                  </div>

                  {/* Caption Below the Card */}
                  <div className="mt-3.5">
                    <h3 className="text-sm sm:text-base font-medium text-foreground tracking-tight group-hover:text-muted transition-colors line-clamp-1">
                      {cert.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-muted font-normal mt-1">
                      <span>{cert.issuer}</span>
                      <span>{formatDate(cert.date)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bordered List Rows for Items Without Images (or general credential list) */}
        {withoutImage.length > 0 && (
          <div className="mt-8 text-start">
            <h3 className="text-xs uppercase tracking-wider text-muted font-medium mb-3">
              Additional Credentials &amp; Certifications
            </h3>

            <div className="divide-y divide-border border-y border-border">
              {withoutImage.map((cert) => (
                <div
                  key={cert.id || cert.title}
                  className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-surface-muted/50 rounded-lg transition-colors"
                >
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-foreground tracking-tight">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-muted mt-0.5">
                      {cert.issuer} {cert.date ? `• ${formatDate(cert.date)}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {cert.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
                        <ShieldCheck className="w-3.5 h-3.5 text-foreground" />
                        Verified
                      </span>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-foreground underline underline-offset-4 hover:text-muted transition-colors inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <span className="inline-block rtl:-scale-x-100 text-[10px]" aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal for viewing certificate image preview */}
      {selectedCert && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-surface border border-border rounded-lg p-5 sm:p-6 shadow-xl"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-base font-medium text-foreground tracking-tight">
                  {selectedCert.title}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  {selectedCert.issuer} {selectedCert.date ? `• ${formatDate(selectedCert.date)}` : ''}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg border border-border text-foreground hover:bg-surface-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 max-h-[70vh] overflow-auto rounded-lg border border-border bg-surface-muted flex items-center justify-center">
              <img
                src={selectedCert.imageUrl || selectedCert.image}
                alt={selectedCert.title}
                className="w-full h-auto max-h-[68vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

Education.displayName = 'Education';

export default Education;
