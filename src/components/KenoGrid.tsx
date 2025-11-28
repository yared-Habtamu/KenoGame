"use client";

import { motion } from "framer-motion";

interface KenoGridProps {
  selectedNumbers: number[];
  drawnNumbers: number[];
  onNumberSelect?: (num: number) => void;
  selectable?: boolean;
}

export default function KenoGrid({
  selectedNumbers,
  drawnNumbers,
  onNumberSelect,
  selectable = false,
}: KenoGridProps) {
  const numbers = Array.from({ length: 80 }, (_, i) => i + 1);

  const getButtonClass = (num: number) => {
    const isDrawn = drawnNumbers.includes(num);
    const isSelected = selectedNumbers.includes(num);

    if (isDrawn) {
      return "keno-ball-drawn text-black font-black text-lg";
    }
    if (isSelected) {
      return "keno-ball-selected text-black font-black text-lg";
    }
    return "bg-gradient-to-br from-red-900/80 to-red-950/90 text-red-700 hover:bg-red-800/50 font-bold text-lg border border-red-900/30";
  };

  return (
    <div className="grid grid-cols-10 gap-2 p-4">
      {numbers.map((num) => (
        <motion.button
          key={num}
          onClick={() => selectable && onNumberSelect?.(num)}
          disabled={!selectable}
          className={`aspect-square rounded-xl flex items-center justify-center transition-all ${getButtonClass(
            num
          )} ${selectable ? "cursor-pointer" : "cursor-default"}`}
          whileHover={selectable ? { scale: 1.1 } : {}}
          whileTap={selectable ? { scale: 0.95 } : {}}
          animate={
            drawnNumbers.includes(num)
              ? {
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.5 },
                }
              : {}
          }
          style={{
            boxShadow: selectedNumbers.includes(num) || drawnNumbers.includes(num)
              ? "0 0 20px rgba(251, 191, 36, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)"
              : "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          {num}
        </motion.button>
      ))}
    </div>
  );
}