'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AppShowcaseProps {
  position: [number, number, number];
}

export default function AppShowcase({ position }: AppShowcaseProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load the screenshots as textures
  const aflTexture = useTexture('/afl_tactics.png');
  const marketTexture = useTexture('/marketplace.png');

  useFrame((state) => {
    const camZ = state.camera.position.z;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.15;
      // Set proximity visibility (AppShowcase is at Z = -100)
      groupRef.current.visible = camZ <= -60 && camZ > -125;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Phone 1: AFL Match Tactics App */}
      <PhoneModel
        position={[-2.3, 0.1, 0]}
        rotation={[0.05, 0.45, -0.04]}
        title="AFL Coach Pro"
        color="#10b981"
        texture={aflTexture}
      />

      {/* Phone 2: Space Rental Platform App */}
      <PhoneModel
        position={[2.3, -0.1, -1]}
        rotation={[-0.05, -0.45, 0.04]}
        title="Space Rental App"
        color="#a855f7"
        texture={marketTexture}
      />

      <Text
        position={[0, 4.5, -4]}
        fontSize={1}
        color="#a855f7"
        anchorX="center"
        anchorY="middle"
      >
        APP SHOWCASE
      </Text>
    </group>
  );
}

interface PhoneModelProps {
  position: [number, number, number];
  rotation: [number, number, number];
  title: string;
  color: string;
  texture: THREE.Texture;
}

function PhoneModel({ position, rotation, title, color, texture }: PhoneModelProps) {
  const phoneRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Load the iPhone model from the public folder
  const { scene } = useGLTF('/iphone.glb');

  // Clone the scene and apply the dynamic screenshot texture to the screen mesh
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // Check if this mesh is the screen (node name contains 'scr')
        if (mesh.name.toLowerCase().includes('scr') || mesh.name.toLowerCase().includes('screen')) {
          mesh.material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
          });
        }
      }
    });
    return clone;
  }, [scene, texture]);

  useFrame((state) => {
    if (phoneRef.current && !hovered) {
      // Subtle float and rotation
      phoneRef.current.rotation.y = rotation[1] + Math.sin(state.clock.getElapsedTime() * 1.2 + position[0]) * 0.05;
      phoneRef.current.rotation.x = rotation[0] + Math.cos(state.clock.getElapsedTime() * 0.8) * 0.03;
    }
  });

  return (
    <group
      ref={phoneRef}
      position={position}
      rotation={rotation}
      scale={[3.2, 3.2, 3.2]} // Sized to fit perfectly in viewport
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
      {/* 3D iPhone Model primitive */}
      <primitive object={clonedScene} />

      {/* Active Glowing Screen Indicator under the phone */}
      <Text
        position={[0, -2.8, 0]}
        fontSize={0.28}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </group>
  );
}

// Preload the model to avoid pop-in latency
useGLTF.preload('/iphone.glb');
