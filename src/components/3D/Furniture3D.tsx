import React, { useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { Furniture } from '../../types/editor';
import { BedModel } from './models/BedModel';
import { TableModel } from './models/TableModel';
import { ChairModel } from './models/ChairModel';
import { SofaModel } from './models/SofaModel';
import { SinkModel } from './models/SinkModel';
import { ToiletModel } from './models/ToiletModel';
import { ShowerModel } from './models/ShowerModel';
import { TVModel } from './models/TVModel';

interface Furniture3DProps {
  furniture: Furniture;
  isSelected: boolean;
  onClick?: (id: string) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
  onDragStart?: () => void;
  onDragComplete?: () => void;
}

export const Furniture3D: React.FC<Furniture3DProps> = ({ 
  furniture, 
  isSelected,
  onClick,
  onDragEnd,
  onDragStart,
  onDragComplete
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const { raycaster } = useThree();
  
  // Convert position from pixels to meters
  const x = furniture.position.x * 0.01;
  const z = furniture.position.y * 0.01;
  
  // Furniture dimensions are in millimeters, convert to meters
  const width = (furniture.dimensions.width || 500) / 1000;  // mm to meters
  const depth = (furniture.dimensions.height || 500) / 1000; // mm to meters (using height as depth)
  const height = 0.8; // Default furniture height for fallback
  
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    if (onDragStart) {
      onDragStart();
    }
    if (onClick) {
      onClick(furniture.id);
    }
  };
  
  const handlePointerUp = (e: any) => {
    if (isDragging) {
      if (meshRef.current && onDragEnd) {
        e.stopPropagation();
        // Convert 3D position back to 2D pixels
        const newX = meshRef.current.position.x * 100;
        const newY = meshRef.current.position.z * 100;
        onDragEnd(furniture.id, newX, newY);
      }
      if (onDragComplete) {
        onDragComplete();
      }
    }
    setIsDragging(false);
  };
  
  const handlePointerMove = (e: any) => {
    if (isDragging && meshRef.current) {
      e.stopPropagation();
      
      // Create a plane at y=0 (floor level)
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      
      // Get intersection point with floor plane
      raycaster.ray.intersectPlane(plane, intersection);
      
      if (intersection) {
        meshRef.current.position.x = intersection.x;
        meshRef.current.position.z = intersection.z;
      }
    }
  };
  
  // Render appropriate model based on furniture category
  const renderFurnitureModel = () => {
    const category = furniture.category;
    
    switch (category) {
      case 'bed':
        return <BedModel width={width} depth={depth} isSelected={isSelected} />;
      case 'table':
        return <TableModel width={width} depth={depth} isSelected={isSelected} />;
      case 'stool':
        return <ChairModel width={width} depth={depth} isSelected={isSelected} />;
      case 'sofa':
        return <SofaModel width={width} depth={depth} isSelected={isSelected} />;
      case 'sink':
        return <SinkModel width={width} depth={depth} isSelected={isSelected} />;
      case 'toilet':
        return <ToiletModel width={width} depth={depth} isSelected={isSelected} />;
      case 'shower':
        return <ShowerModel width={width} depth={depth} isSelected={isSelected} />;
      case 'tv':
        return <TVModel width={width} depth={depth} isSelected={isSelected} />;
      default:
        // Fallback to simple box for unknown categories
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
              color={isSelected ? '#8b5cf6' : hover ? '#6B7280' : '#4A5568'}
              roughness={0.6}
              metalness={0.3}
            />
          </mesh>
        );
    }
  };
  
  return (
    <group>
      <group
        ref={meshRef}
        position={[x, 0, z]}
        rotation={[0, -furniture.rotation, 0]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        {renderFurnitureModel()}
        
        {/* Hover outline for entire furniture */}
        {hover && !isSelected && (
          <lineSegments position={[0, height / 2, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(width, height, depth)]} />
            <lineBasicMaterial color="#9CA3AF" linewidth={2} />
          </lineSegments>
        )}
      </group>
      
      {/* Dragging indicator */}
      {isDragging && (
        <mesh position={[x, 0.05, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[Math.max(width, depth) * 0.7, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
};

