'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { createSoftParticleTexture } from './utils';

interface CloudSceneProps {
  position: [number, number, number];
}

export default function CloudScene({ position }: CloudSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudPointsRef = useRef<THREE.Points>(null);

  const particleTexture = useMemo(() => createSoftParticleTexture(), []);

  // Generate 1200 wispy cloud dust particles
  const cloudParticleCount = 1200;
  const cloudPositions = new Float32Array(cloudParticleCount * 3);
  const cloudColors = new Float32Array(cloudParticleCount * 3);

  useMemo(() => {
    // Generate cluster coordinates centered around the middle corridor
    for (let i = 0; i < cloudParticleCount; i++) {
      // Gaussian distribution for natural wispiness
      const x = (Math.random() - 0.5) * 16 + (Math.random() - 0.5) * 6;
      const y = (Math.random() - 0.5) * 10 + (Math.random() - 0.5) * 4;
      const z = (Math.random() - 0.5) * 20;

      cloudPositions[i * 3] = x;
      cloudPositions[i * 3 + 1] = y;
      cloudPositions[i * 3 + 2] = z;

      // Soft purple/blue color values
      cloudColors[i * 3] = 0.5 + Math.random() * 0.2; // R
      cloudColors[i * 3 + 1] = 0.3 + Math.random() * 0.2; // G
      cloudColors[i * 3 + 2] = 0.9; // B
    }
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const camZ = state.camera.position.z;
    if (cloudPointsRef.current) {
      // Gentle breathing/swirling motion of the cloud
      cloudPointsRef.current.rotation.z = time * 0.01;
      cloudPointsRef.current.position.y = Math.sin(time * 0.4) * 0.15;
    }
    if (groupRef.current) {
      // Set proximity visibility (Cloud is at Z = -25)
      groupRef.current.visible = camZ <= 15 && camZ > -50;

      // Gentle float of text groups
      groupRef.current.children.forEach((child, index) => {
        if (child.name === 'skill-node') {
          child.position.y += Math.sin(time * 0.8 + index) * 0.003;
        }
      });
    }
  });

  const skills = [
    { name: 'React.js', pos: [-4.2, 1.8, 2] },
    { name: 'Next.js', pos: [3.5, 2.5, -1] },
    { name: 'Node.js', pos: [-4.5, -2.0, -3] },
    { name: 'Express.js', pos: [4.0, -1.2, 3] },
    { name: 'Rust', pos: [0, 3.2, 1] },
    { name: 'PostgreSQL', pos: [-1.2, -2.8, 0] },
  ];

  return (
    <group ref={groupRef} position={position}>
      {/* Volumetric cloud of soft, overlapping particles */}
      <points ref={cloudPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cloudPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[cloudColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={1.8} // Large soft billboards that blend together
          vertexColors
          map={particleTexture}
          sizeAttenuation
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating Cloud Skill Titles */}
      {skills.map((skill, idx) => (
        <group key={idx} name="skill-node" position={skill.pos as [number, number, number]}>
          <Text
            fontSize={0.42}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {skill.name}
          </Text>
          {/* Glass background plate */}
          <mesh position={[0, 0, -0.1]}>
            <planeGeometry args={[skill.name.length * 0.24 + 0.5, 0.7]} />
            <meshPhysicalMaterial
              roughness={0.1}
              metalness={0.1}
              transmission={0.6}
              transparent
              opacity={0.3}
              color="#0d0d15"
            />
          </mesh>
        </group>
      ))}

      <Text
        position={[0, 4.5, -4]}
        fontSize={1}
        color="#a855f7"
        anchorX="center"
        anchorY="middle"
      >
        CLOUD LAYER
      </Text>
    </group>
  );
}
