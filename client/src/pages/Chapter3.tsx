import { useStorySession, useUpdateStory } from "@/hooks/use-story";
import { BookLayout, PageContent } from "@/components/BookLayout";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Chapter3() {
  const { isLoading } = useStorySession();
  const updateStory = useUpdateStory();
  const [, setLocation] = useLocation();

  const handleNext = async () => {
    await updateStory.mutateAsync({ currentChapter: 4 });
    setLocation("/chapter/4");
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-[#fdfbf7]"><Loader2 className="animate-spin" /></div>;

  return (
    <BookLayout>
      <PageContent className="bg-gradient-to-br from-[#fdfbf7] to-[#f4f1ea]">
        <div className="flex items-center justify-center mb-12 opacity-20">
          <Music className="w-24 h-24 text-primary" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="prose prose-lg max-w-none font-serif text-slate-800 leading-relaxed"
        >
          <p className="first-letter:text-6xl first-letter:font-display first-letter:text-primary first-letter:mr-3 first-letter:float-left">
            As the stars aligned, a soft hum began to resonate in the air. It wasn't sound, exactly—it was a memory.
          </p>
          <p>
            "Can you hear me?"
          </p>
          <p>
            The voice was faint, like a whisper caught in the wind. It felt warm, familiar, and achingly sad. He stood up, his heart pounding in rhythm with the pulsing light of the constellation he had just traced.
          </p>
          <p className="italic text-primary/80 border-l-2 border-primary/20 pl-4 my-8">
            "I've been waiting for so long. The bamboo grove... the moon stone... do you remember our promise?"
          </p>
        </motion.div>

        <div className="mt-12 flex justify-end">
          <Button onClick={handleNext} variant="outline" className="border-primary/20 hover:bg-primary/5">
            Follow the voice <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </PageContent>
    </BookLayout>
  );
}
