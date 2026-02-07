import { motion } from "framer-motion";
import { Scroll, Moon, Flower, Feather } from "lucide-react";

const CLUE_ICONS: Record<string, any> = {
  "bamboo": Flower,
  "stone": Moon,
  "letter": Scroll,
  "feather": Feather,
};

const CLUE_NAMES: Record<string, string> = {
  "bamboo": "Bamboo Piece",
  "stone": "Moon Stone",
  "letter": "Old Letter",
  "feather": "White Feather",
};

interface InventoryProps {
  cluesFound: string[];
}

export function Inventory({ cluesFound }: InventoryProps) {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-[#e6dcc6] px-6 py-4 rounded-full shadow-lg z-50 flex items-center gap-6"
    >
      <span className="font-serif text-sm text-muted-foreground mr-2 font-bold tracking-widest uppercase text-xs">Collection</span>
      
      {Object.keys(CLUE_ICONS).map((key) => {
        const Icon = CLUE_ICONS[key];
        const isFound = cluesFound.includes(key);
        
        return (
          <div key={key} className="relative group">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
              ${isFound 
                ? 'bg-accent/10 text-accent border border-accent/20 shadow-sm' 
                : 'bg-muted text-muted-foreground/30 border border-transparent'}
            `}>
              <Icon className="w-5 h-5" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded">
              {isFound ? CLUE_NAMES[key] : "???"}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
