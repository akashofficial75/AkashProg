import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { motion } from "motion/react";
import { Code2, Cpu, Globe, Database, Smartphone, Palette, Terminal, Cloud } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend Engineering",
    icon: Globe,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js"],
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "Backend & Systems",
    icon: Database,
    skills: ["Node.js", "Express", "PostgreSQL", "Firebase", "Redis", "GraphQL"],
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "AI & Innovation",
    icon: Cpu,
    skills: ["TensorFlow", "OpenAI API", "Gemini API", "LangChain", "Vector DBs"],
    color: "from-green-400 to-emerald-600"
  },
  {
    title: "UI/UX Design",
    icon: Palette,
    skills: ["Figma", "UI Animation", "Design Systems", "Prototyping", "Wireframing"],
    color: "from-orange-400 to-rose-500"
  },
  {
    title: "DevOps & Cloud",
    icon: Cloud,
    skills: ["AWS", "GCP", "Docker", "CI/CD", "Vercel", "Linux"],
    color: "from-gray-400 to-gray-600"
  },
  {
    title: "Core Languages",
    icon: Code2,
    skills: ["JavaScript", "Python", "Go", "Rust", "C++"],
    color: "from-yellow-400 to-amber-600"
  }
];

const getCategoryIcon = (category: string) => {
  if (!category) return { icon: Terminal, color: "from-blue-400 to-blue-600" };
  const catLower = category.toLowerCase();
  if (catLower.includes('frontend')) return { icon: Globe, color: "from-blue-500 to-cyan-400" };
  if (catLower.includes('backend') || catLower.includes('system')) return { icon: Database, color: "from-purple-500 to-pink-500" };
  if (catLower.includes('ai') || catLower.includes('machine learning')) return { icon: Cpu, color: "from-green-400 to-emerald-600" };
  if (catLower.includes('design') || catLower.includes('ui')) return { icon: Palette, color: "from-orange-400 to-rose-500" };
  if (catLower.includes('devops') || catLower.includes('cloud')) return { icon: Cloud, color: "from-gray-400 to-gray-600" };
  if (catLower.includes('core') || catLower.includes('language')) return { icon: Code2, color: "from-yellow-400 to-amber-600" };
  return { icon: Terminal, color: "from-blue-400 to-blue-600" };
};

export function SkillsSection() {
  const [liveSkills, setLiveSkills] = useState<any[]>([]);
  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "skills"), (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a: any, b: any) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return 0;
      });
      setLiveSkills(list);
    });
    return () => unsub();
  }, []);

  // Compute categories
  const categoriesMap = new Map();
  liveSkills.forEach(s => {
    if (!categoriesMap.has(s.category)) categoriesMap.set(s.category, []);
    categoriesMap.get(s.category).push(s.name);
  });

  const displayCategories = Array.from(categoriesMap.entries()).map(([cat, skills]) => ({
    title: cat,
    skills,
    ...getCategoryIcon(cat)
  }));
  
  // Use displayCategories if we have live data, else fallback
  const categoriesToRender = displayCategories.length > 0 ? displayCategories : skillCategories;

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="skills">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-20 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-4"
          >
            Technical <span className="text-gray-400">Toolkit</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 font-light max-w-2xl mx-auto"
          >
            A comprehensive toolbox enabling me to build end-to-end digital experiences, from pixel-perfect interfaces to robust system architectures.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {categoriesToRender.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 group transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-white/10 overflow-hidden flex flex-col hover:shadow-[0_0_40px_rgba(255,255,255,0.05)]"
            >
              {/* Subtle ambient corner glow */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${cat.color} blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none translate-x-1/4 -translate-y-1/4`} />
              
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 rounded-2xl mb-8 flex items-center justify-center relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-10 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`} />
                  <cat.icon className="w-6 h-6 text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-500" />
                </div>
                
                <h3 className="text-xl font-medium tracking-tight mb-6 text-gray-200 group-hover:text-white transition-colors duration-300">{cat.title}</h3>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {cat.skills.map((skill, i) => (
                    <span key={i} className="px-3.5 py-1.5 bg-white/5 border border-white/5 rounded-full text-sm text-gray-400 font-light group-hover:text-gray-300 group-hover:border-white/10 group-hover:bg-white/10 transition-colors duration-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
