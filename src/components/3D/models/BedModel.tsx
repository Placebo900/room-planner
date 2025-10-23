import React from 'react';
import * as THREE from 'three';

interface BedModelProps {
  width: number;  // meters
  depth: number;  // meters
  isSelected: boolean;
}

export const BedModel: React.FC<BedModelProps> = ({ width, depth, isSelected }) => {
  // Colors
  const frameColor = isSelected ? '#8b5cf6' : '#8B4513'; // Brown
  const mattressColor = isSelected ? '#9333ea' : '#E8E8E8'; // Light gray
  const pillowColor = '#FFFFFF';
  const blanketColor = isSelected ? '#a855f7' : '#87CEEB'; // Light blue
  
  // Dimensions
  const bedHeight = 0.5; // Total bed height
  const frameHeight = 0.15; // Frame height
  const mattressHeight = 0.25; // Mattress thickness
  const headboardHeight = 0.8; // Headboard height
  const headboardThickness = 0.05;
  const legSize = 0.05;
  const pillowHeight = 0.15;
  const pillowDepth = 0.3;
  
  return (
    <group>
      {/* Bed frame base */}
      <mesh position={[0, frameHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, frameHeight, depth]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      
      {/* Mattress */}
      <mesh position={[0, frameHeight + mattressHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width * 0.95, mattressHeight, depth * 0.95]} />
        <meshStandardMaterial color={mattressColor} roughness={0.7} />
      </mesh>
      
      {/* Blanket (decorative layer on mattress) */}
      <mesh 
        position={[0, frameHeight + mattressHeight + 0.02, depth * 0.1]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width * 0.9, 0.05, depth * 0.7]} />
        <meshStandardMaterial color={blanketColor} roughness={0.6} />
      </mesh>
      
      {/* Pillows (2 pillows at head) */}
      <mesh 
        position={[-width * 0.2, frameHeight + mattressHeight + pillowHeight / 2, -depth * 0.35]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width * 0.35, pillowHeight, pillowDepth]} />
        <meshStandardMaterial color={pillowColor} roughness={0.5} />
      </mesh>
      
      <mesh 
        position={[width * 0.2, frameHeight + mattressHeight + pillowHeight / 2, -depth * 0.35]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width * 0.35, pillowHeight, pillowDepth]} />
        <meshStandardMaterial color={pillowColor} roughness={0.5} />
      </mesh>
      
      {/* Headboard */}
      <mesh 
        position={[0, headboardHeight / 2, -depth / 2 - headboardThickness / 2]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width, headboardHeight, headboardThickness]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      
      {/* Legs (4 corners) */}
      {[
        [-width / 2 + legSize, legSize / 2, -depth / 2 + legSize],
        [width / 2 - legSize, legSize / 2, -depth / 2 + legSize],
        [-width / 2 + legSize, legSize / 2, depth / 2 - legSize],
        [width / 2 - legSize, legSize / 2, depth / 2 - legSize],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[legSize, frameHeight, legSize]} />
          <meshStandardMaterial color={frameColor} roughness={0.9} />
        </mesh>
      ))}
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments position={[0, bedHeight / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(width, bedHeight, depth)]} />
          <lineBasicMaterial color="#fbbf24" linewidth={3} />
        </lineSegments>
      )}
    </group>
  );
};

