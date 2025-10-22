import React, { useState } from 'react';
import { Group, Line, Text, Rect, Circle } from 'react-konva';
import type { Wall, Point } from '../../types/editor';
import { calculateDistance, pixelsToMm, formatDistance, getPerpendicularOffset } from '../../utils/geometry';
import { COLORS, SELECTION_GLOW } from '../../constants/editor';

interface WallRenderProps {
  wall: Wall;
  onClick: (id: string) => void;
  onEndpointDrag?: (wallId: string, isStart: boolean, newPoint: Point) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  isSelected?: boolean;
  showDimensions?: boolean;
}

/**
 * Enhanced wall render component with:
 * - Hover effects
 * - Proper dimension positioning (perpendicular to wall)
 * - Selection glow
 * - Interactive handles
 */
export const WallRender: React.FC<WallRenderProps> = ({ 
  wall, 
  onClick,
  onEndpointDrag,
  onDragStart,
  onDragEnd,
  isSelected = false,
  showDimensions = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  
  const distance = pixelsToMm(calculateDistance(wall.startPoint, wall.endPoint));
  
  // Calculate perpendicular offset for dimension label
  const labelOffset = getPerpendicularOffset(wall.startPoint, wall.endPoint, 25);
  
  // Determine wall color based on state
  const wallColor = isSelected 
    ? COLORS.wall.selected 
    : isHovered 
    ? '#22c55e' // Green on hover
    : COLORS.wall.default;
  
  const strokeWidth = isSelected ? wall.thickness + 2 : wall.thickness;

  return (
    <Group>
      {/* Selection glow effect */}
      {isSelected && (
        <Line
          points={[
            wall.startPoint.x, 
            wall.startPoint.y, 
            wall.endPoint.x, 
            wall.endPoint.y
          ]}
          stroke={COLORS.wall.selected}
          strokeWidth={strokeWidth + SELECTION_GLOW}
          opacity={0.3}
          listening={false}
        />
      )}
      
      {/* Main wall line */}
      <Line
        points={[
          wall.startPoint.x, 
          wall.startPoint.y, 
          wall.endPoint.x, 
          wall.endPoint.y
        ]}
        stroke={wallColor}
        strokeWidth={strokeWidth}
        onClick={() => onClick(wall.id)}
        onTap={() => onClick(wall.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        hitStrokeWidth={Math.max(20, wall.thickness + 10)}
        shadowBlur={isHovered ? 8 : 0}
        shadowColor={isHovered ? 'rgba(34, 197, 94, 0.5)' : 'rgba(0, 0, 0, 0.3)'}
      />
      
      {/* Dimension label with proper positioning */}
      {showDimensions && (
        <Group>
          {/* Background for dimension */}
          <Rect
            x={labelOffset.x - 35}
            y={labelOffset.y - 12}
            width={70}
            height={24}
            fill={COLORS.dimensions.background}
            cornerRadius={6}
            shadowBlur={4}
            shadowColor="rgba(0, 0, 0, 0.1)"
            shadowOffsetY={2}
            listening={false}
          />
          
          {/* Dimension text */}
          <Text
            x={labelOffset.x}
            y={labelOffset.y - 8}
            text={formatDistance(distance)}
            fontSize={13}
            fontStyle="bold"
            fill={COLORS.dimensions.text}
            align="center"
            offsetX={35}
            listening={false}
          />
        </Group>
      )}
      
      {/* Endpoint handles (only visible when selected or hovered) */}
      {(isSelected || isHovered) && onEndpointDrag && (
        <>
          <Circle
            x={wall.startPoint.x}
            y={wall.startPoint.y}
            radius={8}
            fill={isDraggingStart ? '#f59e0b' : COLORS.wall.selected}
            stroke="white"
            strokeWidth={2}
            shadowBlur={isDraggingStart ? 8 : 4}
            shadowColor="rgba(0, 0, 0, 0.3)"
            draggable={isSelected}
            onDragStart={() => {
              setIsDraggingStart(true);
              onDragStart?.();
            }}
            onDragMove={(e) => {
              const newPoint = { x: e.target.x(), y: e.target.y() };
              onEndpointDrag?.(wall.id, true, newPoint);
            }}
            onDragEnd={() => {
              setIsDraggingStart(false);
              onDragEnd?.();
            }}
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
            x={wall.endPoint.x}
            y={wall.endPoint.y}
            radius={8}
            fill={isDraggingEnd ? '#f59e0b' : COLORS.wall.selected}
            stroke="white"
            strokeWidth={2}
            shadowBlur={isDraggingEnd ? 8 : 4}
            shadowColor="rgba(0, 0, 0, 0.3)"
            draggable={isSelected}
            onDragStart={() => {
              setIsDraggingEnd(true);
              onDragStart?.();
            }}
            onDragMove={(e) => {
              const newPoint = { x: e.target.x(), y: e.target.y() };
              onEndpointDrag?.(wall.id, false, newPoint);
            }}
            onDragEnd={() => {
              setIsDraggingEnd(false);
              onDragEnd?.();
            }}
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
      
    </Group>
  );
};
