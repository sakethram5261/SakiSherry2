import { useStorySession } from "@/hooks/use-story";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, isLoading } = useStorySession();
  const [, setLocation] = useLocation();

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
        <Loader2 className="w-8 h-8 animate-spin text-primary/30" />
      </div>
    );
  }

  const handleStart = () => {
    // If they have progress, go to their chapter, otherwise start at 1
    const targetChapter = session.currentChapter === 0 ? 1 : session.currentChapter;
    setLocation(`/chapter/${targetChapter}`);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
         <div className="absolute top-0 left-0 w-64 h-64 bg-accent blur-[100px] rounded-full" />
         <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 max-w-2xl"
      >
        <span className="text-accent tracking-[0.2em] text-sm font-semibold uppercase mb-4 block">Interactive Story</span>
        <h1 className="text-6xl md:text-8xl mb-6 text-primary leading-tight font-display">
          The Star's<br/>
          <span className="text-accent italic font-hand">Heart</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-serif leading-relaxed max-w-lg mx-auto">
          A tale of lost memories, constellations, and a love that spans lifetimes.
        </p>

        <Button 
          onClick={handleStart}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-8 text-xl rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
        >
          <BookOpen className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
          {session.currentChapter > 0 ? "Continue Story" : "Open Book"}
        </Button>
      </motion.div>
    </div>
  );
}
