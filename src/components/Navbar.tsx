import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { Terminal, Code, LayoutGrid, Mail, Settings, Menu, X, Share2, User, Trophy, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { name: "Home", path: "/#home", sectionId: "home", icon: Terminal },
  { name: "About", path: "/#about", sectionId: "about", icon: User },
  { name: "Skills", path: "/#skills", sectionId: "skills", icon: Code },
  { name: "Journey", path: "/#journey", sectionId: "journey", icon: Briefcase },
  { name: "Apps", path: "/#projects", sectionId: "projects", icon: LayoutGrid },
  { name: "Goals", path: "/#achievements", sectionId: "achievements", icon: Trophy },
  { name: "Contact", path: "/#contact", sectionId: "contact", icon: Mail },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState(location.hash || "#home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Update active hash based on scroll position
      const sections = navItems.map(item => document.getElementById(item.sectionId));
      
      const scrollPosition = window.scrollY + 100; // Add offset for navbar

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= sectionTop) {
            setActiveHash(`#${section.id}`);
            break;
          }
        }
      }
      
      if (window.scrollY < 100) {
        setActiveHash("#home");
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      setActiveHash(location.hash);
    }
  }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === '/' && path.startsWith('/#')) {
      e.preventDefault();
      const hash = path.substring(1); // e.g. #projects
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Optional: update URL
        window.history.pushState(null, '', path);
        setActiveHash(hash);
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 pointer-events-none",
        scrolled ? "py-4" : "py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative">
          <nav
            className={cn(
              "mx-auto flex items-center justify-between max-w-7xl rounded-2xl transition-all duration-300 pointer-events-auto",
              (scrolled || isMobileMenuOpen)
                ? "bg-[#03030a]/60 backdrop-blur-xl border border-white/10 md:border-white/5 px-4 md:px-6 lg:px-8 py-3 md:py-4 shadow-[0_8px_32px_rgba(59,130,246,0.15),_inset_0_0_32px_rgba(168,85,247,0.05)]"
                : "px-2 md:px-4 py-3 md:py-4"
            )}
          >
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setIsMobileMenuOpen(false);
              }}
              className="text-lg md:text-2xl font-display font-bold tracking-tighter text-white flex items-center gap-2 lg:gap-3 group z-50 relative shrink-0"
            >
              <div className="relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] transition-all duration-300">
                  <defs>
                    <linearGradient id="nav-akash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  
                  {/* Left Bracket < */}
                  <path d="M 22 40 L 7 50 L 22 60" fill="none" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform duration-300" />
                  
                  {/* Right Bracket > */}
                  <path d="M 78 40 L 93 50 L 78 60" fill="none" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-300" />
                  
                  {/* Circuit traces for 'A' */}
                  <path d="M 50 15 L 30 75 M 50 15 L 70 75 M 36 58 L 64 58" fill="none" stroke="url(#nav-akash-gradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Circuit nodes extending from bottom of A */}
                  <path d="M 30 75 L 20 85 M 70 75 L 80 85" fill="none" stroke="url(#nav-akash-gradient)" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Glowing dot at top */}
                  <circle cx="50" cy="15" r="5" fill="#fff" className="group-hover:scale-110 transition-transform duration-300 origin-center" />
                  
                  {/* Glowing dots at bottom circuit ends */}
                  <circle cx="20" cy="85" r="3" fill="#3b82f6" className="group-hover:scale-125 transition-transform duration-300 origin-center" />
                  <circle cx="80" cy="85" r="3" fill="#a855f7" className="group-hover:scale-125 transition-transform duration-300 origin-center" />
                </svg>
              </div>
              <span className="tracking-tight">AkashProg</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex flex-1 justify-center px-2 lg:px-4 xl:px-8">
              <ul className="flex items-center gap-1.5 lg:gap-3 xl:gap-5">
                {navItems.map((item) => {
                  const isActive = (location.pathname === '/' && activeHash === `#${item.sectionId}`) || (location.pathname !== '/' && location.hash === `#${item.sectionId}`);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={(e) => handleNavClick(e, item.path)}
                        className="group relative px-3 py-2 lg:px-4 lg:py-2.5 text-sm lg:text-[15px] font-medium rounded-full text-gray-400 hover:text-white transition-all duration-300 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center whitespace-nowrap"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="nav-pill"
                            className="absolute inset-0 bg-white/10 rounded-full border border-white/10 -z-10 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-1.5 lg:gap-2">
                          <item.icon className="w-3.5 h-3.5 lg:w-[18px] lg:h-[18px] shrink-0 transition-colors" />
                          <span>{item.name}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center gap-2 lg:gap-4 z-50 relative shrink-0">
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 lg:p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
              >
                <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
              </Link>
              
              <button 
                className="lg:hidden p-2 text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-4 p-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl lg:hidden pointer-events-auto"
              >
                <ul className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const isActive = (location.pathname === '/' && activeHash === `#${item.sectionId}`) || (location.pathname !== '/' && location.hash === `#${item.sectionId}`);
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={(e) => handleNavClick(e, item.path)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300",
                            isActive 
                              ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/5" 
                              : "text-gray-400 hover:bg-white/5 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                          )}
                        >
                          <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500")} />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors mt-2 border-t border-white/10"
                    >
                      <Settings className="w-5 h-5" />
                      Admin Dashboard
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
