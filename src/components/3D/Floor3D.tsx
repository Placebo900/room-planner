import React from 'react';

interface Floor3DProps {
  size: number;
}

export const Floor3D: React.FC<Floor3DProps> = ({ size }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial
        color="#d4a574"
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
};

