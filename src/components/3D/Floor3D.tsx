import React from 'react';

interface Floor3DProps {
  size: number;
  onClick?: (x: number, z: number) => void;
}

export const Floor3D: React.FC<Floor3DProps> = ({ size, onClick }) => {
  const handleClick = (e: any) => {
    if (onClick && e.point) {
      // e.point contains the 3D coordinates where the floor was clicked
      onClick(e.point.x, e.point.z);
    }
  };
  
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      receiveShadow 
      position={[0, 0, 0]}
      onClick={handleClick}
    >
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        color="#d4a574"
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
};

