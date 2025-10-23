import React from 'react';
import * as THREE from 'three';

interface SofaModelProps {
  width: number;  // meters
  depth: number;  // meters
  isSelected: boolean;
}

export const SofaModel: React.FC<SofaModelProps> = ({ width, depth, isSelected }) => {
  // Colors
  const fabricColor = isSelected ? '#8b5cf6' : '#4A5568'; // Gray fabric
  const cushionColor = isSelected ? '#9333ea' : '#5A6978';
  const frameColor = isSelected ? '#7c3aed' : '#2D3748';
  
  // Dimensions
  const baseHeight = 0.15;
  const seatHeight = 0.4;
  const seatDepth = depth * 0.6;
  const backrestHeight = 0.6;
  const backrestThickness = 0.15;
  const armrestWidth = 0.15;
  const armrestHeight = 0.2; // Height above seat
  const cushionThickness = 0.15;
  
  return (
    <group>
      {/* Base/Frame */}
      <mesh position={[0, baseHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, baseHeight, depth]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      
      {/* Main seat cushion */}
      <mesh 
        position={[0, baseHeight + cushionThickness / 2, depth * 0.05]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width - 2 * armrestWidth - 0.05, cushionThickness, seatDepth]} />
        <meshStandardMaterial color={cushionColor} roughness={0.6} />
      </mesh>
      
      {/* Backrest */}
      <mesh 
        position={[0, baseHeight + seatHeight + backrestHeight / 2, -depth / 2 + backrestThickness / 2]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width - 2 * armrestWidth - 0.05, backrestHeight, backrestThickness]} />
        <meshStandardMaterial color={fabricColor} roughness={0.7} />
      </mesh>
      
      {/* Back cushions (3 sections) */}
      {[-width * 0.25, 0, width * 0.25].map((xPos, idx) => (
        <mesh 
          key={`back-cushion-${idx}`}
          position={[xPos, baseHeight + seatHeight + backrestHeight * 0.3, -depth / 2 + backrestThickness + 0.05]} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[width * 0.28, backrestHeight * 0.5, 0.1]} />
          <meshStandardMaterial color={cushionColor} roughness={0.5} />
        </mesh>
      ))}
      
      {/* Left armrest */}
      <mesh 
        position={[-width / 2 + armrestWidth / 2, baseHeight + seatHeight + armrestHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[armrestWidth, seatHeight + armrestHeight, depth * 0.85]} />
        <meshStandardMaterial color={fabricColor} roughness={0.7} />
      </mesh>
      
      {/* Right armrest */}
      <mesh 
        position={[width / 2 - armrestWidth / 2, baseHeight + seatHeight + armrestHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[armrestWidth, seatHeight + armrestHeight, depth * 0.85]} />
        <meshStandardMaterial color={fabricColor} roughness={0.7} />
      </mesh>
      
      {/* Armrest cushions (soft top) */}
      <mesh 
        position={[-width / 2 + armrestWidth / 2, baseHeight + seatHeight + armrestHeight + 0.03, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[armrestWidth - 0.02, 0.06, depth * 0.8]} />
        <meshStandardMaterial color={cushionColor} roughness={0.5} />
      </mesh>
      
      <mesh 
        position={[width / 2 - armrestWidth / 2, baseHeight + seatHeight + armrestHeight + 0.03, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[armrestWidth - 0.02, 0.06, depth * 0.8]} />
        <meshStandardMaterial color={cushionColor} roughness={0.5} />
      </mesh>
      
      {/* Legs (4 corners, small) */}
      {[
        [-width / 2 + 0.1, baseHeight / 4, -depth / 2 + 0.1],
        [width / 2 - 0.1, baseHeight / 4, -depth / 2 + 0.1],
        [-width / 2 + 0.1, baseHeight / 4, depth / 2 - 0.1],
        [width / 2 - 0.1, baseHeight / 4, depth / 2 - 0.1],
      ].map((pos, idx) => (
        <mesh key={`leg-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, baseHeight / 2, 8]} />
          <meshStandardMaterial color={frameColor} roughness={0.9} metalness={0.3} />
        </mesh>
      ))}
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments position={[0, (baseHeight + seatHeight + backrestHeight) / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(width, baseHeight + seatHeight + backrestHeight, depth)]} />
          <lineBasicMaterial color="#fbbf24" linewidth={3} />
        </lineSegments>
      )}
    </group>
  );
};

