import { useStorySession, useUpdateStory } from "@/hooks/use-story";
import { BookLayout, PageContent } from "@/components/BookLayout";
import { StarField } from "@/components/StarField";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Chapter1() {
  const { data: session, isLoading } = useStorySession();
  const updateStory = useUpdateStory();
  const [, setLocation] = useLocation();

  if (isLoading || !session) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  const handleNext = async () => {
    await updateStory.mutateAsync({ currentChapter: 2 });
    setLocation("/chapter/2");
  };

  return (
    <BookLayout isNight={true}>
      <StarField />
      
      {/* Left Page - Image/Atmosphere */}
      <PageContent className="border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="h-full flex flex-col justify-center items-center text-center p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 2 }}
            className="w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-xl absolute"
          />
          <h2 className="text-3xl font-display text-indigo-200 mb-6 relative z-10">The Stargazer</h2>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent mb-8"></div>
        </div>
      </PageContent>

      {/* Right Page - Narrative */}
      <PageContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="prose prose-invert prose-lg max-w-none font-serif leading-loose"
        >
          <p>
            The night air was crisp, carrying the scent of pine and distant rain. He sat alone on the grassy hill, his telescope abandoned beside him. 
          </p>
          <p>
            He didn't need lenses to see it. It was there, pulling at the corner of his eye—a cluster of stars that didn't belong on any chart he'd ever studied.
          </p>
          <p>
            They seemed to pulse with a gentle, rhythmic light, like a heartbeat echoing across the cosmos. Waiting for him to notice. Waiting to be connected.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 flex justify-end"
        >
          <Button 
            onClick={handleNext}
            variant="ghost"
            className="text-indigo-300 hover:text-white hover:bg-indigo-950/50 group"
          >
            Look closer <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </PageContent>
    </BookLayout>
  );
}
