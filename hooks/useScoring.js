'use client';

import { useState, useCallback } from 'react';

export function useScoring() {
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [reactionTimes, setReactionTimes] = useState([]);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [results, setResults] = useState(null);

  const resetScore = useCallback(() => {
    setScore(0);
    setHits(0);
    setMisses(0);
    setCombo(0);
    setMaxCombo(0);
    setReactionTimes([]);
    setIsResultsVisible(false);
    setResults(null);
  }, []);

  const showResults = useCallback(() => {
    const total = hits + misses;
    const accuracy = (total === 0) ? 0 : Math.round((hits / total) * 100);
    const avgReaction = reactionTimes.length ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0;
    setResults({ score, accuracy, hits, misses, maxCombo, avgReaction });
    setIsResultsVisible(true);
  }, [score, hits, misses, maxCombo, reactionTimes]);

  const hideResults = useCallback(() => {
    setIsResultsVisible(false);
  }, []);

  return {
    score, setScore,
    hits, setHits,
    misses, setMisses,
    combo, setCombo,
    maxCombo, setMaxCombo,
    reactionTimes, setReactionTimes,
    resetScore,
    showResults,
    isResultsVisible,
    hideResults,
    results,
  };
}
