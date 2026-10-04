import { useState, useEffect, memo } from 'react';
import { m } from 'framer-motion';
import { Send, MessageSquare, Phone, Github, Linkedin, Mail, ArrowUpRight, Zap, Briefcase, Facebook, Instagram, Twitter } from 'lucide-react';
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
      setStatus({ loading: false, success: false, error: 'Failed to send payload. Please try again later.' });
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
      { name: "LinkedIn", icon: <Linkedin size={20} />, href: li, color: "text-[#0A66C2] border-[#0A66C2]/30 hover:bg-[#0A66C2]/10" },
      { name: "Facebook", icon: <Facebook size={20} />, href: fb, color: "text-[#1877F2] border-[#1877F2]/30 hover:bg-[#1877F2]/10" },
      { name: "Instagram", icon: <Instagram size={20} />, href: ig, color: "text-[#E4405F] border-[#E4405F]/30 hover:bg-[#E4405F]/10" },
      { name: "GitHub", icon: <Github size={20} />, href: gh, color: "text-white border-white/30 hover:bg-white/10" },
      { name: "WhatsApp", icon: <Phone size={20} />, href: wa, color: "text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/10" }
    ];

    if (tw) s.push({ name: "X (Twitter)", icon: <Twitter size={20} />, href: tw, color: "text-[#06b6d4] border-[#06b6d4]/30 hover:bg-[#06b6d4]/10" });
    if (kh) s.push({ name: "Khamsat", icon: <Briefcase size={20} />, href: kh, color: "text-[#1dbf73] border-[#1dbf73]/30 hover:bg-[#1dbf73]/10" });

    return s;
  };

  const socials = getSocialList();

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '80px' }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-purple-500/15 bg-purple-500/5 mb-8"
          >
             <Zap className="w-3.5 h-3.5 text-cyan-400" />
             <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-purple-300/70 font-mono">Open for Collaboration</span>
          </m.div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-[-0.03em] mb-5 text-white">
            Connect for{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400">Innovation.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Side: Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="group relative flex flex-col p-10 bg-white/[0.02] border border-white/[0.06] rounded-3xl hover:border-purple-500/20 transition-all duration-500 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
               
               <h3 className="text-2xl font-black uppercase mb-8 relative z-10 text-white">
                 Reach Out
               </h3>
               
               <div className="space-y-6 relative z-10">
                 {!isDataLoaded ? (
                   <div className="animate-pulse space-y-4">
                     <div className="h-14 bg-white/5 rounded-2xl w-full"></div>
                     <div className="h-14 bg-white/5 rounded-2xl w-full"></div>
                   </div>
                 ) : (
                   <>
                      <a href={`mailto:${contactData?.email || 'amer003100@gmail.com'}`} className="group/item flex items-center gap-6 p-4 rounded-2xl hover:bg-purple-500/5 transition-all border border-transparent hover:border-purple-500/15">
                         <div className="w-13 h-13 p-3 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover/item:bg-purple-500/15 transition-all duration-300 border border-purple-500/10">
                           <Mail className="text-purple-300 w-5 h-5" />
                         </div>
                         <div>
                           <p className="text-[10px] uppercase font-bold text-white/25 tracking-widest mb-1 font-mono">Email Protocol</p>
                           <p className="text-base font-bold text-white/70">{contactData?.email || 'amer003100@gmail.com'}</p>
                         </div>
                      </a>

                      <div className="group/item flex items-center gap-6 p-4 rounded-2xl hover:bg-purple-500/5 transition-all border border-transparent hover:border-purple-500/15">
                         <div className="w-13 h-13 p-3 bg-cyan-500/10 rounded-xl flex items-center justify-center group-hover/item:bg-cyan-500/15 transition-all duration-300 border border-cyan-500/10">
                           <Phone className="text-cyan-300 w-5 h-5" />
                         </div>
                         <div>
                           <p className="text-[10px] uppercase font-bold text-white/25 tracking-widest mb-1 font-mono">Direct Relay</p>
                           <p className="text-base font-bold text-white/70">{contactData?.phone || '+20 102 352 4477'}</p>
                         </div>
                      </div>
                   </>
                 )}
               </div>

               <div className="mt-10 pt-10 border-t border-white/[0.04] relative z-10">
                   <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center gap-3 font-mono">
                      <span className="w-8 h-[1px] bg-purple-500/15" /> Digital Ecosystem
                  </p>
                  <div className="flex gap-4 flex-wrap">
                     {socials.map((s, i) => (
                       <a 
                        key={i} 
                        href={s.href} 
                        target="_blank" 
                        rel="noopener" 
                        className={`w-12 h-12 flex items-center justify-center border rounded-2xl transition-all duration-300 ${s.color}`}
                        title={s.name}
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
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "100px" }}
              onSubmit={handleSubmit}
              className="group relative flex flex-col p-10 md:p-12 border border-white/[0.06] bg-white/[0.02] rounded-3xl overflow-hidden cursor-default h-full hover:border-purple-500/20 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="grid md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-white/50 tracking-widest ml-2">Your Identity</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    placeholder="Enter full name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-purple-400/50 focus:bg-purple-500/5 focus:outline-none transition-all font-bold text-white placeholder:text-muted/40"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-black text-white/50 tracking-widest ml-2">Communication Link</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    placeholder="Enter email address"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-purple-400/50 focus:bg-purple-500/5 focus:outline-none transition-all font-bold text-white placeholder:text-muted/40"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-3 relative z-10 mt-8 mb-8">
                <label className="text-[10px] uppercase font-black text-white/50 tracking-widest ml-2">Objective / Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  placeholder="Enter objective"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-purple-400/50 focus:bg-purple-500/5 focus:outline-none transition-all font-bold text-white placeholder:text-muted/40"
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="space-y-3 relative z-10 mb-8">
                <label className="text-[10px] uppercase font-black text-white/50 tracking-widest ml-2">Proposed Payload</label>
                <textarea 
                  rows="4"
                  required
                  value={formData.message}
                  placeholder="Describe your vision or inquiry..."
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 focus:border-purple-400/50 focus:bg-purple-500/5 focus:outline-none transition-all font-bold text-white placeholder:text-muted/40 resize-none"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={status.loading}
                className={`w-full py-6 font-black uppercase tracking-[0.4em] rounded-[2rem] transition-all flex items-center justify-center gap-4 group border-none ${
                  status.loading ? 'bg-purple-500/40 text-white/60 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_25px_rgba(147,51,234,0.3)] hover:shadow-[0_0_35px_rgba(147,51,234,0.45)] hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {status.loading ? 'Sending...' : 'Send Message'}
                {!status.loading && <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>

              {status.success && (
                <p className="text-green-400 text-xs font-bold uppercase tracking-widest text-center mt-4">Payload successfully transmitted.</p>
              )}
              {status.error && (
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest text-center mt-4">{status.error}</p>
              )}
            </m.form>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Contact;
