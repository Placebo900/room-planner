import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene3D } from '../3D/Scene3D';
import type { EditorElement } from '../../types/editor';

interface Viewer3DProps {
  width: number;
  height: number;
  elements: EditorElement[];
  selectedId: string | null;
  onElementClick?: (id: string) => void;
  onFurnitureDragEnd?: (id: string, x: number, y: number) => void;
  onFloorClick?: (x: number, z: number) => void;
}

export const Viewer3D: React.FC<Viewer3DProps> = ({
  width,
  height,
  elements,
  selectedId,
  onElementClick,
  onFurnitureDragEnd,
  onFloorClick
}) => {
  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        shadows
      >
        <Scene3D 
          elements={elements} 
          selectedId={selectedId}
          onElementClick={onElementClick}
          onFurnitureDragEnd={onFurnitureDragEnd}
          onFloorClick={onFloorClick}
        />
      </Canvas>
    </div>
  );
};

