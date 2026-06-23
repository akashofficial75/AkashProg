import { motion } from "motion/react";
import { useEffect, useState } from "react";

function Counter({ end, suffix = "", duration = 2000 }: { end: number, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easing * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

export function StatsSection() {
  const stats = [
    { label: "Projects Completed", value: 45, suffix: "+" },
    { label: "Happy Clients", value: 30, suffix: "+" },
    { label: "Years Experience", value: 3, suffix: "+" },
    { label: "Code Commits", value: 1200, suffix: "+" },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-black/50 border-y border-white/5">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="space-y-3"
            >
              <div className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm md:text-base text-gray-400 font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
