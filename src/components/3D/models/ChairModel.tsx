import React from 'react';
import * as THREE from 'three';

interface ChairModelProps {
  width: number;  // meters
  depth: number;  // meters
  isSelected: boolean;
}

export const ChairModel: React.FC<ChairModelProps> = ({ width, depth, isSelected }) => {
  // Colors
  const seatColor = isSelected ? '#8b5cf6' : '#654321'; // Brown
  const frameColor = isSelected ? '#7c3aed' : '#4A3520'; // Darker brown
  
  // Dimensions
  const seatHeight = 0.45; // Standard seat height
  const seatThickness = 0.05;
  const backrestHeight = 0.5; // Height of backrest above seat
  const backrestThickness = 0.05;
  const legWidth = 0.04;
  const legHeight = seatHeight - seatThickness;
  
  // Calculate dimensions
  const seatWidth = Math.min(width, depth) * 0.9;
  const seatDepth = Math.min(width, depth) * 0.9;
  
  return (
    <group>
      {/* Seat */}
      <mesh 
        position={[0, seatHeight - seatThickness / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[seatWidth, seatThickness, seatDepth]} />
        <meshStandardMaterial 
          color={seatColor} 
          roughness={0.7}
        />
      </mesh>
      
      {/* Backrest */}
      <mesh 
        position={[0, seatHeight + backrestHeight / 2, -seatDepth / 2 + backrestThickness / 2]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[seatWidth * 0.9, backrestHeight, backrestThickness]} />
        <meshStandardMaterial color={seatColor} roughness={0.7} />
      </mesh>
      
      {/* Backrest support posts (2) */}
      {[
        [-seatWidth * 0.35, seatHeight + backrestHeight / 2, -seatDepth / 2 + legWidth / 2],
        [seatWidth * 0.35, seatHeight + backrestHeight / 2, -seatDepth / 2 + legWidth / 2],
      ].map((pos, idx) => (
        <mesh key={`post-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[legWidth, backrestHeight, legWidth]} />
          <meshStandardMaterial color={frameColor} roughness={0.8} />
        </mesh>
      ))}
      
      {/* Legs (4 corners) */}
      {[
        [-seatWidth / 2 + legWidth / 2, legHeight / 2, -seatDepth / 2 + legWidth / 2],
        [seatWidth / 2 - legWidth / 2, legHeight / 2, -seatDepth / 2 + legWidth / 2],
        [-seatWidth / 2 + legWidth / 2, legHeight / 2, seatDepth / 2 - legWidth / 2],
        [seatWidth / 2 - legWidth / 2, legHeight / 2, seatDepth / 2 - legWidth / 2],
      ].map((pos, idx) => (
        <mesh key={`leg-${idx}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[legWidth, legHeight, legWidth]} />
          <meshStandardMaterial color={frameColor} roughness={0.9} />
        </mesh>
      ))}
      
      {/* Cross braces for stability (optional detail) */}
      <mesh 
        position={[0, legHeight * 0.3, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[seatWidth * 0.8, legWidth * 0.6, legWidth * 0.6]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} />
      </mesh>
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments position={[0, (seatHeight + backrestHeight) / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(seatWidth, seatHeight + backrestHeight, seatDepth)]} />
          <lineBasicMaterial color="#fbbf24" linewidth={3} />
        </lineSegments>
      )}
    </group>
  );
};

