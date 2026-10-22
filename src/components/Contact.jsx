import { useState, useEffect, memo } from 'react';
import { m } from 'framer-motion';
import { Send, Phone, Github, Linkedin, Mail, Briefcase, Facebook, Instagram, Twitter } from 'lucide-react';
import { getContactRelay, addMessage } from '../api';

const Contact = memo(() => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const [contactData, setContactData] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await getContactRelay();
        if (data) {
          setContactData(data);
        }
      } catch (err) {
        console.error("Error fetching contact config:", err);
      } finally {
        setIsDataLoaded(true);
      }
    };
    fetchContactInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    
    try {
      // 1. Send via EmailJS (loaded on demand)
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        name: formData.name,
        email: formData.email,
        title: formData.subject,
        message: formData.message,
      };

      const emailjs = (await import('@emailjs/browser')).default;
      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      // 2. Save using API for Inbox Manager
      await addMessage({
         name: formData.name,
         email: formData.email,
         subject: formData.subject,
         message: formData.message,
         read: false,
         createdAt: new Date().toISOString()
      });
      
      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Failed to send message. Please try again later.' });
      console.error(err);
    }
  };

  const getSocialList = () => {
    const gh = contactData?.github || contactData?.githubUrl || contactData?.socialLinks?.github || 'https://github.com/amerelfalwo';
    const li = contactData?.linkedin || contactData?.linkedinUrl || contactData?.socialLinks?.linkedin || 'https://www.linkedin.com/in/amir-elrefai-b3a3212b8/?isSelfProfile=true';
    const wa = contactData?.phone ? `https://wa.me/${contactData.phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/201023524477';
    const fb = contactData?.facebook || contactData?.socialLinks?.facebook || 'https://www.facebook.com/amir.elref3i';
    const ig = contactData?.instagram || contactData?.socialLinks?.instagram || 'https://www.instagram.com/amir.elref3i/';
    const tw = contactData?.xTwitter || contactData?.twitter || contactData?.socialLinks?.twitter;
    const kh = contactData?.khamsat;

    const s = [
      { name: "LinkedIn", icon: <Linkedin size={18} />, href: li },
      { name: "GitHub", icon: <Github size={18} />, href: gh },
      { name: "WhatsApp", icon: <Phone size={18} />, href: wa },
      { name: "Facebook", icon: <Facebook size={18} />, href: fb },
      { name: "Instagram", icon: <Instagram size={18} />, href: ig }
    ];

    if (tw) s.push({ name: "X (Twitter)", icon: <Twitter size={18} />, href: tw });
    if (kh) s.push({ name: "Khamsat", icon: <Briefcase size={18} />, href: kh });

    return s;
  };

  const socials = getSocialList();

  return (
    <section id="contact" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium border border-border bg-surface text-foreground mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
            Contact
          </m.div>
          <m.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4"
          >
            Let&apos;s Build Together
          </m.h2>
          <m.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-muted text-sm sm:text-base leading-relaxed"
          >
            Have an AI project, research collaboration, or technical challenge in mind? Drop a message or reach out directly.
          </m.p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Side: Contact Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full flex flex-col justify-between p-8 sm:p-10 bg-surface border border-border rounded-3xl shadow-xs">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-6">
                  Direct Channels
                </h3>

                <div className="space-y-4">
                  {!isDataLoaded ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-16 bg-surface-muted rounded-2xl w-full" />
                      <div className="h-16 bg-surface-muted rounded-2xl w-full" />
                    </div>
                  ) : (
                    <>
                      <a
                        href={`mailto:${contactData?.email || 'amer003100@gmail.com'}`}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-background border border-border hover:border-foreground transition-all"
                      >
                        <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors shrink-0">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] uppercase font-semibold text-muted tracking-wider">Email</p>
                          <p className="text-sm font-semibold text-foreground truncate">{contactData?.email || 'amer003100@gmail.com'}</p>
                        </div>
                      </a>

                      <a
                        href={`tel:${(contactData?.phone || '+201023524477').replace(/[^0-9+]/g, '')}`}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-background border border-border hover:border-foreground transition-all"
                      >
                        <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-colors shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] uppercase font-semibold text-muted tracking-wider">Phone / WhatsApp</p>
                          <p className="text-sm font-semibold text-foreground truncate">{contactData?.phone || '+20 102 352 4477'}</p>
                        </div>
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Social Channels */}
              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
                  Connect & Follow
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-border bg-background hover:bg-foreground hover:text-background text-foreground transition-all flex items-center justify-center shadow-xs"
                      title={s.name}
                      aria-label={s.name}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:col-span-7">
            <m.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="p-8 sm:p-10 bg-surface border border-border rounded-3xl shadow-xs flex flex-col justify-between h-full"
            >
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted ms-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      placeholder="e.g. Alex Morgan"
                      className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 focus:border-foreground focus:outline-none transition-all text-sm font-medium text-foreground placeholder:text-muted/50"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted ms-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      placeholder="e.g. alex@company.com"
                      className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 focus:border-foreground focus:outline-none transition-all text-sm font-medium text-foreground placeholder:text-muted/50"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted ms-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    placeholder="e.g. AI System Architecture / Collaboration"
                    className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 focus:border-foreground focus:outline-none transition-all text-sm font-medium text-foreground placeholder:text-muted/50"
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted ms-1">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    placeholder="Tell me about your project, timeline, and goals..."
                    className="w-full bg-background border border-border rounded-2xl px-5 py-3.5 focus:border-foreground focus:outline-none transition-all text-sm font-medium text-foreground placeholder:text-muted/50 resize-none"
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
              </div>

              <div className="mt-6 pt-2">
                <button
                  type="submit"
                  disabled={status.loading}
                  className={`w-full py-4 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2.5 ${
                    status.loading
                      ? 'bg-foreground/50 text-background cursor-not-allowed'
                      : 'bg-foreground text-background hover:opacity-90 active:scale-[0.99]'
                  }`}
                >
                  {status.loading ? 'Sending...' : 'Send Message'}
                  {!status.loading && <Send size={16} />}
                </button>

                {status.success && (
                  <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider text-center mt-3">
                    Message successfully sent. I will get back to you shortly.
                  </p>
                )}
                {status.error && (
                  <p className="text-red-500 text-xs font-semibold uppercase tracking-wider text-center mt-3">
                    {status.error}
                  </p>
                )}
              </div>
            </m.form>
          </div>
        </div>
      </div>
    </section>
  );
});

Contact.displayName = 'Contact';

export default Contact;
