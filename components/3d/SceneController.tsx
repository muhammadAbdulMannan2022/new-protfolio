'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createSoftParticleTexture } from './utils';

import HeroScene from './HeroScene';
import CloudScene from './CloudScene';
import SkillsGalaxy from './SkillsGalaxy';
import ProjectsDimension, { ProjectData } from './ProjectsDimension';
import AppShowcase from './AppShowcase';
import CloudInfrastructure from './CloudInfrastructure';
import ContactScene from './ContactScene';

export default function SceneController({ onSelectProject }: { onSelectProject: (project: ProjectData) => void }) {
  const { camera } = useThree();
  const scrollProgress = useRef(0);
  
  const pointsRef = useRef<THREE.Points>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  const particleTexture = useMemo(() => createSoftParticleTexture(), []);

  // Track scroll progress of the window
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const progress = window.scrollY / totalHeight;
      scrollProgress.current = progress;
      
      // Dispatch a custom window event for the HTML overlay triggers
      window.dispatchEvent(new CustomEvent('portfolio-scroll', { detail: { progress } }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate 600 soft stars along the Z corridor (low count = ultra high performance!)
  const starCount = 600;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  useMemo(() => {
    const colorPalette = [
      new THREE.Color('#6366f1'), // Indigo
      new THREE.Color('#a855f7'), // Purple
      new THREE.Color('#4f46e5'), // Dark Blue
      new THREE.Color('#ffffff'), // White
    ];

    for (let i = 0; i < starCount; i++) {
      // Cylinder distribution along Z corridor from Z = 20 down to Z = -180
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 12 + 1.5;
      const z = (Math.random() - 0.5) * 200 - 80;

      starPositions[i * 3] = Math.cos(theta) * radius;
      starPositions[i * 3 + 1] = Math.sin(theta) * radius;
      starPositions[i * 3 + 2] = z;

      // Color palette mapping
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }
  }, []);

  // Ring gates placement along Z axis
  const ringZPositions = [-20, -50, -80, -110, -140, -170];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Smoothly camera Z movement
    // camera starts at Z = 5 and moves to Z = -165 (passing each scene at Z = 0, -25, -50, -75, -100, -125, -150)
    const targetZ = 5 - scrollProgress.current * 170;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    // 2. Center camera X with pointer parallax drift
    const targetX = state.pointer.x * 0.7;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);

    const driftY = state.pointer.y * 0.4;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, driftY, 0.05);

    // 3. Keep camera looking straight down the corridor parallel to the Z axis
    camera.lookAt(new THREE.Vector3(camera.position.x, camera.position.y * 0.5, camera.position.z - 10));

    // 4. Animate starfield and ring gates
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.01;
    }

    if (ringsRef.current) {
      ringsRef.current.children.forEach((child, idx) => {
        child.rotation.z = time * 0.05 * (idx % 2 === 0 ? 1 : -1);
        // Pulse size
        const scale = 1.0 + Math.sin(time * 1.5 + idx) * 0.03;
        child.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <>
      {/* High-Performance background starfield */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[starColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          vertexColors
          map={particleTexture}
          sizeAttenuation
          transparent
          opacity={0.65}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Rotating Ring Gates corridor */}
      <group ref={ringsRef}>
        {ringZPositions.map((z, idx) => (
          <group key={idx} position={[0, 0, z]}>
            {/* Outer Ring */}
            <mesh>
              <ringGeometry args={[3.2, 3.25, 64]} />
              <meshBasicMaterial
                color={idx % 2 === 0 ? '#6366f1' : '#a855f7'}
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            {/* Inner Ring */}
            <mesh scale={[0.95, 0.95, 0.95]}>
              <ringGeometry args={[3.2, 3.22, 32]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.08}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Volumetric Transition Clouds */}
      {[-12.5, -37.5, -62.5, -87.5, -112.5, -137.5].map((z, idx) => (
        <TransitionCloud key={idx} position={[0, 0, z]} />
      ))}

      {/* Spaced 3D Scenes Corridor */}
      <HeroScene position={[0, 0, 0]} />
      <CloudScene position={[0, 0, -25]} />
      <SkillsGalaxy position={[0, 0, -50]} />
      <ProjectsDimension position={[0, 0, -75]} onSelectProject={onSelectProject} />
      <AppShowcase position={[0, 0, -100]} />
      <CloudInfrastructure position={[0, 0, -125]} />
      <ContactScene position={[0, 0, -150]} />
    </>
  );
}

interface TransitionCloudProps {
  position: [number, number, number];
}

function TransitionCloud({ position }: TransitionCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleTexture = useMemo(() => createSoftParticleTexture(), []);

  // Generate 80 dense wisp particles clustered tightly in the corridor center
  const count = 80;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 4.5;
      const z = (Math.random() - 0.5) * 3;
      arr[i * 3] = Math.cos(theta) * radius;
      arr[i * 3 + 1] = Math.sin(theta) * radius;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Soft purple/indigo color tones matching global scene color palette
      arr[i * 3] = 0.45 + Math.random() * 0.15;
      arr[i * 3 + 1] = 0.35 + Math.random() * 0.15;
      arr[i * 3 + 2] = 0.9;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.z = time * 0.03;
      const dist = Math.abs(state.camera.position.z - position[2]);
      if (pointsRef.current.material instanceof THREE.PointsMaterial) {
        // Volumetric fade: thickest when camera moves through it (dist < 12)
        pointsRef.current.material.opacity = dist < 12 ? (1.0 - dist / 12) * 0.45 : 0;
      }
    }
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={3.2}
        vertexColors
        map={particleTexture}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
