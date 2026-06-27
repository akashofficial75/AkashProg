import { motion } from "motion/react";
import { GraduationCap, Briefcase, Calendar } from "lucide-react";

export function TimelineSection() {
  const experiences = [
    {
      title: "Founder & Web Developer",
      company: "AkashProg",
      date: "Present",
      desc: "Designing and developing modern digital experiences through innovative websites, web applications, and intelligent solutions. Passionate about combining clean architecture, elegant design, and emerging technologies to create products that are both functional and visually engaging.",
      type: "work",
    },
    {
      title: "Technology & Innovation",
      company: "Independent Learner",
      date: "Ongoing",
      desc: "Driven by curiosity and a passion for continuous growth, I actively explore web development, software engineering, cybersecurity, ethical hacking, artificial intelligence, and modern digital technologies. Every project and experiment serves as an opportunity to learn, improve, and innovate.",
      type: "education",
    },
    {
      title: "Building Digital Products",
      company: "Personal Projects & Experiments",
      date: "Recent",
      desc: "Transforming ideas into real-world digital solutions by creating websites, applications, and productivity tools. Focused on developing meaningful products that emphasize performance, usability, and exceptional user experience.",
      type: "work",
    },
    {
      title: "Notre Dame College Admission Test",
      company: "Selected Candidate",
      date: "Academic Milestone",
      desc: "Successfully qualified through the highly competitive admission process of Notre Dame College, reflecting strong academic dedication, discipline, and a commitment to excellence.",
      type: "education",
    },
    {
      title: "Higher Secondary Education (HSC)",
      company: "Science Group",
      date: "Present",
      desc: "Currently pursuing Higher Secondary studies while balancing academics with technology, software development, and independent research. Continuously expanding my knowledge across both scientific and technological fields.",
      type: "education",
    },
    {
      title: "Financial Markets & Analysis",
      company: "Exploring Global Markets",
      date: "Beyond Technology",
      desc: "Exploring global financial markets including Forex, Cryptocurrency, and Stocks to better understand market dynamics, analytical thinking, and strategic decision-making. Engaged in continuous learning through research, observation, and practical analysis.",
      type: "work",
    },
    {
      title: "Secondary School Certificate (SSC)",
      company: "Science Group",
      date: "Foundation",
      desc: "Graduated with a perfect GPA 5.00, building a strong foundation in mathematics, logical reasoning, problem-solving, and analytical thinking that continues to support my technical journey today.",
      type: "education",
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="journey">
      {/* Premium Glassmorphism Background */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md -z-10 border-y border-white/5" />

      {/* Soft Gradients & Glow Effects */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/5 blur-[140px] rounded-full pointer-events-none -z-20" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-transparent -z-10" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="text-purple-500 w-6 h-6" />
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              My <span className="text-purple-500">Journey</span>
            </h2>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

        <div className="relative ml-4 md:ml-0 md:space-y-12 pb-12 md:pb-0">
          {/* Vertical Timeline Line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2" />

          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`relative pl-8 md:pl-0 mb-12 md:mb-0 w-full md:w-1/2 md:even:ml-auto md:even:pl-12 md:odd:pr-12 md:odd:text-right group`}
            >
              <div
                className={`absolute top-0 left-[-8px] md:left-auto md:top-6 w-4 h-4 rounded-full bg-black border-2 border-white/20 group-hover:border-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all duration-300 z-10
                  ${idx % 2 === 0 ? "md:right-[-8px]" : "md:left-[-8px]"}
                `}
              />

              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] group-hover:-translate-y-2 group-hover:bg-white/[0.04]">
                <div
                  className={`flex items-center gap-3 mb-2 text-gray-400 text-sm font-medium uppercase tracking-wider ${idx % 2 === 0 ? "md:justify-end" : ""}`}
                >
                  <Calendar className="w-4 h-4 text-purple-400" />
                  {exp.date}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-100 mb-1">
                  {exp.title}
                </h3>
                <div
                  className={`flex items-center gap-2 mb-4 text-purple-400 font-medium ${idx % 2 === 0 ? "md:justify-end" : ""}`}
                >
                  {exp.type === "work" ? (
                    <Briefcase className="w-4 h-4" />
                  ) : (
                    <GraduationCap className="w-4 h-4" />
                  )}
                  {exp.company}
                </div>
                <p className="text-gray-500 leading-relaxed font-light">
                  {exp.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
