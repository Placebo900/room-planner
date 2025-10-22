import React from 'react';
import * as THREE from 'three';
import type { Door, EditorElement } from '../../types/editor';

interface Door3DProps {
  door: Door;
  elements: EditorElement[];
}

export const Door3D: React.FC<Door3DProps> = ({ door, elements }) => {
  // Calculate door position
  const midX = ((door.startPoint.x + door.endPoint.x) / 2) * 0.01;
  const midZ = ((door.startPoint.y + door.endPoint.y) / 2) * 0.01;
  
  // Door width
  const width = Math.sqrt(
    Math.pow(door.endPoint.x - door.startPoint.x, 2) +
    Math.pow(door.endPoint.y - door.startPoint.y, 2)
  ) * 0.01;
  
  // Door height (default 2.1m)
  const height = (door.height || 210) / 100;
  
  // Door positioned from ground
  const y = height / 2;
  
  // Find parent wall to get its angle
  const parentWall = elements.find(el => el.type === 'wall' && el.id === door.wallId);
  
  let angle = 0;
  if (parentWall && parentWall.type === 'wall') {
    // Use parent wall's angle
    angle = Math.atan2(
      parentWall.endPoint.y - parentWall.startPoint.y,
      parentWall.endPoint.x - parentWall.startPoint.x
    );
  } else {
    // Fallback to door's own angle
    angle = Math.atan2(
      door.endPoint.y - door.startPoint.y,
      door.endPoint.x - door.startPoint.x
    );
  }
  
  // Door has SAME rotation as wall
  // BoxGeometry args: [along wall, vertical, through wall thickness]
  return (
    <mesh
      position={[midX, y, midZ]}
      rotation={[0, -angle, 0]}
      castShadow
    >
      <boxGeometry args={[width, height, 0.05]} />
      <meshStandardMaterial
        color="#8B4513"
        roughness={0.6}
        metalness={0.2}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

