import { useState, useEffect } from "react";
import { useStorySession, useUpdateStory } from "@/hooks/use-story";
import { BookLayout, PageContent } from "@/components/BookLayout";
import { ClueText } from "@/components/ClueText";
import { Inventory } from "@/components/Inventory";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Key } from "lucide-react";
import { Button } from "@/components/ui/button";

const PAGES = [
  {
    title: "The Bamboo Cutter",
    content: (found: string[], onFound: any) => (
      <>
        <p>In a time long past, there was a bamboo cutter who found a child inside a glowing stalk of <ClueText id="bamboo" cluesFound={found} onFound={onFound}>bamboo</ClueText>. She grew rapidly into a woman of impossible beauty.</p>
        <p>Suitors came from all over the land, tasked with impossible quests to win her hand. But her eyes were always turned towards the sky, looking for something she had lost.</p>
      </>
    )
  },
  {
    title: "The Impossible Tasks",
    content: (found: string[], onFound: any) => (
      <>
        <p>She asked for the Jewel from the Dragon's Neck, the Robe of the Fire-Rat, and the Stone Bowl of Buddha. Men failed, one by one. But one man didn't bring treasures.</p>
        <p>He brought a simple <ClueText id="letter" cluesFound={found} onFound={onFound}>letter</ClueText>, written with ink made from stardust. He didn't want to possess her; he only wanted to understand her sorrow.</p>
      </>
    )
  },
  {
    title: "The Moon's Call",
    content: (found: string[], onFound: any) => (
      <>
        <p>On the night of the full moon, her people came for her. A celestial procession descending on clouds. She wept, leaving behind the <ClueText id="feather" cluesFound={found} onFound={onFound}>feather</ClueText> robe that bound her to the earth.</p>
        <p>"I must return," she whispered. "But the memories of this love... they are too heavy for a celestial being to carry."</p>
      </>
    )
  },
  {
    title: "The Elixir",
    content: (found: string[], onFound: any) => (
      <>
        <p>She left the Emperor the Elixir of Immortality, but he ordered it burned on the highest mountain. "Without her," he said, "I do not wish to live forever."</p>
        <p>But amidst the ashes, a single <ClueText id="stone" cluesFound={found} onFound={onFound}>glowing stone</ClueText> remained. A promise that souls bound by fate would find each other again, even if it took a thousand years.</p>
      </>
    )
  }
];

export default function Chapter4() {
  const { data: session, isLoading } = useStorySession();
  const updateStory = useUpdateStory();
  const [, setLocation] = useLocation();
  
  const [pageIndex, setPageIndex] = useState(0);
  const [localClues, setLocalClues] = useState<string[]>([]);

  useEffect(() => {
    if (session?.cluesFound) {
      setLocalClues(session.cluesFound);
    }
  }, [session]);

  const handleClueFound = (id: string) => {
    const newClues = [...localClues, id];
    setLocalClues(newClues);
    updateStory.mutate({ cluesFound: newClues });
  };

  const allCluesFound = localClues.length >= 4;

  const goToFinale = async () => {
    await updateStory.mutateAsync({ currentChapter: 5 });
    setLocation("/finale");
  };

  if (isLoading) return <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <BookLayout>
      <PageContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="h-full flex flex-col"
          >
            <span className="text-center font-display text-muted-foreground text-sm uppercase tracking-widest mb-8">
              Part {pageIndex + 1} of 4
            </span>
            
            <h3 className="text-3xl font-display text-primary mb-8 text-center">{PAGES[pageIndex].title}</h3>
            
            <div className="prose prose-lg font-serif leading-loose text-slate-700 flex-1">
              {PAGES[pageIndex].content(localClues, handleClueFound)}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-12 pt-8 border-t border-primary/10">
          <Button 
            variant="ghost" 
            disabled={pageIndex === 0}
            onClick={() => setPageIndex(p => p - 1)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          {pageIndex < 3 ? (
            <Button 
              variant="ghost"
              onClick={() => setPageIndex(p => p + 1)}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
             <Button 
              disabled={!allCluesFound}
              onClick={goToFinale}
              className={allCluesFound ? "bg-accent hover:bg-accent/90 text-white" : ""}
            >
              {allCluesFound ? (
                <>Unlock Memories <Key className="ml-2 h-4 w-4" /></>
              ) : (
                "Find all clues to proceed"
              )}
            </Button>
          )}
        </div>
      </PageContent>
      
      <Inventory cluesFound={localClues} />
    </BookLayout>
  );
}
