'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface ProjectsDimensionProps {
  position: [number, number, number];
  onSelectProject: (project: ProjectData) => void;
}

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  color: string;
  demoUrl: string;
}

export default function ProjectsDimension({ position, onSelectProject }: ProjectsDimensionProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const camZ = state.camera.position.z;
    if (groupRef.current) {
      // Set proximity visibility (ProjectsDimension is at Z = -75)
      groupRef.current.visible = camZ <= -35 && camZ > -100;
    }
  });

  const projects: ProjectData[] = [
    {
      id: 'bi-dashboard',
      title: 'BI Process Dashboard',
      category: 'Frontend & Analytics',
      description: 'A modern Business Intelligence platform designed to visualize and analyze complex business workflows, bottleneck tracking, drag-and-drop workflow adjustments, Recharts visualizations, and integrated AI insights.',
      tech: ['React.js', 'Redux Toolkit', 'Recharts', 'Firebase'],
      color: '#6366f1',
      demoUrl: 'https://drive.google.com/file/d/1HgY7zspeZM05IgtBCi_PThGgUByWJ599/view?usp=sharing',
    },
    {
      id: 'space-rental',
      title: 'Space Rental Platform',
      category: 'Full-Stack Marketplace',
      description: 'A PeerSpace-inspired space rental marketplace supporting admins, customers, and space owners. Features corporate-grade filters, multi-role user dashboards, in-app messaging, and a Django/PostgreSQL automated booking scheduler.',
      tech: ['React.js', 'Django API', 'PostgreSQL', 'REST APIs'],
      color: '#a855f7',
      demoUrl: 'https://drive.google.com/file/d/1KX7-xiyxmOTFoC1EbAWWzMxdV-IhxIxa/view?usp=sharing',
    },
    {
      id: 'afl-coach',
      title: 'AFL Coach Assistant',
      category: 'Cross-Platform Mobile',
      description: 'A tactical tablet and mobile app built using React Native and TypeScript for live match analysis. Supports interactive game-event logging, real-time heat maps, and background synchronization to a remote VPS.',
      tech: ['React Native', 'TypeScript', 'Heat Maps', 'VPS State Sync'],
      color: '#10b981',
      demoUrl: 'https://drive.google.com/file/d/1v73jetF5sXyiQpU8u3ogTizVDoL7hUzU/view?usp=sharing',
    },
  ];

  return (
    <group ref={groupRef} position={position}>
      {projects.map((project, idx) => {
        // Spread cards out in a diagonal-depth pattern
        const cardPos: [number, number, number] = [
          (idx - 1) * 3.8, // X: left, middle, right
          idx % 2 === 0 ? 0.4 : -0.6, // Y: offset heights
          (idx - 1) * -1.5, // Z: slight offset for layering
        ];

        return (
          <ProjectCard
            key={project.id}
            project={project}
            position={cardPos}
            onSelect={() => onSelectProject(project)}
          />
        );
      })}

      <Text
        position={[0, 4.5, -4]}
        fontSize={1}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        PROJECTS DIMENSION
      </Text>
    </group>
  );
}

interface ProjectCardProps {
  project: ProjectData;
  position: [number, number, number];
  onSelect: () => void;
}

function ProjectCard({ project, position, onSelect }: ProjectCardProps) {
  const cardRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Load project image texture using Drei's useTexture hook
  const texture = useTexture(
    project.id === 'bi-dashboard' ? '/dashboard.png' :
    project.id === 'space-rental' ? '/marketplace.png' :
    '/afl_tactics.png'
  );

  // Smooth tilt calculations
  useFrame((state) => {
    if (cardRef.current) {
      // Idle float animation
      const idleY = Math.sin(state.clock.getElapsedTime() + project.title.length) * 0.08;
      cardRef.current.position.y = position[1] + idleY;

      // Handle hover rotation tilt towards mouse slightly
      const targetRotationY = hovered ? (state.pointer.x * 0.2) : 0;
      const targetRotationX = hovered ? (-state.pointer.y * 0.2) : 0;
      
      cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, targetRotationY, 0.1);
      cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, targetRotationX, 0.1);
      
      // Hover scale
      const targetScale = hovered ? 1.05 : 1.0;
      cardRef.current.scale.setScalar(THREE.MathUtils.lerp(cardRef.current.scale.x, targetScale, 0.1));
    }
  });

  return (
    <group
      ref={cardRef}
      position={[position[0], position[1], position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Glass Card Mesh */}
      <mesh>
        <planeGeometry args={[3.2, 4.2]} />
        <meshPhysicalMaterial
          roughness={0.15}
          metalness={0.1}
          transmission={0.6} // Translucency
          thickness={1.5} // Refraction thickness
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.8}
          color="#0d0d15"
        />
      </mesh>

      {/* Screen Screenshot Plane inside glass card */}
      <mesh position={[0, 0.9, 0.03]}>
        <planeGeometry args={[2.8, 1.6]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {/* Thin Colored Border Indicator */}
      <mesh position={[0, 2.05, 0.01]}>
        <planeGeometry args={[3.2, 0.08]} />
        <meshBasicMaterial color={project.color} />
      </mesh>

      {/* Project Card Text Content - adjusted downwards to make room for screenshot */}
      <Text
        position={[-1.3, -0.1, 0.02]}
        fontSize={0.14}
        color={project.color}
        anchorX="left"
        anchorY="middle"
      >
        {project.category.toUpperCase()}
      </Text>

      <Text
        position={[-1.3, -0.3, 0.02]}
        fontSize={0.24}
        color="#ffffff"
        anchorX="left"
        anchorY="top"
        maxWidth={2.6}
      >
        {project.title}
      </Text>

      <Text
        position={[-1.3, -0.9, 0.02]}
        fontSize={0.14}
        color="#9ca3af"
        anchorX="left"
        anchorY="top"
        maxWidth={2.6}
        lineHeight={1.4}
      >
        {project.description.slice(0, 100) + '...'}
      </Text>

      {/* Tech badges inline row */}
      <Text
        position={[-1.3, -1.7, 0.02]}
        fontSize={0.12}
        color="#6366f1"
        anchorX="left"
        anchorY="middle"
        maxWidth={2.6}
      >
        {project.tech.join('  •  ')}
      </Text>

      {/* Button visual */}
      <mesh position={[0, -1.95, 0.01]}>
        <planeGeometry args={[2.8, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
