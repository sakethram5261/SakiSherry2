import { useState, useRef, useEffect } from "react";
import { useStorySession, useUpdateStory } from "@/hooks/use-story";
import { BookLayout, PageContent } from "@/components/BookLayout";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

// Heart shape coordinates (normalized 0-100)
const STAR_COORDS = [
  { x: 50, y: 85 }, // Bottom tip
  { x: 25, y: 55 }, // Left bottom
  { x: 15, y: 35 }, // Left mid
  { x: 25, y: 20 }, // Left top lobe
  { x: 50, y: 35 }, // Center dip
  { x: 75, y: 20 }, // Right top lobe
  { x: 85, y: 35 }, // Right mid
  { x: 75, y: 55 }, // Right bottom
];

// Reorder for drawing path
const PATH_ORDER = [4, 3, 2, 1, 0, 7, 6, 5, 4]; // Connects them in a heart loop

export default function Chapter2() {
  const { data: session, isLoading } = useStorySession();
  const updateStory = useUpdateStory();
  const [, setLocation] = useLocation();
  
  const [connections, setConnections] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (session) {
      setAttempts(session.minigameAttempts || 0);
    }
  }, [session]);

  const handleStarClick = (index: number) => {
    if (completed) return;

    if (!isDrawing) {
      // Start drawing
      setIsDrawing(true);
      setConnections([index]);
    } else {
      // Continue drawing
      const lastIndex = connections[connections.length - 1];
      
      // Simple validation: Allow connecting to any star for now to make it playable
      // But we track the path.
      if (lastIndex !== index && !connections.includes(index)) {
        setConnections([...connections, index]);
      } else if (index === connections[0] && connections.length > 5) {
        // Closing the loop (finished)
        checkShape([...connections, index]);
      }
    }
  };

  const checkShape = async (path: number[]) => {
    // For demo simplicity: if they connected at least 6 distinct stars and closed the loop
    // we consider it a success. Real logic would check geometry.
    const isSuccess = path.length >= 6; 

    if (isSuccess) {
      setCompleted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFC0CB', '#FF69B4', '#FFFFFF']
      });
      setTimeout(async () => {
        await updateStory.mutateAsync({ currentChapter: 3 });
        setLocation("/chapter/3");
      }, 3000);
    } else {
      handleFail();
    }
  };

  const handleFail = async () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setConnections([]);
    setIsDrawing(false);
    
    // Invalidate session to save attempts
    updateStory.mutate({ minigameAttempts: newAttempts });

    if (newAttempts >= 5) {
      // Trigger pity success or hint
      // For this implementation, we'll just let them keep trying but maybe show a guide line
    }
  };

  const reset = () => {
    setConnections([]);
    setIsDrawing(false);
  };

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>;

  return (
    <BookLayout isNight={true}>
      <PageContent className="flex flex-col items-center justify-center h-full relative">
        <h2 className="text-2xl font-display text-indigo-200 mb-4 absolute top-8">Trace the Constellation</h2>
        <p className="text-indigo-300/60 mb-8 font-serif italic absolute top-16">Connect the stars to reveal the shape</p>

        <div className="relative w-full max-w-md aspect-square bg-slate-900/50 rounded-full border border-indigo-500/20 shadow-[0_0_50px_rgba(79,70,229,0.1)]">
          {/* Guide lines (only show if failed many times) */}
          {attempts >= 5 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <path 
                d={`M ${STAR_COORDS[4].x}% ${STAR_COORDS[4].y}% L ${STAR_COORDS[3].x}% ${STAR_COORDS[3].y}% L ${STAR_COORDS[2].x}% ${STAR_COORDS[2].y}% L ${STAR_COORDS[1].x}% ${STAR_COORDS[1].y}% L ${STAR_COORDS[0].x}% ${STAR_COORDS[0].y}% L ${STAR_COORDS[7].x}% ${STAR_COORDS[7].y}% L ${STAR_COORDS[6].x}% ${STAR_COORDS[6].y}% L ${STAR_COORDS[5].x}% ${STAR_COORDS[5].y}% Z`}
                fill="none"
                stroke="white"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            </svg>
          )}

          {/* Active Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <AnimatePresence>
              {connections.map((starIndex, i) => {
                if (i === 0) return null;
                const prev = STAR_COORDS[connections[i-1]];
                const curr = STAR_COORDS[starIndex];
                return (
                  <motion.line
                    key={i}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    x1={`${prev.x}%`}
                    y1={`${prev.y}%`}
                    x2={`${curr.x}%`}
                    y2={`${curr.y}%`}
                    stroke={completed ? "#f472b6" : "white"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                );
              })}
            </AnimatePresence>
          </svg>

          {/* Stars */}
          {STAR_COORDS.map((coord, index) => {
            const isConnected = connections.includes(index);
            const isStart = connections[0] === index;
            const isLast = connections[connections.length - 1] === index;

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleStarClick(index)}
                className={`
                  absolute w-4 h-4 -ml-2 -mt-2 rounded-full transition-all duration-300
                  ${isConnected ? 'bg-indigo-100 shadow-[0_0_15px_white]' : 'bg-slate-400 hover:bg-white'}
                  ${(isLast && isDrawing) ? 'ring-4 ring-indigo-500/50' : ''}
                `}
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
              />
            );
          })}
        </div>

        <div className="absolute bottom-8 flex flex-col items-center gap-2">
          <p className="text-sm text-slate-500 font-mono">Attempts: {attempts}</p>
          <Button variant="ghost" size="sm" onClick={reset} className="text-slate-400 hover:text-white">
            <RefreshCw className="w-4 h-4 mr-2" /> Start Over
          </Button>
        </div>
      </PageContent>
    </BookLayout>
  );
}
