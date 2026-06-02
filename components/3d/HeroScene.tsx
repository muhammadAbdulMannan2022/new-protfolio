'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { createSoftParticleTexture } from './utils';

interface HeroSceneProps {
  position: [number, number, number];
}

export default function HeroScene({ position }: HeroSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  // Dynamic soft texture
  const particleTexture = useMemo(() => createSoftParticleTexture(), []);

  // Create nebula space particles with varied colors and sizes
  const particleCount = 1200;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  useMemo(() => {
    const colorPalette = [
      new THREE.Color('#6366f1'), // Indigo
      new THREE.Color('#a855f7'), // Purple
      new THREE.Color('#4f46e5'), // Dark Blue
      new THREE.Color('#ffffff'), // White
    ];

    for (let i = 0; i < particleCount; i++) {
      // Cylindrical/spherical spread
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 25 + 2;
      const z = (Math.random() - 0.5) * 40;
      
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.sin(theta) * radius;
      positions[i * 3 + 2] = z;

      // Color distribution
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.015;
      pointsRef.current.rotation.z = Math.sin(time * 0.05) * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -time * 0.05;
      ringRef.current.scale.setScalar(1.0 + Math.sin(time * 1.5) * 0.03);
    }
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.03;
      groupRef.current.visible = state.camera.position.z > -25;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Volumetric starfield nebula */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.25}
          vertexColors
          map={particleTexture}
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Futuristic central glowing portal ring */}
      <mesh ref={ringRef} position={[0, 0, -2]}>
        <ringGeometry args={[2.8, 2.9, 64]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.25}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Navigation aid */}
      <Text
        position={[0, -2.0, 0]}
        fontSize={0.16}
        color="#4b5563"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        SCROLL TO INIT TRANSMISSION
      </Text>
    </group>
  );
}
