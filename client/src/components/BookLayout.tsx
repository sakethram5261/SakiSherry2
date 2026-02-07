import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BookLayoutProps {
  children: ReactNode;
  className?: string;
  isNight?: boolean;
}

export function BookLayout({ children, className = "", isNight = false }: BookLayoutProps) {
  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 md:p-8 transition-colors duration-1000 ${isNight ? 'bg-slate-950' : 'bg-[#e8dfce]'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`
          relative w-full max-w-4xl min-h-[80vh] 
          ${isNight ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-[#fdfbf7] text-slate-800 border-[#e6dcc6]'}
          rounded-2xl shadow-2xl overflow-hidden book-page border-2
          flex flex-col md:flex-row
          ${className}
        `}
      >
        {/* Decorative Spine/Gutter for book effect */}
        <div className={`
          hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 z-10
          bg-gradient-to-r 
          ${isNight 
            ? 'from-transparent via-slate-950/50 to-transparent' 
            : 'from-transparent via-[#e0d5be]/60 to-transparent'}
        `}></div>

        {children}
      </motion.div>
    </div>
  );
}

export function PageContent({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-0 ${className}`}>
      {children}
    </div>
  );
}
