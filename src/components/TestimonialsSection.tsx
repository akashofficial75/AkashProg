import { motion } from "motion/react";
import { MessageSquareQuote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Product Manager at TechFlow",
      text: "Working with this developer was an absolute pleasure. Their attention to detail, architectural foresight, and ability to deliver stunning UIs is unmatched.",
      initials: "SJ"
    },
    {
      name: "David Chen",
      role: "CTO at StartupX",
      text: "A rare mix of strong engineering fundamentals and high-end design sensibilities. They transformed our MVP into a polished platform in record time.",
      initials: "DC"
    },
    {
      name: "Elena Rodriguez",
      role: "Lead Designer",
      text: "Finally, an engineer who truly understands design! Every pixel was precise, and the interactions were exactly as envisioned. Highly recommended.",
      initials: "ER"
    }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-black border-t border-white/5" id="testimonials">
      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquareQuote className="text-blue-500 w-6 h-6" />
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Client <span className="text-blue-500">Testimonials</span>
            </h2>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-[#050505] p-8 rounded-3xl border border-white/5 relative group hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
            >
              <MessageSquareQuote className="absolute top-8 right-8 w-12 h-12 text-white/5 group-hover:text-blue-500/10 transition-colors duration-300" />
              <p className="text-gray-400 font-light leading-relaxed mb-8 relative z-10">"{test.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 font-bold border border-white/10">
                  {test.initials}
                </div>
                <div>
                  <h4 className="text-gray-200 font-medium">{test.name}</h4>
                  <p className="text-sm text-gray-500">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
