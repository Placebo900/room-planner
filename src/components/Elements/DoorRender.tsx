import React, { useState } from 'react';
import { Group, Line, Arc, Circle, Text, Rect } from 'react-konva';
import type { Door, Wall, Point } from '../../types/editor';
import { COLORS } from '../../constants/editor';
import { pixelsToMm, formatDistance } from '../../utils/geometry';

interface DoorRenderProps {
  door: Door;
  wall?: Wall;
  onClick: (id: string) => void;
  onDrag?: (id: string, startPoint: Point, endPoint: Point) => void;
  onEndpointDrag?: (id: string, isStart: boolean, newPoint: Point) => void;
  isSelected?: boolean;
}

/**
 * Enhanced door render with:
 * - Arc showing door swing
 * - Visual door frame
 * - Draggable along wall
 * - Resizable endpoints
 * - Proper rotation based on wall
 */
export const DoorRender: React.FC<DoorRenderProps> = ({ 
  door,
  wall,
  onClick,
  onDrag,
  onEndpointDrag,
  isSelected = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  
  const midX = (door.startPoint.x + door.endPoint.x) / 2;
  const midY = (door.startPoint.y + door.endPoint.y) / 2;
  
  // Calculate door length
  const dx = door.endPoint.x - door.startPoint.x;
  const dy = door.endPoint.y - door.startPoint.y;
  const doorLength = Math.sqrt(dx * dx + dy * dy);
  
  // Get angle from wall, not from door points
  let angle = 0;
  if (wall) {
    const wallDx = wall.endPoint.x - wall.startPoint.x;
    const wallDy = wall.endPoint.y - wall.startPoint.y;
    angle = Math.atan2(wallDy, wallDx) * 180 / Math.PI;
  }
  
  const distance = pixelsToMm(doorLength);

  return (
    <>
      {/* Main door group with rotation */}
      <Group
        x={midX}
        y={midY}
        rotation={angle}
        draggable={isSelected && onDrag !== undefined && !isDraggingStart && !isDraggingEnd}
        onDragMove={(e) => {
          if (onDrag) {
            const dx = e.target.x() - midX;
            const dy = e.target.y() - midY;
            onDrag(door.id, 
              { x: door.startPoint.x + dx, y: door.startPoint.y + dy },
              { x: door.endPoint.x + dx, y: door.endPoint.y + dy }
            );
            e.target.position({ x: midX, y: midY });
          }
        }}
      >
        {/* Door frame/opening */}
        <Line
          points={[-doorLength / 2, 0, doorLength / 2, 0]}
          stroke={isSelected ? COLORS.wall.selected : isHovered ? '#f59e0b' : '#8b5cf6'}
          strokeWidth={8}
          lineCap="round"
          shadowBlur={isHovered || isSelected ? 6 : 0}
          shadowColor="rgba(0, 0, 0, 0.3)"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => onClick(door.id)}
          onTap={() => onClick(door.id)}
        />
        
        {/* Door swing arc */}
        <Arc
          x={-doorLength / 2}
          y={0}
          innerRadius={0}
          outerRadius={doorLength}
          angle={90}
          rotation={0}
          stroke={isSelected ? COLORS.wall.selected : '#8b5cf6'}
          strokeWidth={1.5}
          dash={[5, 5]}
          opacity={0.6}
          listening={false}
        />
        
        {/* Door panel (at 45 degrees) */}
        <Line
          points={[
            -doorLength / 2,
            0,
            -doorLength / 2 + doorLength * Math.cos(Math.PI / 4),
            -doorLength * Math.sin(Math.PI / 4)
          ]}
          stroke={isSelected ? COLORS.wall.selected : '#8b5cf6'}
          strokeWidth={3}
          lineCap="round"
          opacity={0.8}
          listening={false}
        />
        
        {/* Size label when selected */}
        {isSelected && (
          <Group>
            <Rect
              x={-35}
              y={15}
              width={70}
              height={20}
              fill="rgba(255, 255, 255, 0.9)"
              cornerRadius={4}
              shadowBlur={2}
              shadowColor="rgba(0, 0, 0, 0.1)"
              listening={false}
            />
            <Text
              x={-35}
              y={19}
              width={70}
              text={formatDistance(distance)}
              fontSize={12}
              fontStyle="bold"
              fill={COLORS.dimensions.text}
              align="center"
              listening={false}
            />
          </Group>
        )}
      </Group>
      
      {/* Endpoint handles in absolute coordinates (outside rotated group) */}
      {isSelected && onEndpointDrag && wall && (
        <>
          <Circle
            x={door.startPoint.x}
            y={door.startPoint.y}
            radius={6}
            fill={isDraggingStart ? '#f59e0b' : COLORS.wall.selected}
            stroke="white"
            strokeWidth={2}
            draggable
            dragBoundFunc={(pos) => {
              if (!wall) return pos;
              
              // Project position onto wall line
              const wallDx = wall.endPoint.x - wall.startPoint.x;
              const wallDy = wall.endPoint.y - wall.startPoint.y;
              const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
              
              if (wallLength === 0) return pos;
              
              const t = Math.max(0, Math.min(1,
                ((pos.x - wall.startPoint.x) * wallDx + (pos.y - wall.startPoint.y) * wallDy) / (wallLength * wallLength)
              ));
              
              return {
                x: wall.startPoint.x + t * wallDx,
                y: wall.startPoint.y + t * wallDy
              };
            }}
            onDragStart={() => setIsDraggingStart(true)}
            onDragMove={(e) => {
              onEndpointDrag(door.id, true, e.target.position());
            }}
            onDragEnd={() => setIsDraggingStart(false)}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = 'move';
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = 'default';
            }}
          />
          <Circle
            x={door.endPoint.x}
            y={door.endPoint.y}
            radius={6}
            fill={isDraggingEnd ? '#f59e0b' : COLORS.wall.selected}
            stroke="white"
            strokeWidth={2}
            draggable
            dragBoundFunc={(pos) => {
              if (!wall) return pos;
              
              // Project position onto wall line
              const wallDx = wall.endPoint.x - wall.startPoint.x;
              const wallDy = wall.endPoint.y - wall.startPoint.y;
              const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
              
              if (wallLength === 0) return pos;
              
              const t = Math.max(0, Math.min(1,
                ((pos.x - wall.startPoint.x) * wallDx + (pos.y - wall.startPoint.y) * wallDy) / (wallLength * wallLength)
              ));
              
              return {
                x: wall.startPoint.x + t * wallDx,
                y: wall.startPoint.y + t * wallDy
              };
            }}
            onDragStart={() => setIsDraggingEnd(true)}
            onDragMove={(e) => {
              onEndpointDrag(door.id, false, e.target.position());
            }}
            onDragEnd={() => setIsDraggingEnd(false)}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = 'move';
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = 'default';
            }}
          />
        </>
      )}
    </>
  );
};
