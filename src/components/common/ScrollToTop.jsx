import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from '../../utils/icons';

export default function ScrollToTop({ showAfter = 300 }) {
  const [visible, setVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrolled > showAfter);
      setScrollPercent(docHeight > 0 ? (scrolled / docHeight) * 100 : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfter]);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollPercent / 100) * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="relative w-14 h-14 cursor-pointer group">
            {/* Progress ring */}
            <svg
              width={56}
              height={56}
              className="absolute top-0 left-0 transform -rotate-90"
            >
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="3"
                className="dark:stroke-gray-700"
              />
              <circle
                cx="28"
                cy="28"
                r={radius}
                fill="none"
                stroke="url(#scroll-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-200"
              />
              <defs>
                <linearGradient id="scroll-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>

            {/* Button */}
            <button
              onClick={scrollTop}
              className=" cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                w-11 h-11 rounded-4xl
                bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm
                border border-gray-200/50 dark:border-gray-700/50
                shadow-lg hover:shadow-xl
                text-emerald-600 dark:text-emerald-400
                hover:bg-emerald-50 dark:hover:bg-emerald-900/20
                hover:text-emerald-700 dark:hover:text-emerald-300
                hover:scale-110
                transition-all duration-200 ease-out
                flex items-center justify-center
                group-hover:ring-2 group-hover:ring-emerald-200 dark:group-hover:ring-emerald-800"
              aria-label="Scroll to top"
            >
              <ChevronUp size={20} className="transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}