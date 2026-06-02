'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

interface CloudInfrastructureProps {
  position: [number, number, number];
}

interface InfraNode {
  id: string;
  name: string;
  type: string;
  pos: THREE.Vector3;
  color: string;
}

export default function CloudInfrastructure({ position }: CloudInfrastructureProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Architecture Nodes definition
  const nodes: InfraNode[] = useMemo(() => [
    { id: 'client', name: 'Web Client', type: 'Frontend', pos: new THREE.Vector3(-3.5, 0.5, 0), color: '#6366f1' },
    { id: 'gateway', name: 'API Gateway', type: 'Gateway', pos: new THREE.Vector3(-1.0, 0.5, 0), color: '#a855f7' },
    { id: 'service', name: 'App Logic', type: 'Microservice', pos: new THREE.Vector3(1.5, 1.5, -0.5), color: '#10b981' },
    { id: 'database', name: 'Postgres DB', type: 'Database', pos: new THREE.Vector3(4.0, 0.5, -1.0), color: '#ffcc00' },
    { id: 'cache', name: 'Redis Cache', type: 'Cache', pos: new THREE.Vector3(1.5, -0.5, 0.5), color: '#ef4444' },
  ], []);

  // Connection links (source -> target)
  const links = useMemo(() => [
    { from: 'client', to: 'gateway' },
    { from: 'gateway', to: 'service' },
    { from: 'gateway', to: 'cache' },
    { from: 'service', to: 'database' },
    { from: 'service', to: 'cache' },
  ], []);

  // Data packets flowing along the paths
  const packets = useMemo(() => [
    { from: 'client', to: 'gateway', speed: 0.8, offset: 0.0, color: '#6366f1' },
    { from: 'gateway', to: 'service', speed: 1.0, offset: 0.3, color: '#a855f7' },
    { from: 'gateway', to: 'cache', speed: 1.2, offset: 0.6, color: '#ef4444' },
    { from: 'service', to: 'database', speed: 0.7, offset: 0.1, color: '#10b981' },
  ], []);

  const packetRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const camZ = state.camera.position.z;

    // Rotate infrastructure setup slightly for a 3D parallax feel
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1;
      // Set proximity visibility (CloudInfrastructure is at Z = -125)
      groupRef.current.visible = camZ <= -85 && camZ > -150;
    }

    // Animate data packets moving along paths
    packets.forEach((packet, idx) => {
      const mesh = packetRefs.current[idx];
      if (mesh) {
        // Find positions
        const sourceNode = nodes.find((n) => n.id === packet.from);
        const targetNode = nodes.find((n) => n.id === packet.to);
        
        if (sourceNode && targetNode) {
          // Calculate path progress
          const progress = ((time * packet.speed + packet.offset) % 1.0);
          
          // Lerp position along the link path
          mesh.position.lerpVectors(sourceNode.pos, targetNode.pos, progress);
          
          // Pulse scale
          const pulse = 0.08 + Math.sin(time * 10) * 0.02;
          mesh.scale.setScalar(pulse);
        }
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Draw Connection Lines */}
      {links.map((link, idx) => {
        const fromNode = nodes.find((n) => n.id === link.from);
        const toNode = nodes.find((n) => n.id === link.to);
        
        if (!fromNode || !toNode) return null;
        
        return (
          <Line
            key={idx}
            points={[fromNode.pos, toNode.pos]}
            color="#ffffff"
            lineWidth={1.5}
            transparent
            opacity={0.2}
          />
        );
      })}

      {/* Render Infrastructure Nodes */}
      {nodes.map((node) => (
        <group key={node.id} position={node.pos}>
          {/* Node Cube/Sphere */}
          <mesh>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.4}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Glowing outer wireframe shell */}
          <mesh scale={[1.15, 1.15, 1.15]}>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshBasicMaterial
              color={node.color}
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>

          {/* Node metadata texts */}
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.22}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {node.name}
          </Text>

          <Text
            position={[0, -0.7, 0]}
            fontSize={0.15}
            color="#9ca3af"
            anchorX="center"
            anchorY="middle"
          >
            {node.type.toUpperCase()}
          </Text>
        </group>
      ))}

      {/* Render Animated Data Packets */}
      {packets.map((packet, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            if (el) packetRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={packet.color}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      <Text
        position={[0, 4.5, -4]}
        fontSize={1}
        color="#a855f7"
        anchorX="center"
        anchorY="middle"
      >
        CLOUD INFRASTRUCTURE
      </Text>
    </group>
  );
}
