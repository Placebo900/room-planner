import React from 'react';
import * as THREE from 'three';

interface ShowerModelProps {
  width: number;  // meters
  depth: number;  // meters
  isSelected: boolean;
}

export const ShowerModel: React.FC<ShowerModelProps> = ({ width, depth, isSelected }) => {
  // Colors
  const trayColor = isSelected ? '#d8b4fe' : '#FFFFFF';
  const glassColor = isSelected ? '#c4b5fd' : '#87CEEB';
  const chromeColor = '#C0C0C0';
  
  // Dimensions
  const trayHeight = 0.15;
  const trayWidth = Math.max(width, depth);
  const trayDepth = Math.min(width, depth);
  const wallHeight = 2.0;
  const wallThickness = 0.03;
  const showerHeadHeight = 1.8;
  
  return (
    <group>
      {/* Shower tray/base */}
      <mesh position={[0, trayHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[trayWidth, trayHeight, trayDepth]} />
        <meshStandardMaterial 
          color={trayColor} 
          roughness={0.2} 
          metalness={0.3}
        />
      </mesh>
      
      {/* Tray rim */}
      <mesh position={[0, trayHeight + 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[trayWidth + 0.05, 0.02, trayDepth + 0.05]} />
        <meshStandardMaterial color={trayColor} roughness={0.2} />
      </mesh>
      
      {/* Back glass wall */}
      <mesh 
        position={[0, trayHeight + wallHeight / 2, -trayDepth / 2 + wallThickness / 2]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[trayWidth - 0.1, wallHeight, wallThickness]} />
        <meshStandardMaterial 
          color={glassColor} 
          transparent 
          opacity={0.3} 
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      
      {/* Left glass wall */}
      <mesh 
        position={[-trayWidth / 2 + wallThickness / 2, trayHeight + wallHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[wallThickness, wallHeight, trayDepth - 0.1]} />
        <meshStandardMaterial 
          color={glassColor} 
          transparent 
          opacity={0.3} 
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      
      {/* Right glass wall (partial, for door) */}
      <mesh 
        position={[trayWidth / 2 - wallThickness / 2, trayHeight + wallHeight / 2, -trayDepth / 4]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[wallThickness, wallHeight, trayDepth / 2 - 0.1]} />
        <meshStandardMaterial 
          color={glassColor} 
          transparent 
          opacity={0.3} 
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      
      {/* Glass door */}
      <mesh 
        position={[trayWidth / 2 - wallThickness / 2 - 0.15, trayHeight + wallHeight / 2, trayDepth / 4]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[wallThickness, wallHeight - 0.2, trayDepth / 2]} />
        <meshStandardMaterial 
          color={glassColor} 
          transparent 
          opacity={0.4} 
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
      
      {/* Shower pipe (wall mounted) */}
      <mesh 
        position={[0, trayHeight + showerHeadHeight / 2, -trayDepth / 2 + 0.05]} 
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[0.015, 0.015, showerHeadHeight, 12]} />
        <meshStandardMaterial 
          color={chromeColor} 
          roughness={0.2} 
          metalness={0.9}
        />
      </mesh>
      
      {/* Shower head */}
      <mesh 
        position={[0, trayHeight + showerHeadHeight, -trayDepth / 2 + 0.1]} 
        rotation={[Math.PI / 4, 0, 0]}
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[0.08, 0.06, 0.05, 16]} />
        <meshStandardMaterial 
          color={chromeColor} 
          roughness={0.2} 
          metalness={0.9}
        />
      </mesh>
      
      {/* Control panel/mixer */}
      <mesh 
        position={[-trayWidth / 3, trayHeight + 1.0, -trayDepth / 2 + 0.02]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[0.15, 0.15, 0.04]} />
        <meshStandardMaterial 
          color={chromeColor} 
          roughness={0.3} 
          metalness={0.8}
        />
      </mesh>
      
      {/* Control knob */}
      <mesh 
        position={[-trayWidth / 3, trayHeight + 1.0, -trayDepth / 2 + 0.05]} 
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
        <meshStandardMaterial 
          color={chromeColor} 
          roughness={0.2} 
          metalness={0.9}
        />
      </mesh>
      
      {/* Drain (in tray) */}
      <mesh position={[0, trayHeight + 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[0.05, 0.04, 0.02, 16]} />
        <meshStandardMaterial 
          color={chromeColor} 
          roughness={0.3} 
          metalness={0.7}
        />
      </mesh>
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments position={[0, (trayHeight + wallHeight) / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(trayWidth, trayHeight + wallHeight, trayDepth)]} />
          <lineBasicMaterial color="#fbbf24" linewidth={3} />
        </lineSegments>
      )}
    </group>
  );
};

