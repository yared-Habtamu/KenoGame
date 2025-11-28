"use client";

import { useState, useEffect, useCallback } from "react";

type GameState = "selection" | "shuffle" | "drawing" | "results" | "history";

interface Draw {
  id: number;
  numbers: number[];
  timestamp: number;
}

export function useKenoGame(testMode: boolean = false) {
  const [gameState, setGameState] = useState<GameState>("selection");
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [drawSequence, setDrawSequence] = useState<number[]>([]);
  const [drawHistory, setDrawHistory] = useState<Draw[]>([]);
  const [currentDrawId, setCurrentDrawId] = useState(1);

  // Load draw history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("keno-draw-history");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDrawHistory(parsed.draws || []);
        setCurrentDrawId(parsed.nextId || 1);
      } catch (e) {
        console.error("Failed to parse draw history", e);
      }
    }
  }, []);

  // Save draw history to localStorage
  const saveDrawHistory = useCallback((draws: Draw[], nextId: number) => {
    localStorage.setItem(
      "keno-draw-history",
      JSON.stringify({ draws, nextId })
    );
  }, []);

  const handleSelectionComplete = useCallback((numbers: number[]) => {
    setSelectedNumbers(numbers);
    // go to shuffle screen first, then drawing will start after video
    setGameState("shuffle");
  }, []);

  const proceedToDrawing = useCallback(() => {
    // generate a single randomized 20-number sequence using Fisher-Yates
    const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);
    for (let i = allNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = allNumbers[i];
      allNumbers[i] = allNumbers[j];
      allNumbers[j] = tmp;
    }
    const sequence = allNumbers.slice(0, 20);
    setDrawSequence(sequence);
    // clear previous drawn numbers and start drawing
    setDrawnNumbers([]);
    setGameState("drawing");
  }, []);

  const addDrawnNumber = useCallback((num: number) => {
    setDrawnNumbers((prev) => {
      if (prev.includes(num)) return prev; // avoid duplicates (dev StrictMode or accidental double-calls)
      if (prev.length >= 20) return prev; // never exceed 20 drawn numbers
      return [...prev, num];
    });
  }, []);

  const handleDrawComplete = useCallback(
    (numbers: number[]) => {
      // numbers param may be provided by LiveDraw; fall back to drawSequence
      const finalNumbers = numbers && numbers.length ? numbers : drawSequence;
      setDrawnNumbers(finalNumbers);

      // Add to history
      const newDraw: Draw = {
        id: currentDrawId,
        numbers: finalNumbers,
        timestamp: Date.now(),
      };

      const updatedHistory = [newDraw, ...drawHistory].slice(0, 50); // Keep last 50 draws
      setDrawHistory(updatedHistory);
      setCurrentDrawId(currentDrawId + 1);
      saveDrawHistory(updatedHistory, currentDrawId + 1);

      setGameState("results");
    },
    [currentDrawId, drawHistory, saveDrawHistory, drawSequence]
  );

  const handleResultsComplete = useCallback(() => {
    setGameState("history");
  }, []);

  const handleHistoryComplete = useCallback(() => {
    setSelectedNumbers([]);
    setDrawnNumbers([]);
    setGameState("selection");
  }, []);

  return {
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
    testMode,
  };
}
