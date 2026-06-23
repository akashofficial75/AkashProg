import { motion } from "motion/react";

export function AnimatedLogo() {
  return (
    <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center group">
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border border-blue-500/30 border-t-blue-400 border-b-purple-500"
      />
      {/* Inner pulsing ring */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-4 rounded-full border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
      />
      {/* Core glowing tech logo */}
      <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] group-hover:drop-shadow-[0_0_30px_rgba(168,85,247,0.9)] transition-all duration-500">
        <defs>
          <linearGradient id="akash-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>

        {/* Left Bracket < */}
        <motion.path 
          d="M 22 40 L 7 50 L 22 60" 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
        />
        
        {/* Right Bracket > */}
        <motion.path 
          d="M 78 40 L 93 50 L 78 60" 
          fill="none" 
          stroke="#a855f7" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
        />

        {/* Circuit traces for 'A' */}
        <motion.path 
          d="M 50 15 L 30 75 M 50 15 L 70 75 M 36 58 L 64 58" 
          fill="none" 
          stroke="url(#akash-gradient)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Circuit nodes extending from bottom of A */}
        <motion.path 
          d="M 30 75 L 20 85 M 70 75 L 80 85" 
          fill="none" 
          stroke="url(#akash-gradient)" 
          strokeWidth="4" 
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 1 }}
        />

        {/* Glowing dot at top */}
        <motion.circle 
          cx="50" cy="15" r="4.5" 
          fill="#fff"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 1.5 }}
        />
        {/* Glowing dots at bottom circuit ends */}
        <motion.circle 
          cx="20" cy="85" r="3" 
          fill="#3b82f6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 1.7 }}
        />
        <motion.circle 
          cx="80" cy="85" r="3" 
          fill="#a855f7"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 1.7 }}
        />
      </svg>
    </div>
  );
}
