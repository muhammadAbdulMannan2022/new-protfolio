'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface ContactSceneProps {
  position: [number, number, number];
}

export default function ContactScene({ position }: ContactSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const portalRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const camZ = state.camera.position.z;

    if (groupRef.current) {
      // Set proximity visibility (ContactScene is at Z = -150)
      groupRef.current.visible = camZ <= -110;
    }

    if (portalRef.current) {
      portalRef.current.rotation.z = time * 0.2;
      portalRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
    if (coreRef.current) {
      // Glow pulse scale
      const scale = 1.0 + Math.sin(time * 3) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Abstract Exit Portal Ring */}
      <mesh ref={portalRef}>
        <torusGeometry args={[3, 0.15, 16, 100]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#a855f7"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Inner glowing core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Exit Grid Mesh */}
      <gridHelper
        args={[30, 30, '#6366f1', '#1f2937']}
        position={[0, -4, 0]}
        rotation={[0.1, 0, 0]}
      />

      <Text
        position={[0, 4.5, -4]}
        fontSize={1}
        color="#6366f1"
        anchorX="center"
        anchorY="middle"
      >
        PORTAL OUT
      </Text>
    </group>
  );
}
