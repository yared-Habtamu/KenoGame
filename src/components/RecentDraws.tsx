"use client";

import { motion } from "framer-motion";

interface Draw {
  id: number;
  numbers: number[];
  timestamp: number;
}

interface RecentDrawsProps {
  draws: Draw[];
}

export default function RecentDraws({ draws }: RecentDrawsProps) {
  return (
    <div className="w-full max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="keno-card rounded-2xl p-6 shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          RECENT DRAWS
        </h2>

        <div className="space-y-4">
          {draws.slice(0, 10).map((draw, idx) => (
            <motion.div
              key={draw.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-black/40 rounded-xl p-4 border border-red-900/30"
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-yellow-400 font-bold text-xl min-w-[100px]">
                  Draw #{draw.id}
                </div>
                <div className="flex flex-wrap gap-2 flex-1">
                  {draw.numbers.map((num, numIdx) => (
                    <div
                      key={numIdx}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        background:
                          numIdx < 10
                            ? "linear-gradient(145deg, #fbbf24, #f59e0b)"
                            : "linear-gradient(145deg, #f97316, #ea580c)",
                        boxShadow:
                          numIdx < 10
                            ? "0 0 12px rgba(251, 191, 36, 0.5)"
                            : "0 0 12px rgba(249, 115, 22, 0.5)",
                      }}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {draws.length === 0 && (
          <div className="text-gray-400 text-center py-12">
            No draws yet. Start playing!
          </div>
        )}
      </motion.div>
    </div>
  );
}
