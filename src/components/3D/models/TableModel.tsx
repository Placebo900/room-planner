import React from 'react';
import * as THREE from 'three';

interface TableModelProps {
  width: number;  // meters
  depth: number;  // meters
  isSelected: boolean;
}

export const TableModel: React.FC<TableModelProps> = ({ width, depth, isSelected }) => {
  // Colors
  const topColor = isSelected ? '#8b5cf6' : '#D2691E'; // Wood color
  const legColor = isSelected ? '#7c3aed' : '#8B4513'; // Darker wood
  
  // Dimensions
  const tableHeight = 0.75; // Standard table height
  const topThickness = 0.05;
  const legWidth = 0.06;
  const legHeight = tableHeight - topThickness;
  const apronHeight = 0.08; // Decorative apron under tabletop
  const apronThickness = 0.03;
  
  return (
    <group>
      {/* Tabletop */}
      <mesh 
        position={[0, tableHeight - topThickness / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width, topThickness, depth]} />
        <meshStandardMaterial 
          color={topColor} 
          roughness={0.6} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Apron (frame under tabletop) - Front */}
      <mesh 
        position={[0, tableHeight - topThickness - apronHeight / 2, depth / 2 - apronThickness / 2]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width, apronHeight, apronThickness]} />
        <meshStandardMaterial color={legColor} roughness={0.7} />
      </mesh>
      
      {/* Apron - Back */}
      <mesh 
        position={[0, tableHeight - topThickness - apronHeight / 2, -depth / 2 + apronThickness / 2]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width, apronHeight, apronThickness]} />
        <meshStandardMaterial color={legColor} roughness={0.7} />
      </mesh>
      
      {/* Apron - Left */}
      <mesh 
        position={[-width / 2 + apronThickness / 2, tableHeight - topThickness - apronHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[apronThickness, apronHeight, depth - 2 * apronThickness]} />
        <meshStandardMaterial color={legColor} roughness={0.7} />
      </mesh>
      
      {/* Apron - Right */}
      <mesh 
        position={[width / 2 - apronThickness / 2, tableHeight - topThickness - apronHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[apronThickness, apronHeight, depth - 2 * apronThickness]} />
        <meshStandardMaterial color={legColor} roughness={0.7} />
      </mesh>
      
      {/* Legs (4 corners) */}
      {[
        [-width / 2 + legWidth / 2, legHeight / 2, -depth / 2 + legWidth / 2],
        [width / 2 - legWidth / 2, legHeight / 2, -depth / 2 + legWidth / 2],
        [-width / 2 + legWidth / 2, legHeight / 2, depth / 2 - legWidth / 2],
        [width / 2 - legWidth / 2, legHeight / 2, depth / 2 - legWidth / 2],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[legWidth, legHeight, legWidth]} />
          <meshStandardMaterial color={legColor} roughness={0.8} />
        </mesh>
      ))}
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments position={[0, tableHeight / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(width, tableHeight, depth)]} />
          <lineBasicMaterial color="#fbbf24" linewidth={3} />
        </lineSegments>
      )}
    </group>
  );
};

