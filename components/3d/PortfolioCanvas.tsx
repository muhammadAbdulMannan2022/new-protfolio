'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useRef, useEffect } from 'react';
import SceneController from './SceneController';
import { ProjectData } from './ProjectsDimension';

export default function PortfolioCanvas({ onSelectProject }: { onSelectProject: (project: ProjectData) => void }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 bg-[#030303]">
      <Suspense fallback={<CanvasLoader />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#030303']} />
          <fog attach="fog" args={['#030303', 4, 30]} />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
          <pointLight position={[-5, 5, -5]} intensity={0.5} />

          <SceneController onSelectProject={onSelectProject} />
        </Canvas>
      </Suspense>
    </div>
  );
}

function CanvasLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#030303] text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium tracking-wider text-indigo-400">LOADING EXPERIENCE...</p>
      </div>
    </div>
  );
}
