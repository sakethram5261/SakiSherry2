import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ClueTextProps {
  id: string;
  children: ReactNode;
  cluesFound: string[];
  onFound: (id: string) => void;
}

export function ClueText({ id, children, cluesFound, onFound }: ClueTextProps) {
  const isFound = cluesFound.includes(id);
  const { toast } = useToast();

  const handleClick = () => {
    if (!isFound) {
      onFound(id);
      toast({
        title: "Clue Discovered!",
        description: "You've found a piece of the memory.",
        className: "bg-[#fdfbf7] border-[#e6dcc6] font-serif",
      });
    }
  };

  return (
    <span 
      onClick={handleClick}
      className={`
        relative inline-block cursor-pointer transition-all duration-500
        ${isFound 
          ? 'text-accent font-semibold' 
          : 'hover:text-accent/80 hover:scale-105'}
      `}
    >
      {children}
      {isFound && (
        <motion.span 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-3 -right-3 text-accent"
        >
          <Sparkles className="w-4 h-4" />
        </motion.span>
      )}
    </span>
  );
}
