'use client';

import * as THREE from 'three';

/**
 * Programmatically generates a soft, radial-gradient particle texture.
 * This prevents hard square edges on WebGL points, making them look like 
 * soft volumetric dust, glowing stars, or organic clouds.
 */
export function createSoftParticleTexture(): THREE.Texture {
  if (typeof window === 'undefined') return new THREE.Texture();

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
