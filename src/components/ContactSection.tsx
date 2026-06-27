import { motion } from "motion/react";
import { Mail, MessageSquare, MapPin, Send, Github, Twitter, Instagram, Youtube, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

const WhatsappIcon = (props: React.ComponentProps<"svg">) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.671.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.868.118.571-.086 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" stroke="none" fill="currentColor" /><path d="M11.95 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413zm0 21.6A9.87 9.87 0 016.92 20.222l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884z" stroke="none" fill="currentColor" /></svg>
)

const defaultSocialLinks = [
  { platform: "GitHub", url: "https://github.com/akashofficial75" },
  { platform: "Instagram", url: "https://www.instagram.com/akash_official75/?hl=en" },
  { platform: "Twitter", url: "https://x.com/Akash0fficial75" },
  { platform: "YouTube", url: "https://www.youtube.com/@tripexvibe" },
  { platform: "WhatsApp", url: "https://wa.me/8801327240031" }
];

const getIcon = (platform: string) => {
  if (!platform) return LinkIcon;
  const p = platform.toLowerCase();
  if (p.includes('github')) return Github;
  if (p.includes('instagram')) return Instagram;
  if (p.includes('twitter') || p.includes('x')) return Twitter;
  if (p.includes('youtube')) return Youtube;
  if (p.includes('whatsapp')) return WhatsappIcon;
  return LinkIcon;
};

export function ContactSection() {
  const [liveSocials, setLiveSocials] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState({
    email: "akashabdullahalmahmud@gmail.com",
    whatsapp: "01327240031",
    location: "Dhaka, Bangladesh"
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    const unsubSocials = onSnapshot(collection(db, "socials"), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a: any, b: any) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return 0;
      });
      setLiveSocials(list);
    });
    
    const unsubSettings = onSnapshot(collection(db, "settings"), (snap) => {
      const contactDoc = snap.docs.find(d => d.id === "contact_info");
      if (contactDoc) {
        try {
          const parsed = JSON.parse(contactDoc.data().value);
          setContactInfo(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Error parsing contact info", e);
        }
      }
    });

    return () => {
      unsubSocials();
      unsubSettings();
    };
  }, []);

  const currentSocials = [
    ...liveSocials,
    ...defaultSocialLinks.filter(d => !liveSocials.some(l => l.platform.toLowerCase() === d.platform.toLowerCase()))
  ];
  const displaySocials = currentSocials.map(s => ({
    ...s,
    icon: getIcon(s.platform),
    name: s.platform,
    href: s.url
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Format message for WhatsApp
    const text = `━━━━━━━━━━━━━━━━━━━━
   AKASHPROG PORTFOLIO
      NEW MESSAGE
━━━━━━━━━━━━━━━━━━━━

• Name:
${formData.name}

• Email:
${formData.email}

• Subject:
${formData.subject}

• Message:
${formData.message}

━━━━━━━━━━━━━━━━━━━━
Sent from AkashProg Portfolio
━━━━━━━━━━━━━━━━━━━━`;

    // Target WhatsApp number without '+' sign for wa.me link
    const targetNumber = "8801327240031";
    const whatsappUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      window.open(whatsappUrl, '_blank');
      
      // Reset form
      setTimeout(() => {
        setSuccess(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    }, 800);
  };

  return (
    <section className="py-16 md:py-32 relative" id="contact">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-4"
          >
            Let's <span className="text-gray-400">Connect</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 font-light max-w-2xl mx-auto"
          >
            Open for new opportunities, collaborations, and interesting projects. Drop me a line!
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* View Details */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="p-8 md:p-10 rounded-3xl bg-[#0a0a0a] border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <h3 className="text-2xl font-medium tracking-tight mb-8 text-white">Contact Information</h3>
              <div className="space-y-8 overflow-hidden">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    <Mail className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-500 font-medium tracking-wide uppercase mb-1">Email</p>
                    <a href={`mailto:${contactInfo.email}`} className="text-base md:text-lg font-light text-gray-200 hover:text-white transition-colors break-all">{contactInfo.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-500 font-medium tracking-wide uppercase mb-1">WhatsApp</p>
                    <p className="text-base md:text-lg font-light text-gray-200 break-words">{contactInfo.whatsapp}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-500 font-medium tracking-wide uppercase mb-1">Location</p>
                    <p className="text-base md:text-lg font-light text-gray-200 break-words">{contactInfo.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)]" id="socials">
              <h3 className="text-xl font-medium tracking-tight mb-6 text-white">Social Profiles</h3>
              <div className="flex flex-wrap gap-4">
                {displaySocials.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    title={social.name === "WhatsApp" ? `WhatsApp: ${contactInfo.whatsapp}` : social.name}
                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-1 hover:scale-110 group"
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-3xl bg-[#0a0a0a] border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)] space-y-6">
              <h3 className="text-2xl font-medium tracking-tight mb-8 text-white">Send a Message</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-black border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-black border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-colors text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-colors text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-black border border-white/10 rounded-xl px-5 py-3.5 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-colors resize-none text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-white text-black font-medium rounded-full px-4 py-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : success ? (
                    "Message Sent Successfully!"
                  ) : (
                    <>Send Message <Send className="w-4 h-4" /></>
                  )}
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
