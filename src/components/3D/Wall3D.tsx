import React, { useState } from 'react';
import * as THREE from 'three';
import type { Wall } from '../../types/editor';

interface Wall3DProps {
  wall: Wall;
  isSelected: boolean;
  onClick?: (id: string) => void;
}

export const Wall3D: React.FC<Wall3DProps> = ({ wall, isSelected, onClick }) => {
  const [hover, setHover] = useState(false);
  const start = wall.startPoint;
  const end = wall.endPoint;
  
  // Convert pixels to meters (SCALE = 0.1, then /1000 for mm to m)
  const midX = ((start.x + end.x) / 2) * 0.01;
  const midZ = ((start.y + end.y) / 2) * 0.01;
  
  // Calculate wall length
  const length = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  ) * 0.01;
  
  // Calculate rotation angle
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  
  // Wall height in meters (default 2.7m)
  const height = (wall.height || 270) / 100;
  
  // Wall thickness in meters
  const thickness = (wall.thickness || 20) * 0.01;
  
  return (
    <group position={[midX, height / 2, midZ]} rotation={[0, -angle, 0]}>
      {/* Wall mesh */}
      <mesh 
        castShadow 
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(wall.id);
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <boxGeometry args={[length, height, thickness]} />
        <meshStandardMaterial
          color={isSelected ? '#3b82f6' : hover ? '#d1d5db' : '#e5e7eb'}
          roughness={0.8}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Selection outline */}
      {isSelected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(length, height, thickness)]} />
          <lineBasicMaterial color="#fbbf24" linewidth={2} />
        </lineSegments>
      )}
    </group>
  );
};

