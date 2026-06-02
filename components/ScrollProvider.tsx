'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';
import 'lenis/dist/lenis.css';

interface ScrollProviderProps {
  children: ReactNode;
}

export default function ScrollProvider({ children }: ScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing for extra smoothness
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
