import React from 'react';
import * as THREE from 'three';

interface ToiletModelProps {
  width: number;  // meters
  depth: number;  // meters
  isSelected: boolean;
}

export const ToiletModel: React.FC<ToiletModelProps> = ({ width, depth, isSelected }) => {
  // Colors
  const ceramicColor = isSelected ? '#d8b4fe' : '#FFFFFF';
  
  // Dimensions - typical toilet dimensions
  const bowlWidth = 0.4;
  const bowlDepth = 0.5;
  const bowlHeight = 0.4;
  const tankWidth = 0.38;
  const tankDepth = 0.18;
  const tankHeight = 0.4;
  const tankBaseHeight = bowlHeight;
  const seatThickness = 0.03;
  const seatOverhang = 0.05;
  
  return (
    <group>
      {/* Toilet bowl base */}
      <mesh position={[0, bowlHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[bowlWidth, bowlHeight, bowlDepth]} />
        <meshStandardMaterial 
          color={ceramicColor} 
          roughness={0.2} 
          metalness={0.3}
        />
      </mesh>
      
      {/* Bowl rim (decorative top) */}
      <mesh position={[0, bowlHeight + 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[bowlWidth + 0.05, 0.04, bowlDepth + 0.05]} />
        <meshStandardMaterial 
          color={ceramicColor} 
          roughness={0.2} 
          metalness={0.3}
        />
      </mesh>
      
      {/* Toilet seat */}
      <mesh 
        position={[0, bowlHeight + seatThickness / 2 + 0.04, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[bowlWidth + seatOverhang, seatThickness, bowlDepth + seatOverhang]} />
        <meshStandardMaterial 
          color={isSelected ? '#a78bfa' : '#F5F5F5'} 
          roughness={0.4}
        />
      </mesh>
      
      {/* Toilet seat lid */}
      <mesh 
        position={[0, bowlHeight + 0.08, -bowlDepth / 2]} 
        rotation={[-Math.PI / 8, 0, 0]}
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[bowlWidth + seatOverhang, seatThickness, bowlDepth * 0.9]} />
        <meshStandardMaterial 
          color={isSelected ? '#a78bfa' : '#F5F5F5'} 
          roughness={0.4}
        />
      </mesh>
      
      {/* Tank base (connecting piece) */}
      <mesh 
        position={[0, tankBaseHeight + 0.05, -bowlDepth / 2 + 0.05]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[tankWidth, 0.1, 0.1]} />
        <meshStandardMaterial color={ceramicColor} roughness={0.2} />
      </mesh>
      
      {/* Toilet tank (main) */}
      <mesh 
        position={[0, tankBaseHeight + tankHeight / 2, -bowlDepth / 2 - tankDepth / 2 + 0.05]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[tankWidth, tankHeight, tankDepth]} />
        <meshStandardMaterial 
          color={ceramicColor} 
          roughness={0.2} 
          metalness={0.3}
        />
      </mesh>
      
      {/* Tank lid */}
      <mesh 
        position={[0, tankBaseHeight + tankHeight + 0.02, -bowlDepth / 2 - tankDepth / 2 + 0.05]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[tankWidth - 0.02, 0.04, tankDepth - 0.02]} />
        <meshStandardMaterial 
          color={ceramicColor} 
          roughness={0.2} 
          metalness={0.3}
        />
      </mesh>
      
      {/* Flush button */}
      <mesh 
        position={[0, tankBaseHeight + tankHeight + 0.05, -bowlDepth / 2 - tankDepth / 2 + tankDepth / 3]} 
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshStandardMaterial 
          color="#C0C0C0" 
          roughness={0.3} 
          metalness={0.7}
        />
      </mesh>
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments position={[0, (tankBaseHeight + tankHeight) / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(bowlWidth + 0.1, tankBaseHeight + tankHeight, bowlDepth + tankDepth)]} />
          <lineBasicMaterial color="#fbbf24" linewidth={3} />
        </lineSegments>
      )}
    </group>
  );
};

