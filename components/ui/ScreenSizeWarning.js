'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const MIN_WIDTH = 1024; // Minimum width in pixels

export default function ScreenSizeWarning({ children }) {
  const [isScreenTooSmall, setIsScreenTooSmall] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsScreenTooSmall(window.innerWidth < MIN_WIDTH);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  if (isScreenTooSmall) {
    return (
      <div className="fixed inset-0 bg-gray-950 bg-opacity-90 backdrop-blur-sm text-gray-100 flex flex-col items-center justify-center p-8 z-50 gap-6">
        <Image src="/favicon.png" alt="Piano Teacher App Icon" width={96} height={96} className="mb-6 shadow-lg" />
        <h2 className="text-4xl font-extrabold mb-4 text-center tracking-tight text-purple-400">¡Hola!</h2>
        <p className="text-xl text-center mb-4 max-w-2xl leading-relaxed">
          Parece que estás usando un dispositivo con una pantalla pequeña. La aplicación &apos;Piano Teacher App&apos; está diseñada para pantallas más grandes (escritorio, portátil o tablet grande) para ofrecer la mejor experiencia de aprendizaje.
        </p>
        <p className="text-xl text-center mb-4 max-w-2xl leading-relaxed">
          Aquí podrás aprender a tocar el piano con tu teclado MIDI, siguiendo las notas que caen y recibiendo retroalimentación en tiempo real.
        </p>
        <p className="text-xl text-center font-bold text-purple-300">
          Por favor, accede desde un dispositivo con una pantalla más grande para disfrutar de todas las funcionalidades.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
