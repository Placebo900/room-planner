import React from 'react';
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
}

export const Scene3D: React.FC<Scene3DProps> = ({ elements, selectedId }) => {
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
      
      {/* Grid helper */}
      <Grid args={[20, 20]} />
      
      {/* Floor */}
      <Floor3D size={20} />
      
      {/* Walls */}
      {walls.map((wall) => (
        <Wall3D
          key={wall.id}
          wall={wall}
          isSelected={wall.id === selectedId}
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
        />
      ))}
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2} // Don't go below ground
        minDistance={2}
        maxDistance={30}
      />
    </>
  );
};

