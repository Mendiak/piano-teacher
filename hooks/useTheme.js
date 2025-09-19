'use client';

import { useEffect } from 'react';
import { themes } from '../components/ui/themes.js';

export function useTheme(theme, fallingNoteColorRef) {
  useEffect(() => {
    const newTheme = themes[theme];
    if (newTheme) {
      for (const [key, value] of Object.entries(newTheme.colors)) {
        document.documentElement.style.setProperty(key, value);
      }
      // Get the computed value of --note-color for canvas drawing
      const computedNoteColor = getComputedStyle(document.documentElement).getPropertyValue('--note-color').trim();
      if (computedNoteColor) {
        fallingNoteColorRef.current = computedNoteColor;
      }
    }
  }, [theme, fallingNoteColorRef]);
}
