import React from 'react';
import * as THREE from 'three';
import type { Window, EditorElement } from '../../types/editor';

interface Window3DProps {
  window: Window;
  elements: EditorElement[];
}

export const Window3D: React.FC<Window3DProps> = ({ window: win, elements }) => {
  // Calculate window position
  const midX = ((win.startPoint.x + win.endPoint.x) / 2) * 0.01;
  const midZ = ((win.startPoint.y + win.endPoint.y) / 2) * 0.01;
  
  // Window width
  const width = Math.sqrt(
    Math.pow(win.endPoint.x - win.startPoint.x, 2) +
    Math.pow(win.endPoint.y - win.startPoint.y, 2)
  ) * 0.01;
  
  // Window height (default 1.2m)
  const height = (win.height || 120) / 100;
  
  // Window positioned at 1m from ground
  const y = 1.0 + height / 2;
  
  // Find parent wall to get its angle
  const parentWall = elements.find(el => el.type === 'wall' && el.id === win.wallId);
  
  let angle = 0;
  if (parentWall && parentWall.type === 'wall') {
    // Use parent wall's angle
    angle = Math.atan2(
      parentWall.endPoint.y - parentWall.startPoint.y,
      parentWall.endPoint.x - parentWall.startPoint.x
    );
  } else {
    // Fallback to window's own angle
    angle = Math.atan2(
      win.endPoint.y - win.startPoint.y,
      win.endPoint.x - win.startPoint.x
    );
  }
  
  // Window has SAME rotation as wall, but thin geometry perpendicular to wall
  // BoxGeometry args: [along wall, vertical, through wall thickness]
  return (
    <group position={[midX, y, midZ]} rotation={[0, -angle, 0]}>
      {/* Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, height, 0.08]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
      
      {/* Glass inside frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width * 0.9, height * 0.9, 0.04]} />
        <meshStandardMaterial
          color="#87CEEB"
          transparent
          opacity={0.5}
          roughness={0.1}
          metalness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

