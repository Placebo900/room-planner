import React from 'react';
import type { Furniture } from '../../types/editor';

interface Furniture3DProps {
  furniture: Furniture;
  isSelected: boolean;
}

export const Furniture3D: React.FC<Furniture3DProps> = ({ furniture, isSelected }) => {
  // Convert position from pixels to meters
  const x = furniture.position.x * 0.01;
  const z = furniture.position.y * 0.01;
  
  // Furniture dimensions are in millimeters, convert to meters
  const width = (furniture.dimensions.width || 500) / 1000;  // mm to meters
  const depth = (furniture.dimensions.height || 500) / 1000; // mm to meters (using height as depth)
  const height = 0.8; // Default furniture height 80cm
  
  // Position furniture with bottom on ground
  const y = height / 2;
  
  return (
    <mesh
      position={[x, y, z]}
      rotation={[0, -furniture.rotation, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial
        color={isSelected ? '#8b5cf6' : '#4A5568'}
        roughness={0.6}
        metalness={0.3}
      />
    </mesh>
  );
};

