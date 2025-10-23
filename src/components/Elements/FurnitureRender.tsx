import React from 'react';
import { Group, Rect, Circle, Line, Text, Ellipse } from 'react-konva';
import type { Furniture, Wall } from '../../types/editor';
import { SCALE } from '../../constants/editor';

interface FurnitureRenderProps {
  furniture: Furniture;
  walls: Wall[];
  onClick: (id: string) => void;
  onDragEnd: (id: string, position: { x: number; y: number }) => void;
  isSelected?: boolean;
}

// Render realistic furniture shapes
const renderFurnitureShape = (furniture: Furniture, isSelected: boolean) => {
  const w = furniture.dimensions.width * SCALE;
  const h = furniture.dimensions.height * SCALE;
  const category = furniture.category;

  // Determine colors
  const fillColor = isSelected ? '#dbeafe' : '#e5e7eb';
  const strokeColor = isSelected ? '#3b82f6' : '#9ca3af';
  const accentColor = isSelected ? '#60a5fa' : '#6b7280';

  if (category === 'stool') {
    // Chair/Stool shape
    return (
      <>
        {/* Seat */}
        <Rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h * 0.5}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={2}
          cornerRadius={4}
        />
        {/* Backrest */}
        <Rect
          x={-w / 2}
          y={-h / 2 - h * 0.3}
          width={w}
          height={h * 0.35}
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth={2}
          cornerRadius={4}
        />
        {/* Legs */}
        <Line
          points={[-w/2 + 5, h/2 - h*0.5, -w/2 + 5, h/2]}
          stroke={strokeColor}
          strokeWidth={3}
        />
        <Line
          points={[w/2 - 5, h/2 - h*0.5, w/2 - 5, h/2]}
          stroke={strokeColor}
          strokeWidth={3}
        />
      </>
    );
  } else if (category === 'table') {
    // Table shape
    return (
      <>
        {/* Tabletop */}
        <Rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={3}
          cornerRadius={6}
        />
        {/* Table surface detail */}
        <Rect
          x={-w / 2 + 5}
          y={-h / 2 + 5}
          width={w - 10}
          height={h - 10}
          stroke={accentColor}
          strokeWidth={1}
          cornerRadius={4}
        />
        {/* Table legs */}
        <Circle x={-w/2 + 10} y={-h/2 + 10} radius={4} fill={strokeColor} />
        <Circle x={w/2 - 10} y={-h/2 + 10} radius={4} fill={strokeColor} />
        <Circle x={-w/2 + 10} y={h/2 - 10} radius={4} fill={strokeColor} />
        <Circle x={w/2 - 10} y={h/2 - 10} radius={4} fill={strokeColor} />
      </>
    );
  } else if (category === 'sofa') {
    // Sofa shape
    return (
      <>
        {/* Sofa base */}
        <Rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h * 0.7}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={2}
          cornerRadius={8}
        />
        {/* Backrest */}
        <Rect
          x={-w / 2}
          y={-h / 2 - h * 0.2}
          width={w}
          height={h * 0.3}
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth={2}
          cornerRadius={6}
        />
        {/* Armrests */}
        <Rect
          x={-w / 2 - 8}
          y={-h / 2}
          width={8}
          height={h * 0.6}
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth={1}
          cornerRadius={3}
        />
        <Rect
          x={w / 2}
          y={-h / 2}
          width={8}
          height={h * 0.6}
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth={1}
          cornerRadius={3}
        />
      </>
    );
  } else if (category === 'bed') {
    // Bed shape
    return (
      <>
        {/* Mattress */}
        <Rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h * 0.8}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={2}
          cornerRadius={4}
        />
        {/* Headboard */}
        <Rect
          x={-w / 2}
          y={-h / 2 - h * 0.15}
          width={w}
          height={h * 0.2}
          fill={accentColor}
          stroke={strokeColor}
          strokeWidth={2}
          cornerRadius={6}
        />
        {/* Pillow detail */}
        <Ellipse
          x={0}
          y={-h / 2 + h * 0.2}
          radiusX={w * 0.3}
          radiusY={h * 0.15}
          fill={'white'}
          stroke={accentColor}
          strokeWidth={1}
          opacity={0.6}
        />
      </>
    );
  }

  // Default shape (generic furniture)
  return (
    <Rect
      x={-w / 2}
      y={-h / 2}
      width={w}
      height={h}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={2}
      cornerRadius={4}
    />
  );
};

// Calculate distances to walls
const calculateDistances = (furniture: Furniture, walls: Wall[]) => {
  const distances = { left: Infinity, right: Infinity, top: Infinity, bottom: Infinity };
  
  walls.forEach(wall => {
    // Check if wall is horizontal or vertical
    const dx = wall.endPoint.x - wall.startPoint.x;
    const dy = wall.endPoint.y - wall.startPoint.y;
    const isHorizontal = Math.abs(dx) > Math.abs(dy);
    
    if (isHorizontal) {
      const wallY = (wall.startPoint.y + wall.endPoint.y) / 2;
      const dist = Math.abs(wallY - furniture.position.y);
      
      if (wallY < furniture.position.y) {
        distances.top = Math.min(distances.top, dist);
      } else {
        distances.bottom = Math.min(distances.bottom, dist);
      }
    } else {
      const wallX = (wall.startPoint.x + wall.endPoint.x) / 2;
      const dist = Math.abs(wallX - furniture.position.x);
      
      if (wallX < furniture.position.x) {
        distances.left = Math.min(distances.left, dist);
      } else {
        distances.right = Math.min(distances.right, dist);
      }
    }
  });
  
  return distances;
};

export const FurnitureRender: React.FC<FurnitureRenderProps> = ({ 
  furniture, 
  walls,
  onClick, 
  onDragEnd,
  isSelected = false 
}) => {
  const [dragPosition, setDragPosition] = React.useState(furniture.position);
  const [isDragging, setIsDragging] = React.useState(false);
  
  // Calculate distances using current drag position or furniture position
  const currentPos = isDragging ? dragPosition : furniture.position;
  const tempFurniture = { ...furniture, position: currentPos };
  const distances = isSelected ? calculateDistances(tempFurniture, walls) : null;
  
  const rotationDegrees = Math.round((furniture.rotation * 180 / Math.PI) % 360);
  
  return (
    <Group
      x={furniture.position.x}
      y={furniture.position.y}
      rotation={(furniture.rotation * 180) / Math.PI}
      draggable
      onDragStart={() => {
        setIsDragging(true);
      }}
      onDragMove={(e) => {
        setDragPosition({ x: e.target.x(), y: e.target.y() });
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
        onDragEnd(furniture.id, { x: e.target.x(), y: e.target.y() });
        setDragPosition(furniture.position);
      }}
      onClick={() => onClick(furniture.id)}
      onTap={() => onClick(furniture.id)}
    >
      {/* Furniture shape */}
      {renderFurnitureShape(furniture, isSelected)}
      
      {/* Rotation indicator when selected */}
      {isSelected && (
        <>
          {/* Rotation arc */}
          <Circle
            x={0}
            y={0}
            radius={Math.max(furniture.dimensions.width, furniture.dimensions.height) * SCALE * 0.6}
            stroke="#8b5cf6"
            strokeWidth={1}
            dash={[4, 4]}
          />
          {/* Direction arrow */}
          <Line
            points={[
              0, 
              0, 
              0, 
              -Math.max(furniture.dimensions.width, furniture.dimensions.height) * SCALE * 0.65
            ]}
            stroke="#8b5cf6"
            strokeWidth={3}
            lineCap="round"
          />
          {/* Arrowhead */}
          <Line
            points={[
              -5, 
              -Math.max(furniture.dimensions.width, furniture.dimensions.height) * SCALE * 0.65 + 10,
              0, 
              -Math.max(furniture.dimensions.width, furniture.dimensions.height) * SCALE * 0.65,
              5, 
              -Math.max(furniture.dimensions.width, furniture.dimensions.height) * SCALE * 0.65 + 10
            ]}
            stroke="#8b5cf6"
            strokeWidth={3}
            lineCap="round"
            lineJoin="round"
          />
          {/* Rotation angle text */}
          <Text
            x={-20}
            y={Math.max(furniture.dimensions.width, furniture.dimensions.height) * SCALE * 0.4}
            text={`${rotationDegrees}°`}
            fontSize={14}
            fill="#8b5cf6"
            fontStyle="bold"
          />
        </>
      )}
      
      {/* Name and price labels */}
      <Text
        x={-furniture.dimensions.width * SCALE / 2}
        y={-furniture.dimensions.height * SCALE / 2 - 20}
        text={furniture.name}
        fontSize={10}
        fill="black"
        fontStyle="bold"
      />
      <Text
        x={-furniture.dimensions.width * SCALE / 2}
        y={-furniture.dimensions.height * SCALE / 2 - 35}
        text={`${furniture.price.toLocaleString()} ₽`}
        fontSize={9}
        fill="#059669"
        fontStyle="bold"
      />
      
      {/* Distance indicators when selected */}
      {isSelected && distances && (
        <>
          {/* Left distance */}
          {distances.left !== Infinity && (
            <>
              <Line
                points={[-furniture.dimensions.width * SCALE / 2, 0, -furniture.dimensions.width * SCALE / 2 - distances.left, 0]}
                stroke="#22c55e"
                strokeWidth={1}
                dash={[5, 5]}
              />
              <Text
                x={-furniture.dimensions.width * SCALE / 2 - distances.left / 2 - 20}
                y={-10}
                text={`${(distances.left / 100).toFixed(2)} м`}
                fontSize={10}
                fill="#16a34a"
                fontStyle="bold"
              />
            </>
          )}
          
          {/* Right distance */}
          {distances.right !== Infinity && (
            <>
              <Line
                points={[furniture.dimensions.width * SCALE / 2, 0, furniture.dimensions.width * SCALE / 2 + distances.right, 0]}
                stroke="#22c55e"
                strokeWidth={1}
                dash={[5, 5]}
              />
              <Text
                x={furniture.dimensions.width * SCALE / 2 + distances.right / 2 - 20}
                y={-10}
                text={`${(distances.right / 100).toFixed(2)} м`}
                fontSize={10}
                fill="#16a34a"
                fontStyle="bold"
              />
            </>
          )}
          
          {/* Top distance */}
          {distances.top !== Infinity && (
            <>
              <Line
                points={[0, -furniture.dimensions.height * SCALE / 2, 0, -furniture.dimensions.height * SCALE / 2 - distances.top]}
                stroke="#22c55e"
                strokeWidth={1}
                dash={[5, 5]}
              />
              <Text
                x={10}
                y={-furniture.dimensions.height * SCALE / 2 - distances.top / 2 - 5}
                text={`${(distances.top / 100).toFixed(2)} м`}
                fontSize={10}
                fill="#16a34a"
                fontStyle="bold"
              />
            </>
          )}
          
          {/* Bottom distance */}
          {distances.bottom !== Infinity && (
            <>
              <Line
                points={[0, furniture.dimensions.height * SCALE / 2, 0, furniture.dimensions.height * SCALE / 2 + distances.bottom]}
                stroke="#22c55e"
                strokeWidth={1}
                dash={[5, 5]}
              />
              <Text
                x={10}
                y={furniture.dimensions.height * SCALE / 2 + distances.bottom / 2 - 5}
                text={`${(distances.bottom / 100).toFixed(2)} м`}
                fontSize={10}
                fill="#16a34a"
                fontStyle="bold"
              />
            </>
          )}
        </>
      )}
    </Group>
  );
};
