'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { createSoftParticleTexture } from './utils';

interface SkillsGalaxyProps {
  position: [number, number, number];
}

interface SkillNode {
  name: string;
  angle: number;
  radius: number;
  speed: number;
  color: string;
  yOffset: number;
}

export default function SkillsGalaxy({ position }: SkillsGalaxyProps) {
  const groupRef = useRef<THREE.Group>(null);
  const galaxyPointsRef = useRef<THREE.Points>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [rotationSpeedMultiplier, setRotationSpeedMultiplier] = useState(1);

  const particleTexture = useMemo(() => createSoftParticleTexture(), []);

  // Define skills categories orbiting
  const skillsData: SkillNode[] = useMemo(() => [
    // Ring 1: Frontend (Radius 3.5)
    { name: 'React', angle: 0, radius: 3.5, speed: 0.22, color: '#61dafb', yOffset: 0.3 },
    { name: 'TypeScript', angle: Math.PI * 0.66, radius: 3.5, speed: 0.22, color: '#3178c6', yOffset: -0.2 },
    { name: 'Tailwind CSS', angle: Math.PI * 1.33, radius: 3.5, speed: 0.22, color: '#38bdf8', yOffset: 0.4 },

    // Ring 2: Backend (Radius 5)
    { name: 'NodeJS', angle: Math.PI * 0.25, radius: 5.0, speed: -0.16, color: '#68a063', yOffset: 0.6 },
    { name: 'ExpressJS', angle: Math.PI * 0.75, radius: 5.0, speed: -0.16, color: '#a855f7', yOffset: -0.5 },
    { name: 'Rust', angle: Math.PI * 1.25, radius: 5.0, speed: -0.16, color: '#ff5722', yOffset: 0.2 },
    { name: 'WebSockets', angle: Math.PI * 1.75, radius: 5.0, speed: -0.16, color: '#00bcd4', yOffset: -0.4 },

    // Ring 3: Tools / Deployment (Radius 6.5)
    { name: 'Docker', angle: Math.PI * 0.1, radius: 6.5, speed: 0.12, color: '#2496ed', yOffset: 0.3 },
    { name: 'VPS Linux', angle: Math.PI * 0.6, radius: 6.5, speed: 0.12, color: '#f57c00', yOffset: -0.7 },
    { name: 'Firebase', angle: Math.PI * 1.1, radius: 6.5, speed: 0.12, color: '#ffca28', yOffset: 0.5 },
    { name: 'Git', angle: Math.PI * 1.6, radius: 6.5, speed: 0.12, color: '#f05032', yOffset: -0.3 },

    // Ring 4: Mobile & State (Radius 8)
    { name: 'React Native', angle: Math.PI * 0.33, radius: 8.0, speed: -0.09, color: '#61dafb', yOffset: 0.7 },
    { name: 'Expo', angle: Math.PI * 1.0, radius: 8.0, speed: -0.09, color: '#ffffff', yOffset: -0.8 },
    { name: 'Redux Toolkit', angle: Math.PI * 1.66, radius: 8.0, speed: -0.09, color: '#764abc', yOffset: 0.2 },
  ], []);

  // Track angles and animate orbits
  const anglesRef = useRef(skillsData.map((s) => s.angle));

  // Generate 2,000 galaxy dust particles forming a spiral galaxy structure
  const dustParticleCount = 2000;
  const dustPositions = new Float32Array(dustParticleCount * 3);
  const dustColors = new Float32Array(dustParticleCount * 3);

  useMemo(() => {
    for (let i = 0; i < dustParticleCount; i++) {
      // Create spiral arms
      const arm = i % 2; // Two main spiral arms
      const radius = Math.pow(Math.random(), 1.5) * 9.5 + 0.5; // Concentrated near center
      const angle = radius * 0.8 + (arm * Math.PI) + (Math.random() - 0.5) * 0.45; // Spiral curve
      
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * (1.2 - radius * 0.08); // Thin plane thickness
      const z = Math.sin(angle) * radius;

      dustPositions[i * 3] = x;
      dustPositions[i * 3 + 1] = y;
      dustPositions[i * 3 + 2] = z;

      // Color transition from core (white-yellow) to arms (indigo-purple)
      const color = new THREE.Color();
      if (radius < 2) {
        color.setHSL(0.75 + radius * 0.05, 0.9, 0.7 + Math.random() * 0.3); // Core glow
      } else {
        color.setHSL(0.68 + Math.random() * 0.1, 0.9, 0.4 + Math.random() * 0.2); // Purple-indigo arms
      }
      dustColors[i * 3] = color.r;
      dustColors[i * 3 + 1] = color.g;
      dustColors[i * 3 + 2] = color.b;
    }
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const camZ = state.camera.position.z;
    
    // Slow down rotation on hover
    const targetMultiplier = hoveredSkill ? 0.1 : 1.0;
    setRotationSpeedMultiplier((prev) => THREE.MathUtils.lerp(prev, targetMultiplier, 0.05));

    // Rotate galaxy dust
    if (galaxyPointsRef.current) {
      galaxyPointsRef.current.rotation.y = time * 0.08 * rotationSpeedMultiplier;
    }

    if (groupRef.current) {
      // Set proximity visibility (SkillsGalaxy is at Z = -50)
      groupRef.current.visible = camZ <= -10 && camZ > -75;

      const children = groupRef.current.children;
      // Skip the central group, the 4 lines, and the points (Offset = 6)
      const nodeOffset = 6;

      skillsData.forEach((skill, index) => {
        anglesRef.current[index] += skill.speed * delta * rotationSpeedMultiplier;
        
        const x = Math.cos(anglesRef.current[index]) * skill.radius;
        const z = Math.sin(anglesRef.current[index]) * skill.radius;

        const nodeGroup = children[nodeOffset + index];
        if (nodeGroup) {
          nodeGroup.position.x = x;
          nodeGroup.position.z = z;
          
          // Subtle hover float
          const hoverOffset = hoveredSkill === skill.name ? Math.sin(time * 5) * 0.08 : 0;
          nodeGroup.position.y = skill.yOffset + hoverOffset;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Central Galaxy Core Glow */}
      <group position={[0, -0.2, 0]}>
        <mesh>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#a855f7"
            emissiveIntensity={1.2}
            roughness={0.05}
          />
        </mesh>
        <mesh scale={[1.4, 1.4, 1.4]}>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.15} wireframe />
        </mesh>
        <Text
          position={[0, 1.3, 0]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          CORE
        </Text>
      </group>

      {/* Orbit paths - Subtle transparent blue rings */}
      {[3.5, 5.0, 6.5, 8.0].map((radius, idx) => (
        <Line
          key={idx}
          points={Array.from({ length: 65 }, (_, i) => {
            const angle = (i / 64) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
          })}
          color="#6366f1"
          lineWidth={0.8}
          transparent
          opacity={0.12}
        />
      ))}

      {/* Spiral Galaxy Dust layer */}
      <points ref={galaxyPointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[dustColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          vertexColors
          map={particleTexture}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Orbiting Skill Nodes */}
      {skillsData.map((skill, index) => {
        const isHovered = hoveredSkill === skill.name;
        return (
          <group
            key={index}
            name={`node-${skill.name}`}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredSkill(skill.name);
            }}
            onPointerOut={(e) => {
              setHoveredSkill(null);
            }}
          >
            {/* Planet Sphere Core */}
            <mesh scale={isHovered ? [0.42, 0.42, 0.42] : [0.28, 0.28, 0.28]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial
                color={skill.color}
                emissive={skill.color}
                emissiveIntensity={isHovered ? 1.6 : 0.6}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>

            {/* Glowing outer orbit halo */}
            <mesh scale={isHovered ? [0.55, 0.55, 0.55] : [0.4, 0.4, 0.4]}>
              <sphereGeometry args={[1, 12, 12]} />
              <meshBasicMaterial
                color={skill.color}
                wireframe
                transparent
                opacity={isHovered ? 0.35 : 0.12}
              />
            </mesh>

            {/* Node Name */}
            <Text
              position={[0, 0.6, 0]}
              fontSize={0.28}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              fillOpacity={isHovered ? 1.0 : 0.75}
            >
              {skill.name}
            </Text>
          </group>
        );
      })}

      <Text
        position={[0, 4.5, -4]}
        fontSize={1}
        color="#6366f1"
        anchorX="center"
        anchorY="middle"
      >
        SKILLS NEBULA
      </Text>
    </group>
  );
}
