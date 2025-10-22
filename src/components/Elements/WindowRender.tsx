import React, { useState } from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import type { Window, Wall, Point } from '../../types/editor';
import { COLORS } from '../../constants/editor';
import { pixelsToMm, formatDistance } from '../../utils/geometry';

interface WindowRenderProps {
  window: Window;
  wall?: Wall;
  onClick: (id: string) => void;
  onDrag?: (id: string, startPoint: Point, endPoint: Point) => void;
  onEndpointDrag?: (id: string, isStart: boolean, newPoint: Point) => void;
  isSelected?: boolean;
}

/**
 * Enhanced window render with:
 * - Visual glass effect
 * - Draggable along wall
 * - Resizable endpoints
 * - Hover effects
 */
export const WindowRender: React.FC<WindowRenderProps> = ({ 
  window,
  wall,
  onClick,
  onDrag,
  onEndpointDrag,
  isSelected = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDraggingStart, setIsDraggingStart] = useState(false);
  const [isDraggingEnd, setIsDraggingEnd] = useState(false);
  
  const midX = (window.startPoint.x + window.endPoint.x) / 2;
  const midY = (window.startPoint.y + window.endPoint.y) / 2;
  
  // Calculate window length
  const dx = window.endPoint.x - window.startPoint.x;
  const dy = window.endPoint.y - window.startPoint.y;
  const windowLength = Math.sqrt(dx * dx + dy * dy);
  
  // Get angle from wall, not from window points
  let angle = 0;
  if (wall) {
    const wallDx = wall.endPoint.x - wall.startPoint.x;
    const wallDy = wall.endPoint.y - wall.startPoint.y;
    angle = Math.atan2(wallDy, wallDx) * 180 / Math.PI;
  }
  
  const distance = pixelsToMm(windowLength);
  
  // Window dimensions
  const WINDOW_THICKNESS = 10;

  return (
    <>
      {/* Main window group with rotation */}
      <Group
        x={midX}
        y={midY}
        rotation={angle}
        draggable={isSelected && onDrag !== undefined && !isDraggingStart && !isDraggingEnd}
        onDragMove={(e) => {
          if (onDrag) {
            const dx = e.target.x() - midX;
            const dy = e.target.y() - midY;
            onDrag(window.id, 
              { x: window.startPoint.x + dx, y: window.startPoint.y + dy },
              { x: window.endPoint.x + dx, y: window.endPoint.y + dy }
            );
            e.target.position({ x: midX, y: midY });
          }
        }}
      >
        {/* Window frame */}
        <Rect
          x={-windowLength / 2}
          y={-WINDOW_THICKNESS / 2}
          width={windowLength}
          height={WINDOW_THICKNESS}
          fill={isSelected ? COLORS.wall.selected : isHovered ? '#94a3b8' : '#64748b'}
          cornerRadius={2}
          shadowBlur={(isHovered || isSelected) ? 4 : 0}
          shadowColor="rgba(0, 0, 0, 0.3)"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => onClick(window.id)}
          onTap={() => onClick(window.id)}
        />
        
        {/* Glass panes effect */}
        <Rect
          x={-windowLength / 2 + 2}
          y={-WINDOW_THICKNESS / 2 + 2}
          width={windowLength / 2 - 4}
          height={WINDOW_THICKNESS - 4}
          fill="rgba(173, 216, 230, 0.5)"
          cornerRadius={1}
          listening={false}
        />
        <Rect
          x={2}
          y={-WINDOW_THICKNESS / 2 + 2}
          width={windowLength / 2 - 4}
          height={WINDOW_THICKNESS - 4}
          fill="rgba(173, 216, 230, 0.5)"
          cornerRadius={1}
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
            x={window.startPoint.x}
            y={window.startPoint.y}
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
              onEndpointDrag(window.id, true, e.target.position());
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
            x={window.endPoint.x}
            y={window.endPoint.y}
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
              onEndpointDrag(window.id, false, e.target.position());
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
