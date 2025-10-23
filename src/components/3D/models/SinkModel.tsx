import React from 'react';
import * as THREE from 'three';

interface SinkModelProps {
  width: number;  // meters
  depth: number;  // meters
  isSelected: boolean;
}

export const SinkModel: React.FC<SinkModelProps> = ({ width, depth, isSelected }) => {
  // Colors
  const ceramicColor = isSelected ? '#d8b4fe' : '#FFFFFF';
  const cabinetColor = isSelected ? '#8b5cf6' : '#8B7355';
  const faucetColor = '#C0C0C0'; // Chrome
  
  // Dimensions
  const cabinetHeight = 0.8;
  const cabinetWidth = Math.max(width, depth);
  const cabinetDepth = Math.min(width, depth);
  const countertopThickness = 0.03;
  const sinkDepth = 0.15;
  const sinkWidth = cabinetWidth * 0.6;
  const sinkLength = cabinetDepth * 0.7;
  const faucetHeight = 0.25;
  
  return (
    <group>
      {/* Cabinet base */}
      <mesh position={[0, cabinetHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[cabinetWidth, cabinetHeight, cabinetDepth]} />
        <meshStandardMaterial color={cabinetColor} roughness={0.7} />
      </mesh>
      
      {/* Countertop */}
      <mesh 
        position={[0, cabinetHeight + countertopThickness / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[cabinetWidth * 1.05, countertopThickness, cabinetDepth * 1.05]} />
        <meshStandardMaterial 
          color={isSelected ? '#e9d5ff' : '#D3D3D3'} 
          roughness={0.3} 
          metalness={0.2}
        />
      </mesh>
      
      {/* Sink bowl */}
      <mesh 
        position={[0, cabinetHeight + countertopThickness - sinkDepth / 2, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[sinkWidth, sinkDepth, sinkLength]} />
        <meshStandardMaterial 
          color={ceramicColor} 
          roughness={0.2} 
          metalness={0.5}
        />
      </mesh>
      
      {/* Sink rim (decorative) */}
      <mesh 
        position={[0, cabinetHeight + countertopThickness + 0.01, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[sinkWidth + 0.04, 0.02, sinkLength + 0.04]} />
        <meshStandardMaterial color={ceramicColor} roughness={0.2} />
      </mesh>
      
      {/* Faucet base */}
      <mesh 
        position={[0, cabinetHeight + countertopThickness + 0.05, -sinkLength / 2]} 
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[0.03, 0.04, 0.1, 16]} />
        <meshStandardMaterial 
          color={faucetColor} 
          roughness={0.2} 
          metalness={0.9}
        />
      </mesh>
      
      {/* Faucet spout */}
      <mesh 
        position={[0, cabinetHeight + countertopThickness + faucetHeight, -sinkLength / 2 + 0.1]} 
        rotation={[Math.PI / 2, 0, 0]}
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[0.015, 0.02, 0.2, 12]} />
        <meshStandardMaterial 
          color={faucetColor} 
          roughness={0.2} 
          metalness={0.9}
        />
      </mesh>
      
      {/* Faucet neck (connecting pipe) */}
      <mesh 
        position={[0, cabinetHeight + countertopThickness + faucetHeight / 2, -sinkLength / 2]} 
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[0.015, 0.015, faucetHeight, 12]} />
        <meshStandardMaterial 
          color={faucetColor} 
          roughness={0.2} 
          metalness={0.9}
        />
      </mesh>
      
      {/* Cabinet doors (2) */}
      <mesh 
        position={[-cabinetWidth / 4, cabinetHeight / 2, cabinetDepth / 2 + 0.01]} 
        receiveShadow
      >
        <boxGeometry args={[cabinetWidth / 2 - 0.02, cabinetHeight - 0.1, 0.02]} />
        <meshStandardMaterial color={cabinetColor} roughness={0.6} />
      </mesh>
      
      <mesh 
        position={[cabinetWidth / 4, cabinetHeight / 2, cabinetDepth / 2 + 0.01]} 
        receiveShadow
      >
        <boxGeometry args={[cabinetWidth / 2 - 0.02, cabinetHeight - 0.1, 0.02]} />
        <meshStandardMaterial color={cabinetColor} roughness={0.6} />
      </mesh>
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments position={[0, (cabinetHeight + faucetHeight) / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(cabinetWidth, cabinetHeight + faucetHeight, cabinetDepth)]} />
          <lineBasicMaterial color="#fbbf24" linewidth={3} />
        </lineSegments>
      )}
    </group>
  );
};

