import { useState } from "react";
import { useStorySession, useUpdateStory, useVerifyPassword } from "@/hooks/use-story";
import { BookLayout, PageContent } from "@/components/BookLayout";
import { motion } from "framer-motion";
import { Heart, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

export default function Finale() {
  const { isLoading } = useStorySession();
  const updateStory = useUpdateStory();
  const verifyPassword = useVerifyPassword();
  const { toast } = useToast();
  
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await verifyPassword.mutateAsync(password.toLowerCase());
      
      if (result.success) {
        setIsUnlocked(true);
        updateStory.mutate({ isComplete: true });
        
        // Celebration
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      } else {
        toast({
          title: "That's not it...",
          description: "Listen to your heart. What was the promise?",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-[#fdfbf7]"><Loader2 className="animate-spin" /></div>;

  if (isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
         
         <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5 }}
           className="z-10 max-w-2xl bg-white/5 backdrop-blur-md p-12 rounded-3xl border border-white/10 shadow-2xl"
         >
           <Sparkles className="w-16 h-16 text-yellow-200 mx-auto mb-6 animate-pulse" />
           <h1 className="text-4xl md:text-6xl font-display text-white mb-6">Past Life Lovers</h1>
           <p className="text-xl font-serif text-indigo-100 leading-relaxed mb-8">
             Across the ocean of stars, through cycles of rebirth, my soul recognized yours the moment we connected the constellation.
           </p>
           <p className="text-2xl font-hand text-pink-300">
             "I found you."
           </p>
           
           <div className="mt-12 flex justify-center gap-2">
             <Heart className="text-red-500 fill-red-500 animate-bounce" />
           </div>
         </motion.div>
      </div>
    );
  }

  return (
    <BookLayout>
      <PageContent className="flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-display mb-8">The Final Lock</h2>
        <p className="font-serif text-lg text-slate-600 mb-12 max-w-md">
          The memory is complete. But to break the seal of time, you must speak the words that bound your souls together.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
          <div className="relative group">
            <Input
              type="text"
              placeholder="What is your line to her?"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-center text-xl p-8 font-hand text-primary border-primary/20 focus:border-accent focus:ring-accent bg-white/50 backdrop-blur-sm transition-all shadow-inner"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></div>
          </div>
          
          <Button 
            type="submit" 
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-serif tracking-widest uppercase py-6"
            disabled={!password}
          >
            Speak the Words
          </Button>
        </form>
      </PageContent>
    </BookLayout>
  );
}
