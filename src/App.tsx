import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { Navbar } from "./components/Navbar";
import { ParticleBackground } from "./components/ParticleBackground";
import { Hero } from "./components/Hero";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SkillsSection } from "./components/SkillsSection";
import { ContactSection } from "./components/ContactSection";
import { AboutSection } from "./components/AboutSection";
import { TimelineSection } from "./components/TimelineSection";
import { AchievementsSection } from "./components/AchievementsSection";
import { useEffect } from "react";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <>
      <div id="home">
        <Hero />
      </div>
      
      <AboutSection />
      
      <div id="skills">
        <SkillsSection />
      </div>
      
      <TimelineSection />

      <div id="projects">
        <ProjectsPage />
      </div>

      <AchievementsSection />

      <div id="contact">
        <ContactSection />
      </div>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen text-white font-sans selection:bg-blue-500/30">
        <ParticleBackground />
        <Navbar />
        
        <main className="relative z-10 transition-all duration-500">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
