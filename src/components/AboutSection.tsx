import { motion } from "motion/react";
import { User, Code2, Sparkles, Cpu } from "lucide-react";

export function AboutSection() {
  const highlights = [
    {
      icon: <Code2 className="w-5 h-5" />,
      title: "Clean Architecture",
      desc: "Building scalable and maintainable solutions.",
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Full-Stack Expertise",
      desc: "From interactive UIs to robust backends.",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Premium Aesthetics",
      desc: "Focusing on pixel-perfect modern design.",
    },
  ];

  return (
    <section className="min-h-screen py-16 md:py-24 relative overflow-hidden" id="about">
      {/* Premium Glassmorphism Background */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md -z-10" />
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[120px] rounded-full point-events-none -z-10" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="text-blue-500 w-6 h-6" />
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              About <span className="text-blue-500">Me</span>
            </h2>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-display font-medium text-white leading-snug">
              Building the Future, <span className="text-blue-500">One Line of Code at a Time.</span>
              <br />
              <span className="text-gray-400 text-xl font-light mt-2 block">Welcome to AkashProg.</span>
            </h3>
            
            <div className="space-y-4 text-gray-400 font-light leading-relaxed">
              <p>
                I'm Akash — a student, developer, and digital creator passionate about turning ideas into meaningful digital experiences. I specialize in building modern websites, powerful web applications, and elegant user interfaces that combine functionality with aesthetic design.
              </p>
              <p>
                My goal is simple: create technology that not only works flawlessly but also feels engaging, intuitive, and memorable. Every project I build is crafted with attention to detail, clean architecture, smooth interactions, and a strong focus on user experience.
              </p>
              <p>
                Driven by curiosity and continuous learning, I spend my time exploring new technologies, refining my skills, and experimenting with innovative ideas. Whether it's developing a custom platform, designing a premium interface, or solving complex challenges, I enjoy bringing creative visions to life through code.
              </p>
              <p>
                For me, programming is more than writing code—it's about building experiences, solving problems, and creating something that can inspire others.
              </p>
              <p className="text-blue-400 font-medium pt-2">
                Let's build something extraordinary.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid gap-6"
          >
            {highlights.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative bg-[#0a0a0a] border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] flex gap-4 items-start"
              >
                <div className="p-3 bg-white/5 rounded-xl text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/10 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xl font-medium text-gray-200 mb-2">{item.title}</h4>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
