'use client';

import { useEffect } from 'react';

export function useIsClient(setIsClient) {
  useEffect(() => {
    setIsClient(true); // Set to true after component mounts on client
  }, []);
}
