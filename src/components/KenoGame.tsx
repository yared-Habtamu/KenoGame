"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useKenoGame } from "@/hooks/useKenoGame";
import SelectionScreen from "./SelectionScreen";
import KenoGrid from "./KenoGrid";
import LiveDraw from "./LiveDraw";
import ResultsScreen from "./ResultsScreen";
import RecentDraws from "./RecentDraws";
import ShuffleScreen from "./ShuffleScreen";
import { useState } from "react";

export default function KenoGame() {
  const [testMode, setTestMode] = useState(false);
  const {
    gameState,
    selectedNumbers,
    drawnNumbers,
    drawSequence,
    drawHistory,
    currentDrawId,
    handleSelectionComplete,
    proceedToDrawing,
    addDrawnNumber,
    handleDrawComplete,
    handleResultsComplete,
    handleHistoryComplete,
  } = useKenoGame(testMode);

  const selectionDuration = 10; // Always 10 seconds
  const resultsDuration = testMode ? 5000 : 10000; // 5s or 10s
  const historyDuration = 10000; // Always 10s

  return (
    <div className="min-h-screen keno-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <AnimatePresence mode="wait">
          {gameState === "selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              <SelectionScreen
                onTimerComplete={handleSelectionComplete}
                duration={selectionDuration}
                drawId={currentDrawId}
              />
            </motion.div>
          )}

          {gameState === "drawing" && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto">
                {/* Left: Grid */}
                <div className="flex-1">
                  <div className="keno-card rounded-3xl p-6 shadow-2xl">
                    {/* show grid with current selected & drawn numbers */}
                    <KenoGrid
                      selectedNumbers={selectedNumbers}
                      drawnNumbers={drawnNumbers}
                      selectable={false}
                    />
                  </div>
                </div>

                {/* Right: Live draw controls */}
                <div className="lg:w-80 flex flex-col gap-6">
                  <LiveDraw
                    selectedNumbers={selectedNumbers}
                    drawSequence={drawSequence}
                    onDrawComplete={handleDrawComplete}
                    testMode={testMode}
                    onBallDrawn={addDrawnNumber}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {gameState === "shuffle" && (
            <motion.div
              key="shuffle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <ShuffleScreen
                src="/videos/shuffle.mp4"
                onEnded={() => {
                  // after video finishes, proceed to the drawing screen
                  proceedToDrawing();
                }}
              />
            </motion.div>
          )}

          {gameState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5 }}
            >
              <ResultsScreen
                selectedNumbers={selectedNumbers}
                drawnNumbers={drawnNumbers}
                onContinue={handleResultsComplete}
                displayDuration={resultsDuration}
              />
            </motion.div>
          )}

          {gameState === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-5xl font-bold text-white mb-2">
                  RECENT DRAWS
                </h1>
                <p className="text-yellow-400 text-xl">
                  Starting new game in 10 seconds...
                </p>
              </motion.div>
              <RecentDraws draws={drawHistory} />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 7 }}
                onAnimationComplete={() => {
                  setTimeout(handleHistoryComplete, 3000);
                }}
                className="text-white text-2xl font-bold"
              >
                Get ready...
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
