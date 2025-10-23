import React, { useState, useRef } from 'react';
import { OrbitControls, Sky, Grid } from '@react-three/drei';
import { Floor3D } from './Floor3D';
import { Wall3D } from './Wall3D';
import { Furniture3D } from './Furniture3D';
import { Window3D } from './Window3D';
import { Door3D } from './Door3D';
import type { EditorElement } from '../../types/editor';

interface Scene3DProps {
  elements: EditorElement[];
  selectedId: string | null;
  onElementClick?: (id: string) => void;
  onFurnitureDragEnd?: (id: string, x: number, y: number) => void;
  onFloorClick?: (x: number, z: number) => void;
}

export const Scene3D: React.FC<Scene3DProps> = ({ 
  elements, 
  selectedId,
  onElementClick,
  onFurnitureDragEnd,
  onFloorClick
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const controlsRef = useRef<any>(null);
  
  // Filter elements by type
  const walls = elements.filter((el): el is Extract<EditorElement, { type: 'wall' }> => 
    el.type === 'wall'
  );
  const windows = elements.filter((el): el is Extract<EditorElement, { type: 'window' }> => 
    el.type === 'window'
  );
  const doors = elements.filter((el): el is Extract<EditorElement, { type: 'door' }> => 
    el.type === 'door'
  );
  const furniture = elements.filter((el): el is Extract<EditorElement, { type: 'furniture' }> => 
    el.type === 'furniture'
  );
  
  // Calculate bounding box for all elements to make floor adaptive
  const calculateBounds = () => {
    if (elements.length === 0) return 30; // Default size if no elements
    
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    
    elements.forEach(el => {
      if (el.type === 'wall') {
        minX = Math.min(minX, el.startPoint.x, el.endPoint.x);
        maxX = Math.max(maxX, el.startPoint.x, el.endPoint.x);
        minY = Math.min(minY, el.startPoint.y, el.endPoint.y);
        maxY = Math.max(maxY, el.startPoint.y, el.endPoint.y);
      } else if (el.type === 'furniture') {
        const furnitureRadius = Math.max(
          (el.dimensions.width || 500) / 1000,
          (el.dimensions.height || 500) / 1000
        ) / 2;
        minX = Math.min(minX, el.position.x - furnitureRadius * 100);
        maxX = Math.max(maxX, el.position.x + furnitureRadius * 100);
        minY = Math.min(minY, el.position.y - furnitureRadius * 100);
        maxY = Math.max(maxY, el.position.y + furnitureRadius * 100);
      } else if (el.type === 'window' || el.type === 'door') {
        minX = Math.min(minX, el.startPoint.x, el.endPoint.x);
        maxX = Math.max(maxX, el.startPoint.x, el.endPoint.x);
        minY = Math.min(minY, el.startPoint.y, el.endPoint.y);
        maxY = Math.max(maxY, el.startPoint.y, el.endPoint.y);
      }
    });
    
    // Convert to meters and add padding
    const width = (maxX - minX) * 0.01;
    const height = (maxY - minY) * 0.01;
    const maxDimension = Math.max(width, height);
    
    // Add 50% padding and ensure minimum size
    return Math.max(30, maxDimension * 1.5);
  };
  
  const floorSize = calculateBounds();
  
  return (
    <>
      {/* Lighting - улучшенное освещение со всех сторон */}
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-10, 10, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.4} />
      <hemisphereLight args={['#ffffff', '#60666C', 0.5]} />
      
      {/* Sky */}
      <Sky sunPosition={[100, 20, 100]} />
      
      {/* Grid helper - adaptive size */}
      <Grid args={[floorSize, floorSize]} />
      
      {/* Floor - adaptive size */}
      <Floor3D size={floorSize} onClick={onFloorClick} />
      
      {/* Walls */}
      {walls.map((wall) => (
        <Wall3D
          key={wall.id}
          wall={wall}
          isSelected={wall.id === selectedId}
          onClick={onElementClick}
        />
      ))}
      
      {/* Windows */}
      {windows.map((window, idx) => (
        <Window3D key={`window-${window.id}-${idx}`} window={window} elements={elements} />
      ))}
      
      {/* Doors */}
      {doors.map((door, idx) => (
        <Door3D key={`door-${door.id}-${idx}`} door={door} elements={elements} />
      ))}
      
      {/* Furniture */}
      {furniture.map((item) => (
        <Furniture3D
          key={item.id}
          furniture={item}
          isSelected={item.id === selectedId}
          onClick={onElementClick}
          onDragEnd={onFurnitureDragEnd}
          onDragStart={() => setIsDragging(true)}
          onDragComplete={() => setIsDragging(false)}
        />
      ))}
      
      {/* Camera controls - adaptive max distance */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={!isDragging}
        maxPolarAngle={Math.PI / 2} // Don't go below ground
        minDistance={2}
        maxDistance={floorSize * 1.5}
        mouseButtons={{
          LEFT: isDragging ? undefined : 0,  // Disable left button rotation when dragging
          MIDDLE: 1,
          RIGHT: 2
        }}
      />
    </>
  );
};

