import { motion } from "motion/react";
import { 
  Trophy, 
  Star, 
  Medal, 
  ShieldCheck, 
  Code2, 
  Rocket, 
  BrainCircuit, 
  Award, 
  Globe2, 
  Target
} from "lucide-react";

export function AchievementsSection() {
  const goals = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Global Technology Excellence",
      desc: "Continuously mastering modern technologies, software engineering, cybersecurity, artificial intelligence, and emerging digital innovations to become a versatile technology professional capable of solving complex real-world challenges.",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "International Competitions & Recognition",
      desc: "Actively participating in global technology competitions, hackathons, cybersecurity challenges, innovation contests, and developer events with the goal of competing among the world's best and bringing international recognition to Bangladesh.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Advanced Cyber Security & Ethical Hacking",
      desc: "Developing deep expertise in cyber security, ethical hacking, and digital defense systems to contribute toward a safer and more secure digital future.",
    },
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "Artificial Intelligence & Intelligent Systems",
      desc: "Building next-generation AI-powered applications and intelligent solutions that improve lives, enhance productivity, and solve meaningful global problems.",
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Innovative Digital Products & Entrepreneurship",
      desc: "Transforming ambitious ideas into impactful software products, platforms, and technology ventures capable of creating value on a global scale.",
    },
    {
      icon: <Globe2 className="w-6 h-6" />,
      title: "Open Source & Community Contribution",
      desc: "Contributing to open-source technologies, sharing knowledge, and collaborating with developers worldwide to help strengthen the global technology ecosystem.",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Financial Markets & Strategic Analysis",
      desc: "Expanding knowledge in Forex, Cryptocurrency, Stocks, and financial technologies while developing strong analytical and decision-making skills through continuous learning and market research.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Building Global Impact",
      desc: "Creating technology that reaches beyond borders, empowers people, and represents Bangladesh on the international stage through innovation, creativity, and excellence.",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Lifelong Learning & Innovation",
      desc: "Remaining a lifelong learner, constantly exploring new ideas, technologies, and opportunities to push boundaries and turn possibilities into reality.",
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="achievements">
      {/* Premium Glassmorphism Background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md -z-10 border-y border-white/5" />
      
      {/* Soft Gradients & Glow Effects */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-500/5 blur-[140px] rounded-full pointer-events-none -z-20" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-transparent -z-10" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="text-cyan-400 w-6 h-6" />
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Vision & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Goals</span>
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto font-light mb-8">
            A roadmap of my dreams and aspirations. These are the goals I am working passionately towards every single day to leave a lasting mark.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group bg-white/[0.02] backdrop-blur-xl border border-white/10 p-8 rounded-2xl hover:border-blue-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:-translate-y-2 hover:bg-white/[0.04] flex flex-col relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 text-gray-300 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/30 group-hover:text-cyan-400 transition-all duration-500 relative z-10 shadow-lg">
                {item.icon}
              </div>
              
              <h3 className="text-xl font-display font-semibold text-gray-100 mb-3 relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-300 transition-all duration-300">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed font-light relative z-10 flex-grow group-hover:text-gray-300 transition-colors duration-300">{item.desc}</p>

              {/* Progress indicator decoration */}
              <div className="mt-8 pt-6 w-full relative z-10 border-t border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-medium opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    Aspiration
                  </span>
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                    In Progress
                  </span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 w-0 group-hover:w-full transition-all duration-1000 ease-out" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
