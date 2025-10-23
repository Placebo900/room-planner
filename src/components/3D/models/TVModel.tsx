import React from 'react';
import * as THREE from 'three';

interface TVModelProps {
  width: number;  // meters
  depth: number;  // meters
  isSelected: boolean;
}

export const TVModel: React.FC<TVModelProps> = ({ width, depth, isSelected }) => {
  // Colors
  const screenColor = isSelected ? '#7c3aed' : '#1a1a1a'; // Dark screen
  const frameColor = isSelected ? '#6b21a8' : '#2d3748';
  const standColor = isSelected ? '#8b5cf6' : '#4a5568';
  
  // Dimensions - TV is typically wider than tall
  const tvWidth = Math.max(width, depth);
  const tvHeight = tvWidth * 0.56; // 16:9 aspect ratio
  const tvDepth = 0.05; // Thin modern TV
  const frameThickness = 0.02;
  const standWidth = tvWidth * 0.4;
  const standDepth = Math.min(width, depth) * 0.8;
  const standHeight = 0.15;
  const tvBottomHeight = standHeight;
  
  return (
    <group>
      {/* TV Stand base */}
      <mesh position={[0, standHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[standWidth, standHeight, standDepth]} />
        <meshStandardMaterial color={standColor} roughness={0.6} metalness={0.3} />
      </mesh>
      
      {/* TV Stand neck/support */}
      <mesh 
        position={[0, standHeight + 0.1, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[standWidth * 0.3, 0.2, standDepth * 0.5]} />
        <meshStandardMaterial color={standColor} roughness={0.5} metalness={0.4} />
      </mesh>
      
      {/* TV Back panel */}
      <mesh 
        position={[0, tvBottomHeight + tvHeight / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[tvWidth, tvHeight, tvDepth]} />
        <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.2} />
      </mesh>
      
      {/* TV Frame (bezel) */}
      <mesh 
        position={[0, tvBottomHeight + tvHeight / 2, tvDepth / 2 + 0.01]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[tvWidth + frameThickness, tvHeight + frameThickness, 0.02]} />
        <meshStandardMaterial color={frameColor} roughness={0.5} metalness={0.3} />
      </mesh>
      
      {/* TV Screen */}
      <mesh 
        position={[0, tvBottomHeight + tvHeight / 2, tvDepth / 2 + 0.025]} 
        receiveShadow
      >
        <boxGeometry args={[tvWidth - frameThickness * 2, tvHeight - frameThickness * 2, 0.01]} />
        <meshStandardMaterial 
          color={screenColor} 
          roughness={0.1} 
          metalness={0.8}
          emissive={isSelected ? '#6b21a8' : '#000000'}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>
      
      {/* Screen reflection/glass effect */}
      <mesh 
        position={[0, tvBottomHeight + tvHeight / 2, tvDepth / 2 + 0.03]} 
        receiveShadow
      >
        <boxGeometry args={[tvWidth - frameThickness * 2, tvHeight - frameThickness * 2, 0.005]} />
        <meshStandardMaterial 
          color="#ffffff"
          transparent
          opacity={0.05}
          roughness={0.05} 
          metalness={0.9}
        />
      </mesh>
      
      {/* Power indicator LED */}
      <mesh 
        position={[0, tvBottomHeight + 0.05, tvDepth / 2 + 0.025]} 
        receiveShadow
      >
        <cylinderGeometry args={[0.008, 0.008, 0.01, 8]} />
        <meshStandardMaterial 
          color={isSelected ? '#10b981' : '#ef4444'} 
          emissive={isSelected ? '#10b981' : '#ef4444'}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Brand logo area (subtle) */}
      <mesh 
        position={[0, tvBottomHeight + 0.03, tvDepth / 2 + 0.02]} 
        receiveShadow
      >
        <boxGeometry args={[0.1, 0.02, 0.005]} />
        <meshStandardMaterial 
          color="#888888"
          roughness={0.4} 
          metalness={0.6}
        />
      </mesh>
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments position={[0, (tvBottomHeight + tvHeight) / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(tvWidth, tvBottomHeight + tvHeight, Math.max(tvDepth, standDepth))]} />
          <lineBasicMaterial color="#fbbf24" linewidth={3} />
        </lineSegments>
      )}
    </group>
  );
};

