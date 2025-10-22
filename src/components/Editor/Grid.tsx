import React from 'react';
import { Group, Line } from 'react-konva';
import { GRID_SIZE, GRID_MAJOR_SIZE, COLORS } from '../../constants/editor';

interface GridProps {
  width: number;
  height: number;
  offsetX?: number;
  offsetY?: number;
}

/**
 * Infinite dynamic grid component
 * Features:
 * - Minor grid lines (500mm / 50cm)
 * - Major grid lines (1000mm / 1m)
 * - Infinite in all directions
 * - Dynamically adjusts to viewport
 */
export const Grid: React.FC<GridProps> = ({ width, height, offsetX = 0, offsetY = 0 }) => {
  const minorLines: React.ReactElement[] = [];
  const majorLines: React.ReactElement[] = [];

  // Calculate visible bounds with large padding for infinite effect
  const startX = Math.floor((offsetX - width) / GRID_SIZE) * GRID_SIZE;
  const endX = Math.ceil((offsetX + width * 2) / GRID_SIZE) * GRID_SIZE;
  const startY = Math.floor((offsetY - height) / GRID_SIZE) * GRID_SIZE;
  const endY = Math.ceil((offsetY + height * 2) / GRID_SIZE) * GRID_SIZE;

  // Generate vertical lines
  for (let x = startX; x <= endX; x += GRID_SIZE) {
    const isMajor = x % GRID_MAJOR_SIZE === 0;
    const color = isMajor ? COLORS.grid.major : COLORS.grid.minor;
    const strokeWidth = isMajor ? 1.5 : 0.5;
    
    const line = (
      <Line
        key={`grid-v-${x}`}
        points={[x, startY, x, endY]}
        stroke={color}
        strokeWidth={strokeWidth}
        listening={false}
      />
    );
    
    if (isMajor) {
      majorLines.push(line);
    } else {
      minorLines.push(line);
    }
  }

  // Generate horizontal lines
  for (let y = startY; y <= endY; y += GRID_SIZE) {
    const isMajor = y % GRID_MAJOR_SIZE === 0;
    const color = isMajor ? COLORS.grid.major : COLORS.grid.minor;
    const strokeWidth = isMajor ? 1.5 : 0.5;
    
    const line = (
      <Line
        key={`grid-h-${y}`}
        points={[startX, y, endX, y]}
        stroke={color}
        strokeWidth={strokeWidth}
        listening={false}
      />
    );
    
    if (isMajor) {
      majorLines.push(line);
    } else {
      minorLines.push(line);
    }
  }

  return (
    <Group>
      {/* Render minor lines first (background) */}
      {minorLines}
      
      {/* Then major lines */}
      {majorLines}
    </Group>
  );
};
