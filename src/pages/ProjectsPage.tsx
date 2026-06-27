import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { type Project } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, Search } from "lucide-react";

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const q = collection(db, "projects");
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      
      projList.sort((a,b) => {
         if (a.order !== undefined && b.order !== undefined) {
             return a.order - b.order;
         }
         const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
         const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
         return timeB - timeA;
      });
      
      setProjects(projList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching realtime projects:", error);
      // Fallback
      const fallbackUnsub = onSnapshot(collection(db, "projects"), (snapshot) => {
        const fallList = snapshot.docs.map(d => ({id: d.id, ...d.data()})) as Project[];
        fallList.sort((a,b) => {
           if (a.order !== undefined && b.order !== undefined) {
               return a.order - b.order;
           }
           const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
           const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
           return timeB - timeA;
        });
        setProjects(fallList);
        setLoading(false);
      });
    });

    return () => unsubscribe();
  }, []);

  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === "All" || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="py-16 md:py-24 px-4 md:px-6 relative">
      <div className="container mx-auto max-w-6xl relative z-10">
        
        <header className="mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-4"
          >
            Featured <span className="text-gray-400">Projects</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 font-light max-w-2xl mx-auto"
          >
            A curated showcase of my latest web apps, digital tools, and experiments.
          </motion.p>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((c, i) => (
              <button
                key={i}
                onClick={() => setFilter(c)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === c 
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-2.5 outline-none focus:border-white/30 focus:bg-white/10 transition-colors text-sm text-white placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-24 text-gray-500 font-light">
            No projects found matching your criteria.
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project, idx) => (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group relative bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-colors flex flex-col hover:shadow-[0_0_30px_rgba(255,255,255,0.03)]"
                >
                  <div className="relative h-56 overflow-hidden bg-black/50">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-100 z-10" />
                    {project.thumbnail ? (
                      <img 
                        src={project.thumbnail} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900 border-b border-white/5">
                        <span className="text-white/10 font-display text-5xl font-medium">{project.title.charAt(0)}</span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-gray-300">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative z-20">
                    <h3 className="text-xl font-medium mb-3 tracking-tight text-white">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3 font-light leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack?.map((tech, i) => (
                        <span key={i} className="text-[11px] text-gray-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                      {project.liveLink && (
                        <a 
                          href={project.liveLink} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-white hover:text-gray-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" /> Live Preview
                        </a>
                      )}
                      {project.githubLink && (
                        <a 
                          href={project.githubLink} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-white transition-colors"
                        >
                          <Github className="w-4 h-4" /> Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
