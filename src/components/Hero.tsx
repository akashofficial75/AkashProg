import { motion } from "motion/react";
import { ArrowRight, Terminal, Mail } from "lucide-react";
import { AnimatedLogo } from "./AnimatedLogo";
import { useState, useEffect } from "react";

const roles = ["Student", "Developer", "Creator", "Designer", "Innovator"];

export function Hero() {
  const [currentRole, setCurrentRole] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8"
        >
          <AnimatedLogo />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-blue-500/30 text-blue-300 text-sm mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            AkashProg • Available for new opportunities
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight min-h-[140px] md:min-h-0 pb-4 md:pb-0">
            Building Digital <br className="hidden md:block" />
            <span className="text-gradient">Experiences Beyond</span> <br className="hidden md:block" />
            Imagination
          </h1>
          
          <div className="text-lg sm:text-xl md:text-2xl text-gray-300 mx-auto font-light leading-relaxed h-10 flex items-center justify-center gap-2">
            <span className="text-gray-500">I am a</span>
            <div className="relative inline-block w-28 sm:w-32 text-left">
              {roles.map((role, idx) => (
                <motion.span
                  key={role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: currentRole === idx ? 1 : 0, 
                    y: currentRole === idx ? 0 : -20 
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 font-semibold text-blue-400"
                >
                  {role}
                </motion.span>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 sm:flex-wrap">
            <a
              href="#projects"
              className="group relative px-6 py-4 sm:px-8 bg-white text-black rounded-full font-medium overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] w-full sm:w-auto flex items-center justify-center gap-3"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            
            <a
              href="#skills"
              className="group relative px-6 py-4 sm:px-8 rounded-full font-medium text-gray-300 transition-all duration-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 w-full sm:w-auto text-center flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(255,255,255,0.02)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] backdrop-blur-sm"
            >
              <Terminal className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" />
              View Skills
            </a>

            <a
              href="#contact"
              className="group relative px-6 py-4 sm:px-8 rounded-full font-medium text-gray-300 transition-all duration-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 w-full sm:w-auto text-center flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(255,255,255,0.02)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] backdrop-blur-sm"
            >
              <Mail className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" />
              Contact Me
            </a>
          </div>
        </motion.div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />
    </section>
  );
}
